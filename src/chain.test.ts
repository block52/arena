import { describe, it, expect, vi, afterEach } from "vitest";
import { listTables, getPublicState, isSeatToAct, type GameState } from "./chain";

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: async () => body,
    }),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("listTables", () => {
  it("double-decodes the games string", async () => {
    const games = [
      { gameId: "b52t1", variant: "texas-holdem", format: "cash", currentPlayers: 2, gameOptions: { minPlayers: 2, maxPlayers: 6, smallBlind: "1000000", bigBlind: "2000000" } },
    ];
    mockFetchOnce({ games: JSON.stringify(games) });
    const out = await listTables();
    expect(out).toHaveLength(1);
    expect(out[0].gameId).toBe("b52t1");
    expect(out[0].gameOptions.bigBlind).toBe("2000000");
  });

  it("returns [] when games is null-ish", async () => {
    mockFetchOnce({ games: "null" });
    expect(await listTables()).toEqual([]);
  });
});

describe("getPublicState", () => {
  it("double-decodes the game_state string", async () => {
    const state = { handNumber: 1, round: "preflop", nextToAct: 3, players: [{ seat: 3, address: "b52bob", status: "active", stack: "100" }] };
    mockFetchOnce({ game_state: JSON.stringify(state) });
    const out = await getPublicState("b52t1");
    expect(out.round).toBe("preflop");
    expect(out.players[0].address).toBe("b52bob");
  });

  it("throws on empty game_state", async () => {
    mockFetchOnce({});
    await expect(getPublicState("b52t1")).rejects.toThrow(/empty game_state/);
  });
});

describe("isSeatToAct", () => {
  const state: GameState = { handNumber: 1, round: "flop", nextToAct: 3, players: [] };
  it("matches by seat number, not index", () => {
    expect(isSeatToAct(state, 3)).toBe(true);
    expect(isSeatToAct(state, 1)).toBe(false);
  });
});
