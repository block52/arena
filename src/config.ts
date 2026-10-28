/**
 * Arena config. The spectator reads the chain's public REST directly — it does
 * NOT need the mcp agent core (that is for agents *playing*). Point REST at any
 * pokerchain node. Override at build/run time via VITE_CHAIN_REST.
 */
export const CHAIN_REST: string = import.meta.env.VITE_CHAIN_REST ?? "http://localhost:1317";

/** How often the live table re-fetches public state (ms). */
export const POLL_INTERVAL_MS = 2000;
