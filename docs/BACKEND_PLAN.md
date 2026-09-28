# Sarzameen.com - Backend Plan (Laravel)

Written for whoever builds the Laravel API. The Next.js frontend already
exists with mock data shaped like the responses described here, so the
contract below is not speculative - it is what the UI already reads.

---

## 1. Decisions taken

| Question | Decision | Why |
|---|---|---|
| Auth | **Sanctum SPA (cookie)** | The session cookie is `HttpOnly` + `SameSite`, so JS cannot read it and an XSS bug cannot steal it. CSRF is handled by Laravel. Bearer tokens would sit in `localStorage`, readable by any injected script. |
| Agent model | **One `agents` table, `agency_id` nullable** | An independent agent is just an agent with no agency. Joining an agency later is `UPDATE agents SET agency_id = ?` - no record migration, no duplicated dashboard code. |
| Roles | **spatie/laravel-permission** | Granular permissions per role, editable from the admin panel. The existing admin roles screen already renders a `keyPermissions` array. |

If a mobile app is added later, add a **second Sanctum guard** issuing
Bearer tokens for that client only. The web app keeps cookies.

---

## 2. Roles

Four roles, created by seeder:

| Role | Who | Dashboard |
|---|---|---|
| `admin` | Platform staff | Full admin panel (already built in the frontend) |
| `agency` | The person who registered a firm | Agency dashboard - team, listings, leads |
| `agent` | Works under an agency, **or** independent | Agent dashboard - own listings, own leads |
| `user` | Buyer / seller / renter | Account area - saved properties, inquiries |

### The ownership rule that shapes everything

> An **agency owner** is an `agency` role account.
> An **agent** may or may not belong to an agency.
> A **listing** always has one owner (`user`, `agent`, or `agency`) and,
> when the owner is an agency-bound agent, also carries that `agency_id`
> so the agency can see its team's work.

This is why listings store **both** `owner_id`/`owner_type` and a
denormalised `agency_id`. Without the second column, "show me everything
my agency has listed" becomes a join through every agent on every query.

---

## 3. Database schema

### Core identity

```
users
  id, name, email (unique), email_verified_at, password,
  phone, avatar, city,
  status          enum(pending, approved, rejected, suspended) default pending
  approved_at, approved_by (FK users, nullable)
  created_at, updated_at, deleted_at

  -- role comes from spatie: model_has_roles
```

Every account - buyer, agent, agency owner, admin - is a row here. The
role table decides what they are; the profile tables below add what that
role needs.

### Agencies

```
agencies
  id, user_id (FK users, unique)        -- the owner's login
  name, slug (unique), logo,
  city, address, description,
  agency_type,                           -- "Authorized Dealer" etc.
  established_year,
  phone, email, website,
  verified        boolean default false
  status          enum(pending, approved, rejected) default pending
  created_at, updated_at, deleted_at

agency_locations                         -- areas covered
  id, agency_id, name

agency_services                          -- checklist on the detail page
  id, agency_id, name
```

`agencies.user_id` is unique: one login runs one agency. An owner who also
wants a personal agent profile gets an `agents` row too - allowed, because
the tables are separate.

### Agents

```
agents
  id, user_id (FK users, unique)
  agency_id (FK agencies, NULLABLE)     -- NULL = independent agent
  slug (unique), title,                  -- "Property Expert"
  bio, years_experience, deals_closed,
  office_address,
  verified        boolean default false
  status          enum(pending, approved, rejected) default pending
  invited_by      (FK users, nullable)   -- set when an agency added them
  created_at, updated_at, deleted_at

agent_specializations
  id, agent_id, name

agent_languages
  id, agent_id, name
```

**`invited_by` matters.** An agent added by an agency owner is implicitly
trusted - auto-approve them. An agent who self-registers goes to the admin
queue. Same table, different `status` on creation.

### Taxonomy

```
categories                 -- Houses, Plots, Commercial
  id, name, slug (unique), description,
  parent_id (FK categories, nullable),
  status enum(active, inactive), featured boolean,
  created_at, updated_at

property_types             -- House, Flat, Shop
  id, category_id (FK categories),
  name, slug (unique), description,
  status, featured, created_at, updated_at

project_categories
  id, name, slug (unique), description,
  status, featured, created_at, updated_at

locations                  -- city / area tree
  id, parent_id (nullable), name, slug, type enum(city, area, society)
```

### Listings

```
properties
  id, slug (unique), reference (unique),   -- "SZ-125478"
  title, headline, description,

  owner_id, owner_type,                    -- polymorphic: User | Agent | Agency
  agency_id (FK agencies, NULLABLE),       -- denormalised, see rule above

  property_type_id (FK property_types),
  project_id (FK projects, nullable),
  location_id (FK locations),
  full_location,

  purpose        enum(sale, rent),
  price          decimal(15,2),
  negotiable     boolean,
  area_value     decimal(10,2),
  area_unit      enum(marla, kanal, sqft, sqyd),
  beds, baths, living_rooms, kitchens, car_parking, floors,   -- nullable

  furnishing      enum(furnished, semi, unfurnished) nullable,
  property_status enum(ready, under_construction, available_now) nullable,
  listed_by       enum(owner, agent, agency),

  status         enum(draft, pending, published, rejected, expired, sold),
  featured, verified   boolean,
  views          unsigned int default 0,
  published_at, expires_at,
  created_at, updated_at, deleted_at

property_images
  id, property_id, path, is_cover boolean, sort_order

property_features            -- amenity chips
  id, property_id, name

property_nearby_places
  id, property_id, name, distance, kind enum(park, road, airport, mall)
```

`status` carries the moderation flow. A listing is only public when
`status = published`. Admin sets that; the owner can only move it between
`draft` and `pending`.

### Projects

```
projects
  id, slug (unique), name,
  project_category_id (FK),
  developer, location_id, full_location,
  status,                      -- "Under Construction" etc.
  price_from, total_area, total_units,
  description, verified, featured,
  created_at, updated_at, deleted_at

project_images / project_amenities / project_payment_plans / project_highlights
  -- each: id, project_id, ...
```

A property may point at a project (`properties.project_id`), which is how
the public "Properties in DHA Lahore" section already works.

### Leads and content

```
inquiries
  id, property_id (nullable), project_id (nullable),
  agent_id (nullable), agency_id (nullable),
  name, email, phone, message,
  status enum(new, contacted, closed),
  created_at

testimonials   id, user_id (nullable), name, city, avatar, rating,
               purchase, quote, status enum(published, hidden), featured

faqs           id, question, answer, category,
               status enum(published, hidden), sort_order

blogs          id, author_id, title, slug, excerpt, body, cover,
               category_id, status, published_at
```

---

## 4. Registration and approval flow

```
  POST /register  role=user      ->  status = approved     (no gate)

  POST /register  role=agent     ->  status = pending      (admin approves)
                  agency_id NULL

  POST /register  role=agency    ->  status = pending      (admin approves)
                  + agencies row

  Agency owner invites a member  ->  status = approved     (agency vouched)
  POST /agency/agents                invited_by = owner
```

**Why buyers skip the queue:** gating them adds friction for the largest
group and protects nothing - a buyer cannot publish anything.

**Why agency-invited agents skip it:** the agency already passed review.
Making an admin approve each of a 30-person team is busywork. If that
turns out to be wrong, one line in the invite handler restores the gate.

A `pending` or `rejected` account **can log in** - it sees an "account
under review" screen instead of the dashboard. Blocking login instead
loses the person entirely and generates support mail.

---

## 5. Permissions

Seed these, then attach to roles:

```
properties.create        properties.edit.own     properties.edit.any
properties.delete.own    properties.delete.any   properties.publish
projects.*               (same shape)
agencies.manage.own      agencies.manage.any
agents.invite            agents.manage.own       agents.manage.any
users.view               users.approve           users.suspend
categories.manage        blogs.manage            testimonials.manage
faqs.manage              inquiries.view.own      inquiries.view.any
settings.manage          roles.manage
```

| Role | Gets |
|---|---|
| admin | everything |
| agency | `properties.create`, `.edit.own`, `.delete.own`, `agents.invite`, `agents.manage.own`, `agencies.manage.own`, `inquiries.view.own` |
| agent | `properties.create`, `.edit.own`, `.delete.own`, `inquiries.view.own` |
| user | `properties.create`, `.edit.own`, `.delete.own`, `inquiries.view.own` |

All three non-admin roles can create listings - that is the requirement.
What differs is **scope**: an agency's `.own` covers its whole team, an
agent's covers only itself.

Enforce scope in a **Policy**, not in controllers:

```php
// PropertyPolicy@update
public function update(User $user, Property $property): bool
{
    if ($user->can('properties.edit.any')) return true;
    if (! $user->can('properties.edit.own')) return false;

    // Agency owners can edit anything their team listed.
    if ($user->hasRole('agency')) {
        return $property->agency_id === $user->agency?->id;
    }

    return $property->owner_id === $user->id
        && $property->owner_type === User::class;
}
```

---

## 6. API surface

Base: `/api`. All mutating routes behind `auth:sanctum`.

### Auth
```
GET    /sanctum/csrf-cookie
POST   /api/register              { role, name, email, password, phone, city, ... }
POST   /api/login                 { email, password }
POST   /api/logout
GET    /api/me                    -> user + role + status + profile
POST   /api/forgot-password
POST   /api/reset-password
POST   /api/email/verify/{id}/{hash}
```

`GET /api/me` is what the frontend calls on boot to decide which dashboard
to render. It must return `role` and `status`, so a pending account can be
shown the review screen.

### Public (no auth)
```
GET  /api/properties              ?purpose&city&type&price_min&price_max&page
GET  /api/properties/{slug}
GET  /api/projects                /{slug}
GET  /api/agencies                /{slug}
GET  /api/agents                  /{slug}
GET  /api/categories              /property-types  /project-categories
GET  /api/blogs                   /{slug}
GET  /api/testimonials            /faqs
POST /api/inquiries
```

### Owner-scoped (agent / agency / user)
```
GET    /api/my/properties
POST   /api/my/properties
PUT    /api/my/properties/{id}
DELETE /api/my/properties/{id}
GET    /api/my/inquiries
GET    /api/my/stats              -- dashboard tiles

# agency only
GET    /api/agency/agents
POST   /api/agency/agents         -- invite; creates user + agent, approved
PUT    /api/agency/agents/{id}
DELETE /api/agency/agents/{id}
GET    /api/agency/properties     -- the whole team's listings
```

### Admin
```
GET    /api/admin/accounts        ?role=user|agent|agency
PATCH  /api/admin/accounts/{id}/status   { status }
GET    /api/admin/properties      ?status=pending
PATCH  /api/admin/properties/{id}/status
CRUD   /api/admin/categories      /property-types  /project-categories
CRUD   /api/admin/blogs  /testimonials  /faqs  /locations
GET    /api/admin/roles           PUT /api/admin/roles/{id}/permissions
GET    /api/admin/stats
```

### Response shape

Use API Resources and keep the envelope consistent - the frontend's
`lib/api/*.ts` functions already expect plain arrays and objects:

```json
{ "data": [], "meta": { "current_page": 1, "last_page": 4, "total": 31 } }
```

Field names inside `data` must match the TypeScript types in `src/types/`.
Where Laravel would default to `snake_case`, the Resource should emit the
`camelCase` the frontend already reads (`propertyCount`, `totalAgents`,
`joinedAt`, `createdAt`).

---

## 7. Build order

Each phase ends with something demonstrable. Do not start a phase before
the one above it works end to end.

**Phase 1 - Identity (start here)**
1. Laravel 11 + Sanctum + spatie/laravel-permission
2. `users`, `agencies`, `agents` migrations; roles + permissions seeder
3. Register / login / logout / me, with the approval statuses
4. Policies for account access
5. Frontend: wire `/login`, `/register` (the role picker already exists),
   and a `useAuth` hook reading `/api/me`

*Done when:* all four roles can register and log in, and `/api/me` returns
the right role and status.

**Phase 2 - Dashboards**
1. Route shell per role, guarded by role
2. `/api/my/stats` per role
3. Agency team management (`/api/agency/agents`)
4. Admin account approval queue (screens already built)

*Done when:* each role lands on its own dashboard, an agency can add an
agent, and an admin can approve or reject a pending account.

**Phase 3 - Taxonomy**
Categories, property types, project categories, locations. Small, and
everything after depends on it. The admin CRUD screens already exist and
call `lib/api/*.ts` - only those files change.

**Phase 4 - Properties** (the big one)
1. `properties` + child tables, image upload
2. Owner-scoped CRUD with the Policy from section 5
3. Admin moderation (`pending -> published`)
4. Public listing with filters + pagination
5. Frontend: replace `mockProperties.ts`

**Phase 5 - Projects**, same shape, plus project/property linking.

**Phase 6 - Content and leads:** inquiries, blogs, testimonials, FAQs.

---

## 8. Combined vs separate dashboards

You asked whether to combine. **Use one route tree, not four.**

```
/dashboard                -> redirects by role
/dashboard/properties     -> agent sees own, agency sees team, admin sees all
/dashboard/team           -> agency only
/dashboard/accounts       -> admin only
```

The pages are the same; what differs is the **scope of the query** and
which nav items render. Four separate trees would mean four copies of the
listings table to keep in sync. One tree with a scoped query and a
permission-filtered sidebar is less code and cannot drift.

The existing `/admin` panel stays as it is - it is genuinely different
work (moderation, taxonomy, system settings), not a scoped view of the
same data.

---

## 9. Security checklist

- [ ] `SANCTUM_STATEFUL_DOMAINS` and `SESSION_DOMAIN` set for the Next.js origin
- [ ] CORS `supports_credentials: true`; `withCredentials` on the frontend
- [ ] Rate-limit `login`, `register`, `forgot-password` (`throttle:5,1`)
- [ ] Every request validated in a FormRequest - never `$request->all()`
- [ ] Policies on every owner-scoped route; never trust an id from the client
- [ ] Uploads: validate mime and size, store outside the webroot, serve via
      a signed route or a CDN
- [ ] `status` transitions server-side only - a client must not be able to
      publish its own listing
- [ ] Soft-delete anything a user can remove
- [ ] Log admin approvals and rejections to the activity log
