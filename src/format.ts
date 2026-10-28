/** Display helpers for spectator UI. Micro-USDC (6 decimals) → dollar string. */

export function microToUsd(micro: string): string {
  const n = Number(micro);
  if (!Number.isFinite(n)) return "—";
  return `$${(n / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Short b52 address for display: b52abc…wxyz. */
export function shortAddr(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
