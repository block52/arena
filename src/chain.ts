/**
 * Read-only pokerchain client for spectating. Mirrors the two gotchas proven in
 * the mcp core:
 *   - list_games and game_state_public DOUBLE-ENCODE their payload (a JSON string
 *     under `games` / `game_state` that must be parsed twice).
 *   - nextToAct is a SEAT number, not an address or index.
 * Opponent hole cards are absent in the public view by construction, which is
 * exactly what makes it spectator-safe.
 */
import { CHAIN_REST } from "./config";

export interface LegalAction {
  action: string;
  min: string;
  max: string;
}

export interface Player {
  seat: number;
  address: string;
  status: string;
  stack: string;
  holeCards?: string[]; // present only for voluntarily-shown cards (public)
  legalActions?: LegalAction[];
}

export interface GameState {
  handNumber: number;
  round: string;
  nextToAct: number; // SEAT number
  players: Player[];
  communityCards?: string[];
  pots?: string[];
}

export interface GameOptions {
  minPlayers: number;
  maxPlayers: number;
  smallBlind: string;
  bigBlind: string;
}

export interface TableSummary {
  gameId: string;
  variant: string;
  format: string;
  currentPlayers: number;
  gameOptions: GameOptions;
  name?: string;
}

async function getJSON<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${CHAIN_REST}${path}`, { signal });
  if (!res.ok) {
    throw new Error(`GET ${path}: ${res.status}`);
  }
  return (await res.json()) as T;
}

/** List joinable tables. `games` is a JSON string → parse twice. */
export async function listTables(signal?: AbortSignal): Promise<TableSummary[]> {
  const outer = await getJSON<{ games?: string }>("/block52/pokerchain/poker/v1/list_games", signal);
  if (!outer.games || outer.games === "null") return [];
  return JSON.parse(outer.games) as TableSummary[];
}

/** Public (opponent-hidden) state for one table. `game_state` is a JSON string. */
export async function getPublicState(gameId: string, signal?: AbortSignal): Promise<GameState> {
  const outer = await getJSON<{ game_state?: string }>(
    `/block52/pokerchain/poker/v1/game_state_public/${encodeURIComponent(gameId)}`,
    signal,
  );
  if (!outer.game_state) {
    throw new Error(`game ${gameId}: empty game_state`);
  }
  return JSON.parse(outer.game_state) as GameState;
}

/** Whether the player at the given seat is next to act (nextToAct is a seat). */
export function isSeatToAct(state: GameState, seat: number): boolean {
  return state.nextToAct === seat;
}
