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

export type CreateAccountInput = {
  name: string;
  email: string;
  password: string;
  role: AccountRole;
  phone?: string;
  city?: string;
  /** Required when the role is "agency". */
  agencyName?: string;
  title?: string;
};

/**
 * Creates an account directly.
 *
 * Until this existed the only route in was the public register page, which
 * leaves agents and agencies pending — so adding a colleague meant asking
 * them to sign up and then approving them. An account created here is
 * approved on the spot.
 */
export async function createAccount(
  input: CreateAccountInput,
): Promise<AccountUser> {
  const res = await api<{ data: AccountUser }>("/admin/accounts", {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}
