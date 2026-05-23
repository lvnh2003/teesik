import { localFetch } from "./core";

export type SyncState = {
  entity: string;
  status: string;
  last_synced_at?: string | null;
  last_started_at?: string | null;
  last_finished_at?: string | null;
  last_records_synced: number;
  last_error?: string | null;
  freshness: string;
};

export type SyncRun = {
  id: number;
  entity: string;
  status: string;
  started_at?: string | null;
  finished_at?: string | null;
  fetched_count: number;
  upserted_count: number;
  error?: string | null;
  logs: string[];
};

export const SyncService = {
  getStatus: async () => {
    return localFetch<{ success: boolean; data: { states: SyncState[]; runs: SyncRun[] } }>("/admin/sync/status");
  },

  trigger: async (entity?: "categories" | "products" | "vouchers" | "orders") => {
    return localFetch<{ success: boolean; data: { status: string; results: unknown[] }; message?: string }>("/admin/sync", {
      method: "POST",
      body: JSON.stringify(entity ? { entity } : {}),
    });
  },
};
