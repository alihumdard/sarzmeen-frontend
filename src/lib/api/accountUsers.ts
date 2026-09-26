import type {
  AccountRole,
  AccountStatus,
  AccountUser,
} from "@/types/accountUser";

/**
 * Account management API.
 *
 * This is the only file that knows where accounts come from. Each function
 * is async and returns what the Laravel endpoint is expected to return, so
 * wiring the real backend means replacing the body of each function with a
 * `fetch` — the pages calling them do not change.
 *
 *   listAccounts(role)            GET   /api/accounts?role={role}
 *   setAccountStatus(id, status)  PATCH /api/accounts/{id}/status
 *
 * Until then an in-memory array stands in for the database, so approvals
 * and rejections behave like the real thing for the rest of the session.
 */

const AVATAR = "/images/team-1.jpg";
const AGENCY_LOGO = "/images/agent-1.jpg";

const seed: AccountUser[] = [
  // ---- Website users -----------------------------------------------------
  {
    id: "u-1",
    name: "Imran Shah",
    email: "imran.shah@gmail.com",
    phone: "+92 300 4455661",
    avatar: AVATAR,
    role: "user",
    status: "approved",
    city: "Lahore",
    listings: 2,
    joinedAt: "2025-03-14",
  },
  {
    id: "u-2",
    name: "Nadia Khan",
    email: "nadia.khan@gmail.com",
    phone: "+92 321 7788992",
    avatar: AVATAR,
    role: "user",
    status: "approved",
    city: "Karachi",
    listings: 1,
    joinedAt: "2025-04-02",
  },
  {
    id: "u-3",
    name: "Tariq Mehmood",
    email: "tariq.mehmood@outlook.com",
    phone: "+92 333 1122334",
    avatar: AVATAR,
    role: "user",
    status: "pending",
    city: "Islamabad",
    listings: 0,
    joinedAt: "2026-09-18",
  },
  {
    id: "u-4",
    name: "Saima Riaz",
    email: "saima.riaz@gmail.com",
    phone: "+92 345 9988771",
    avatar: AVATAR,
    role: "user",
    status: "pending",
    city: "Lahore",
    listings: 0,
    joinedAt: "2026-09-22",
  },
  {
    id: "u-5",
    name: "Kamran Aslam",
    email: "kamran.aslam@gmail.com",
    phone: "+92 302 5566778",
    avatar: AVATAR,
    role: "user",
    status: "rejected",
    city: "Multan",
    listings: 0,
    joinedAt: "2026-08-30",
  },

  // ---- Agents ------------------------------------------------------------
  {
    id: "ag-1",
    name: "Ali Hassan",
    email: "ali.hassan@sarzmeen.com",
    phone: "+92 300 1234567",
    avatar: AVATAR,
    role: "agent",
    status: "approved",
    city: "Lahore",
    agency: "Sarzmeen Estate",
    listings: 48,
    joinedAt: "2025-01-20",
  },
  {
    id: "ag-2",
    name: "Ayesha Malik",
    email: "ayesha.malik@sarzmeen.com",
    phone: "+92 321 9876543",
    avatar: AVATAR,
    role: "agent",
    status: "approved",
    city: "Islamabad",
    agency: "Capital Property Advisors",
    listings: 36,
    joinedAt: "2025-02-11",
  },
  {
    id: "ag-3",
    name: "Usman Tariq",
    email: "usman.tariq@sarzmeen.com",
    phone: "+92 333 4445566",
    avatar: AVATAR,
    role: "agent",
    status: "approved",
    city: "Karachi",
    agency: "Skyline Marketing",
    listings: 52,
    joinedAt: "2025-02-25",
  },
  {
    id: "ag-4",
    name: "Sara Khan",
    email: "sara.khan@sarzmeen.com",
    phone: "+92 300 1234567",
    avatar: AVATAR,
    role: "agent",
    status: "pending",
    city: "Lahore",
    agency: "Sarzmeen Estate",
    listings: 0,
    joinedAt: "2026-09-20",
  },
  {
    id: "ag-5",
    name: "Zain Abbas",
    email: "zain.abbas@sarzmeen.com",
    phone: "+92 300 1234567",
    avatar: AVATAR,
    role: "agent",
    status: "pending",
    city: "Lahore",
    agency: "Sarzmeen Estate",
    listings: 0,
    joinedAt: "2026-09-24",
  },
  {
    id: "ag-6",
    name: "Hamza Raza",
    email: "hamza.raza@sarzmeen.com",
    phone: "+92 311 5566778",
    avatar: AVATAR,
    role: "agent",
    status: "rejected",
    city: "Multan",
    agency: "Prime Square Estate",
    listings: 0,
    joinedAt: "2026-08-12",
  },

  // ---- Agencies ----------------------------------------------------------
  {
    id: "agc-1",
    name: "Sarzmeen Estate",
    email: "info@sarzmeenestate.pk",
    phone: "+92 300 5551234",
    avatar: AGENCY_LOGO,
    role: "agency",
    status: "approved",
    city: "Lahore",
    owner: "Ali Hassan",
    totalAgents: 24,
    listings: 159,
    joinedAt: "2025-01-12",
  },
  {
    id: "agc-2",
    name: "Capital Property Advisors",
    email: "contact@capitalproperty.pk",
    phone: "+92 321 9876543",
    avatar: AGENCY_LOGO,
    role: "agency",
    status: "approved",
    city: "Islamabad",
    owner: "Ayesha Malik",
    totalAgents: 18,
    listings: 140,
    joinedAt: "2025-01-28",
  },
  {
    id: "agc-3",
    name: "Skyline Marketing",
    email: "hello@skylinemarketing.pk",
    phone: "+92 333 4445566",
    avatar: AGENCY_LOGO,
    role: "agency",
    status: "approved",
    city: "Karachi",
    owner: "Usman Tariq",
    totalAgents: 31,
    listings: 298,
    joinedAt: "2025-02-05",
  },
  {
    id: "agc-4",
    name: "Green Valley Realtors",
    email: "info@greenvalley.pk",
    phone: "+92 302 7778899",
    avatar: AGENCY_LOGO,
    role: "agency",
    status: "pending",
    city: "Lahore",
    owner: "Bilal Ahmed",
    totalAgents: 12,
    listings: 95,
    joinedAt: "2026-09-16",
  },
  {
    id: "agc-5",
    name: "Metro Estates",
    email: "contact@metroestates.pk",
    phone: "+92 345 1122334",
    avatar: AGENCY_LOGO,
    role: "agency",
    status: "pending",
    city: "Rawalpindi",
    owner: "Fatima Noor",
    totalAgents: 15,
    listings: 150,
    joinedAt: "2026-09-23",
  },
  {
    id: "agc-6",
    name: "Prime Square Estate",
    email: "info@primesquare.pk",
    phone: "+92 311 5566778",
    avatar: AGENCY_LOGO,
    role: "agency",
    status: "rejected",
    city: "Multan",
    owner: "Hamza Raza",
    totalAgents: 9,
    listings: 53,
    joinedAt: "2026-07-30",
  },
];

/** Stands in for the database until the API exists. */
let accounts: AccountUser[] = [...seed];

/** Simulates request latency so loading states are exercised. */
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listAccounts(role: AccountRole): Promise<AccountUser[]> {
  await delay();
  return accounts.filter((account) => account.role === role);
}

export async function setAccountStatus(
  id: string,
  status: AccountStatus,
): Promise<AccountUser> {
  await delay();

  const existing = accounts.find((account) => account.id === id);
  if (!existing) throw new Error(`Account not found: ${id}`);

  const updated: AccountUser = { ...existing, status };
  accounts = accounts.map((account) =>
    account.id === id ? updated : account,
  );
  return updated;
}
