import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicState, isSeatToAct, type GameState, type Player } from "../chain";
import { usePoll } from "../usePoll";
import { microToUsd, shortAddr } from "../format";
import { POLL_INTERVAL_MS } from "../config";

function Seat({ player, state }: { player: Player; state: GameState }) {
  const toAct = isSeatToAct(state, player.seat);
  const shown = player.holeCards && player.holeCards.length > 0;
  return (
    <div className={`rounded-lg border px-3 py-2 ${toAct ? "border-yellow-400 bg-yellow-400/10" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-white">{shortAddr(player.address)}</span>
        {toAct && <span className="text-xs font-semibold text-yellow-300">to act</span>}
      </div>
      <div className="mt-1 text-xs text-white/60">
        seat {player.seat} · {microToUsd(player.stack)} · {player.status}
      </div>
      {/* Opponent hole cards are absent in the public view; only voluntarily-shown
          cards appear (public info at showdown). Everyone else: hidden. */}
      <div className="mt-2 flex gap-1">
        {shown
          ? player.holeCards!.map((c, i) => (
              <span key={i} className="rounded bg-white px-1.5 py-0.5 text-xs font-bold text-black">{c}</span>
            ))
          : <span className="text-xs text-white/40">cards hidden</span>}
      </div>
    </div>
  );
}

export function WatchTable() {
  const { id } = useParams<{ id: string }>();
  const fetcher = useCallback((signal: AbortSignal) => getPublicState(id!, signal), [id]);
  const { data: state, error, loading } = usePoll(fetcher, POLL_INTERVAL_MS, [id]);

  return (
    <div className="min-h-screen bg-felt/30">
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-white/60 hover:text-white">← all tables</Link>
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">spectating</span>
        </div>

        {loading && !state && <p className="mt-6 text-white/60">Loading table…</p>}
        {error && <p className="mt-6 text-red-400">Connection problem: {error}</p>}

        {state && (
          <>
            <div className="mt-4 text-white">
              <span className="text-lg font-semibold">Hand #{state.handNumber}</span>
              <span className="ml-3 text-sm text-white/60">{state.round}</span>
            </div>

            {state.communityCards && state.communityCards.length > 0 && (
              <div className="mt-3 flex gap-2">
                {state.communityCards.map((c, i) => (
                  <span key={i} className="rounded bg-white px-2 py-1 font-bold text-black">{c}</span>
                ))}
              </div>
            )}

            {state.pots && state.pots.length > 0 && (
              <div className="mt-2 text-sm text-white/70">pot {microToUsd(state.pots[0])}</div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {state.players.map((p) => (
                <Seat key={p.seat} player={p} state={state} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
