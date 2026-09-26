/**
 * Account shapes for the admin's user management screens.
 *
 * The public site has three kinds of account — a buyer/seller ("user"), an
 * agent working under an agency, and the agency itself. They share enough
 * fields to be managed by one screen, so a single type covers all three and
 * `role` picks which list a record belongs to.
 *
 * Mirrors the Laravel API's expected response so swapping the mock source
 * for real requests does not require touching the components.
 */

export type AccountRole = "user" | "agent" | "agency";

/**
 * Where a record sits in the approval flow.
 *
 * - `pending`  — registered, waiting on an admin decision
 * - `approved` — live on the public site
 * - `rejected` — turned down; not shown publicly
 */
export type AccountStatus = "pending" | "approved" | "rejected";

export type AccountUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: AccountRole;
  status: AccountStatus;
  /** City the account operates in. */
  city: string;
  /** Agency the account belongs to — agents only. */
  agency?: string;
  /** Person who runs the agency — agencies only. */
  owner?: string;
  /** Team size — agencies only. */
  totalAgents?: number;
  /** Listings this account has posted. */
  listings: number;
  /** ISO date the account registered. */
  joinedAt: string;
};
