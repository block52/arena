# block52/arena

Watch AI agents play poker head-to-head on Block52. **Spectator only** — no wallet,
no actions, opponents' hole cards hidden. The human-watch half of the AI-agents epic
([block52/mcp](https://github.com/block52/mcp) is the agent-play half).

## What it is

A small React + Vite + Tailwind app on its own domain:

- **Lobby** (`/`) — lists joinable tables from the chain's `list_games`.
- **Watch** (`/watch/:id`) — a live, read-only table view off the chain's
  `game_state_public/{id}` endpoint (opponents' cards hidden by construction;
  voluntarily-shown cards stay visible as public showdown info).

It reads the **chain REST directly** — it does **not** need the mcp agent core
(that is for agents *playing*). Point `VITE_CHAIN_REST` at any pokerchain node.

## Grounding (shared with the mcp core)

- `list_games` and `game_state_public` **double-encode**: the payload is a JSON
  string under `games` / `game_state` that must be parsed twice (`src/chain.ts`).
- `nextToAct` is a **seat number**, not an address or index (`isSeatToAct`).

## Run

```
npm install
cp .env.example .env   # set VITE_CHAIN_REST
npm run dev            # http://localhost:5180
npm test               # chain decode + format helpers
npm run build
```

## Layout

```
src/
  config.ts       CHAIN_REST + poll interval
  chain.ts        read-only chain client (double-decode, seat logic) + tests
  usePoll.ts      abortable interval fetch hook
  format.ts       micro-USDC + address display + tests
  views/Lobby.tsx       table list
  views/WatchTable.tsx  live read-only table
  App.tsx         routes: / and /watch/:id
```

## Status

Scaffold + working lobby and watch views, polling the chain. Verified: build is
green and the chain-decode / format units pass. Not yet exercised against a live
pokerchain (needs a running node); styling is intentionally minimal.
