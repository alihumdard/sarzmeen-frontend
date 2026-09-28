# Sarzameen.com - Backend Kickoff Prompt

Paste this at the start of a session with whoever (or whatever) writes the
Laravel backend. It gives the project background and the exact scope of the
first milestone: auth and role management.

Read `BACKEND_PLAN.md` alongside it - this prompt is the brief, that file is
the specification.

---

## The prompt

> ### Project background
>
> Sarzameen.com is a **multi-vendor property marketplace for Pakistan**, in
> the mould of Zameen.com. The Next.js 16 frontend is already built and
> deployed; you are writing the **Laravel 11 API** behind it.
>
> The frontend currently runs on mock data held in `src/constants/*.ts` and
> `src/lib/api/*.ts`. Those mock modules were deliberately written as async
> functions returning the exact response shapes the real API should return,
> so swapping them for `fetch` calls is the only frontend change each
> endpoint needs. The TypeScript types in `src/types/` are the contract -
> match those field names exactly, in `camelCase`.
>
> ### Who uses it
>
> Four kinds of account:
>
> - **User** - a buyer, seller or renter. Browses listings, saves
>   favourites, sends inquiries, and may list a property of their own.
> - **Agent** - a property professional. Either **works under an agency**
>   or operates **independently**. Lists and manages properties, handles
>   the leads on them.
> - **Agency** - a firm. The person who registers it is the **owner**. The
>   owner adds team members as agents, and can see and manage everything
>   the whole team has listed.
> - **Admin** - platform staff. Approves accounts and listings, manages
>   taxonomy and content, configures roles and permissions.
>
> ### The rules that shape the data model
>
> 1. **Every account is a `users` row.** Role comes from
>    spatie/laravel-permission. Agencies and agents get an extra profile
>    row (`agencies` / `agents`) holding what that role needs.
>
> 2. **An agent may or may not have an agency.** Use one `agents` table
>    with a **nullable `agency_id`** - independent means NULL. Do not build
>    two tables; an agent joining an agency later must be an UPDATE, not a
>    migration between tables.
>
> 3. **A listing has one owner but two lookups.** Store polymorphic
>    `owner_id`/`owner_type` (User, Agent or Agency) *and* a denormalised
>    `agency_id`. The second column is what makes "everything my agency has
>    listed" a single indexed query instead of a join across every agent.
>
> 4. **Approval gates publication, not access.** A `pending` or `rejected`
>    account can still log in - it sees an "under review" screen. Buyers
>    are approved on registration (they cannot publish anything, so gating
>    them is friction with no benefit). Agents and agencies who
>    self-register go to the admin queue. An agent **invited by an agency
>    owner** is auto-approved, because the agency already passed review -
>    record who invited them in `invited_by`.
>
> 5. **Status transitions are server-side only.** A client must never be
>    able to set its own listing to `published`, or its own account to
>    `approved`.
>
> ### Technical decisions already made
>
> - **Auth: Laravel Sanctum in SPA (cookie) mode.** Chosen over Bearer
>   tokens because the session cookie is `HttpOnly`, so an XSS bug cannot
>   read it, and Laravel handles CSRF. If a mobile app is added later, add
>   a second guard issuing tokens for that client only - the web app keeps
>   cookies.
> - **Permissions: spatie/laravel-permission.** Roles and permissions must
>   be editable from the admin panel, so a hardcoded enum will not do.
> - **Authorisation lives in Policies**, never in controllers. The scope
>   difference between roles (an agency's "own" means its whole team; an
>   agent's means itself) belongs in one place.
>
> ### Milestone 1 - what to build now
>
> Only identity. Nothing about properties yet.
>
> 1. Fresh Laravel 11 app, Sanctum configured for the Next.js origin,
>    spatie/laravel-permission installed.
> 2. Migrations: `users` (with `status`, `approved_at`, `approved_by`),
>    `agencies`, `agents`, plus the small child tables for agency
>    locations/services and agent specializations/languages.
> 3. Seeder creating the four roles and the permission set, and one admin
>    account.
> 4. Endpoints:
>    - `POST /api/register` - accepts `role`, branches to create the right
>      profile row and set the right initial `status`
>    - `POST /api/login`, `POST /api/logout`
>    - `GET /api/me` - returns user, role, status and profile. The frontend
>      calls this on boot to pick a dashboard, so it must be complete.
>    - password reset and email verification
> 5. Policies covering who may view or edit an account.
> 6. Rate limiting on `login`, `register` and `forgot-password`.
>
> **Milestone 1 is done when** all four roles can register and log in, a
> pending agency sees the review screen rather than a dashboard, an admin
> can approve it, and `GET /api/me` returns the correct role and status in
> every case.
>
> ### How to work
>
> - Validate in FormRequests. Never `$request->all()`.
> - Return API Resources with `camelCase` fields matching `src/types/`.
> - Write a feature test per endpoint, including the negative cases: a
>   pending account trying to publish, an agent trying to edit another
>   agent's record, a user trying to reach an admin route.
> - Do not scaffold future milestones. Properties, projects and content
>   come later and their shapes may shift once real data exists.
>
> Before writing code, confirm back: the four roles, the approval rules,
> and which tables Milestone 1 creates. If anything above conflicts with
> what you find in the frontend types, say so rather than guessing.

---

## Notes for you (not part of the prompt)

**Why this prompt is shaped this way.** It leads with *who uses the system*
and *the rules*, not with a table list. A schema handed over without its
reasoning gets "improved" into something that breaks the frontend. The five
numbered rules are the ones a developer would otherwise get wrong - they
each encode a decision that looks arbitrary until you hit the case it
protects against.

**The confirmation request at the end** is there on purpose. It surfaces a
misunderstanding before a week of work rather than after.

**Scope discipline.** Milestone 1 deliberately excludes properties. It is
tempting to build the whole schema at once, but the property table is the
one most likely to change once real listings exist, and everything else
depends on identity being right first.
