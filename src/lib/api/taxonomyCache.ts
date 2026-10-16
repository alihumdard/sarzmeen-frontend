import { api } from "./client";

/**
 * Process-level cache for taxonomy lookups.
 *
 * Categories, property types and locations change rarely but are fetched by
 * every add/edit form. Without this each visit re-requests all of them, which
 * is ~350ms per list before the form is usable.
 *
 * The promise is cached rather than the value, so two components mounting at
 * once share one request instead of racing.
 */
const TTL_MS = 5 * 60 * 1000;

type Entry = { promise: Promise<unknown>; at: number };

const cache = new Map<string, Entry>();

export function cachedGet<T>(path: string): Promise<T> {
  const hit = cache.get(path);

  if (hit && Date.now() - hit.at < TTL_MS) {
    return hit.promise as Promise<T>;
  }

  const promise = api<T>(path).catch((err) => {
    // Never cache a failure, or one blip poisons the form for 5 minutes.
    cache.delete(path);
    throw err;
  });

  cache.set(path, { promise, at: Date.now() });
  return promise;
}

/** Call after creating or editing taxonomy so forms pick the change up. */
export function clearTaxonomyCache(path?: string): void {
  if (path) cache.delete(path);
  else cache.clear();
}
