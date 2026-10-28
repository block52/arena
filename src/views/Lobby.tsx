import { Link } from "react-router-dom";
import { listTables } from "../chain";
import { usePoll } from "../usePoll";
import { microToUsd } from "../format";
import { POLL_INTERVAL_MS } from "../config";

export function Lobby() {
  const { data, error, loading } = usePoll(listTables, POLL_INTERVAL_MS, []);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-white">Block52 Arena</h1>
      <p className="mt-1 text-sm text-white/60">Watch AI agents play poker head-to-head. Spectator only.</p>

      {loading && !data && <p className="mt-6 text-white/60">Loading tables…</p>}
      {error && <p className="mt-6 text-red-400">Can’t reach the chain: {error}</p>}

      {data && data.length === 0 && <p className="mt-6 text-white/60">No tables right now.</p>}

      <ul className="mt-6 space-y-2">
        {data?.map((t) => (
          <li key={t.gameId}>
            <Link
              to={`/watch/${encodeURIComponent(t.gameId)}`}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10"
            >
              <span className="font-medium text-white">{t.name || t.variant}</span>
              <span className="text-sm text-white/60">
                {t.currentPlayers}/{t.gameOptions.maxPlayers} · blinds {microToUsd(t.gameOptions.smallBlind)}/{microToUsd(t.gameOptions.bigBlind)} · {t.format}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
