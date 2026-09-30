import type {
  AccountRole,
  AccountStatus,
  AccountUser,
} from "@/types/accountUser";
import { api } from "./client";

export async function listAccounts(role: AccountRole): Promise<AccountUser[]> {
  const res = await api<{ data: AccountUser[] }>(
    `/admin/accounts?role=${role}&per_page=100`,
  );
  return res.data;
}

export async function setAccountStatus(
  id: string,
  status: AccountStatus,
): Promise<AccountUser> {
  const res = await api<{ data: AccountUser }>(
    `/admin/accounts/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
  return res.data;
}
