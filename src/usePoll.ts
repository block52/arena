import { useEffect, useRef, useState } from "react";

interface PollState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * Polls an async fetcher on an interval with abort-on-unmount. A dropped fetch
 * sets `error` but keeps the last `data` so the view does not flash empty.
 */
export function usePoll<T>(fetcher: (signal: AbortSignal) => Promise<T>, intervalMs: number, deps: unknown[]): PollState<T> {
  const [state, setState] = useState<PollState<T>>({ data: null, error: null, loading: true });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const tick = async () => {
      try {
        const data = await fetcherRef.current(controller.signal);
        if (!cancelled) setState({ data, error: null, loading: false });
      } catch (e) {
        if (cancelled || controller.signal.aborted) return;
        setState((prev) => ({ data: prev.data, error: e instanceof Error ? e.message : String(e), loading: false }));
      }
    };

    void tick();
    const id = setInterval(() => void tick(), intervalMs);
    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
