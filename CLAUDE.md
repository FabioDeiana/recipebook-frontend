# RecipeBook — Frontend

A personal recipe website, built as a surprise gift. One owner (admin) manages her recipes; friends can browse without an account and submit their own recipes to a separate "Friends' Recipes" section.

The backend is a separate, finished project (Spring Boot) in `C:\Users\fdeia\Desktop\recipebook`. This file describes its API: treat it as the contract. If something here seems wrong, check the backend code instead of guessing.

## How to work with me

- Reply in **Italian**. All code, identifiers, UI text and API messages are in **English**.
- Keep answers short and step by step. One step at a time; wait for me before moving on.
- When a file changes, give or write the **complete file**, not fragments.
- Don't add features or dependencies I haven't asked for.

## Stack

- React + Vite, dev server on http://localhost:5173 (the only origin the backend's CORS allows)
- Backend on http://localhost:8080 — keep the base URL in `.env` as `VITE_API_URL=http://localhost:8080`, never hardcode it
- Creating the project: this folder already contains `CLAUDE.md`, so when `npm create vite@latest .` says the directory is not empty, choose to ignore the existing files (don't delete them)

## Auth

- Only one user: the admin. No registration. Friends never log in.
- `POST /api/auth/login` body `{ "username", "password" }` → `200 { "token": "..." }`; wrong credentials → `401 { message }`.
- Send the token on every protected request: `Authorization: Bearer <token>`. It lasts 7 days.
- A `401` on a protected request means the token is missing, expired or invalid → log out and go to the login page. **Note: this 401 has an empty body** (it comes from Spring Security, not from the error handler).
- `PATCH /api/auth/password` (protected) body `{ "currentPassword", "newPassword" }` (new: 8–72 chars) → `204`; wrong current password → `400`.
- All `GET /api/**` are public. Everything else needs the token, except `POST /api/auth/login` and `POST /api/friend-recipes`.
- Public GETs ignore an invalid token, so a stale token never breaks browsing.

## Error responses

```json
{ "message": "Recipe 'xyz' not found", "timestamp": "2026-10-06T15:39:06.51" }
```

Validation errors (`400`) list every invalid field:

```json
{ "message": "Validation failed",
  "errors": { "title": "Title is required", "ingredients[0].name": "Ingredient name is required" },
  "timestamp": "..." }
```

Nested fields use `ingredients[i].field` / `steps[i].field`. Status codes used: `400`, `401`, `404`, `429`, `500` (generic message only).

## Enums

- **Section**: `OWN` (her recipes), `FRIENDS` (submitted by friends)
- **Unit** — metric: `G`, `KG`, `ML`, `CL`, `DL`, `L`; US: `OZ`, `LB`, `FL_OZ`, `CUP`, `PINT`, `QUART`; common: `TSP`, `TBSP`, `PIECE`, `PINCH`, `TO_TASTE`. The API sends the raw values; display labels (e.g. "fl oz", "to taste") are up to the frontend.

## Recipes

All recipes are vegetarian or vegan — there are no diet flags and no difficulty field.

### `GET /api/recipes` (public) — list

Query params, all optional and combinable:

| Param | Meaning |
|---|---|
| `search` | case- and accent-insensitive, matches title, description, ingredient names, tag names ("tiramisu" finds "Tiramisù") |
| `section` | `OWN` or `FRIENDS` |
| `categoryId`, `tagId` | filter by one category / one tag |
| `favorite` | `true` / `false` |
| `page` | 0-based, default 0 |
| `size` | default 12, max 50 |
| `sort` | `field,asc` or `field,desc`; only `createdAt`, `updatedAt`, `title`, `lastCookedAt` (others → 400). Default `createdAt,desc`. `lastCookedAt,asc` = "not cooked in a while" (never-cooked first) |

Response:

```json
{
  "content": [ RecipeSummary, ... ],
  "page": { "size": 12, "number": 0, "totalElements": 3, "totalPages": 1 }
}
```

**RecipeSummary**: `id`, `title`, `slug`, `description`, `servings`, `prepTimeMinutes`, `cookTimeMinutes`, `favorite`, `imageUrl`, `lastCookedAt`, `section`, `authorName`, `createdAt`, `category { id, name }`, `tags [{ id, name }]` (sorted by name). No ingredients or steps.

### `GET /api/recipes/{slug}` (public) — detail, `404` if unknown

**RecipeDetail**: everything in RecipeSummary, plus `adaptedFrom`, `updatedAt`, and:
- `ingredients [{ id, name, quantity, unit, note }]` — `name` is lowercase; `quantity` can be `null` (e.g. `TO_TASTE`)
- `steps [{ stepNumber, description }]` — ordered, numbered from 1

Dates: `lastCookedAt` is `"YYYY-MM-DD"` or `null`; `createdAt` / `updatedAt` are local date-times without timezone.
`authorName` is set only for `FRIENDS` recipes. `adaptedFrom` is e.g. `"Adapted from Giulia's recipe"` or `null`. `imageUrl` is a plain URL string or `null` (image upload comes later).

### Admin actions (protected)

| Endpoint | Body | Response |
|---|---|---|
| `POST /api/recipes` | RecipeRequest | `201` RecipeDetail (section always `OWN`) |
| `PUT /api/recipes/{id}` | RecipeRequest | `200` RecipeDetail — replaces everything in the request; keeps section, authorName, favorite, lastCookedAt; slug changes only if the title changes |
| `DELETE /api/recipes/{id}` | — | `204` (works for OWN and FRIENDS) |
| `PATCH /api/recipes/{id}/favorite` | — | `200` RecipeDetail (toggles) |
| `PATCH /api/recipes/{id}/cooked` | — | `200` RecipeDetail (`lastCookedAt` = today) |
| `POST /api/recipes/{id}/adopt` | — | `201` RecipeDetail of the new OWN copy (only FRIENDS recipes, else `400`); the original stays |

Note: actions use the numeric `id`; the detail page URL uses the `slug`. After a `PUT` that changes the title, navigate to the new slug from the response.

**RecipeRequest**:

```json
{
  "title": "Pasta e Ceci",          // required, max 100
  "description": "…",               // optional, max 2000
  "servings": 4,                    // required, 1–100
  "prepTimeMinutes": 10,            // optional, >= 0
  "cookTimeMinutes": 30,            // optional, >= 0
  "imageUrl": "https://…",          // optional, max 255
  "adaptedFrom": "…",               // optional, max 255
  "categoryId": 3,                  // required, must exist
  "tagIds": [1, 3],                 // optional, must exist
  "ingredients": [                  // required, 1–30
    { "name": "chickpeas", "quantity": 400, "unit": "G", "note": "cooked" }
    // name required (max 100), unit required, quantity optional (> 0), note optional (max 255)
  ],
  "steps": [                        // required, 1–30
    { "description": "Warm the chickpeas." }   // required, max 2000; numbered by list order
  ]
}
```

Ingredients are matched by name (case-insensitive); unknown ones are created automatically, so the form can accept free text with autocomplete.

## Friend submissions

`POST /api/friend-recipes` (public) → `201` with **no body**. Same fields as RecipeRequest, minus `adaptedFrom`, plus:
- `authorName` — required, max 50
- `website` — **honeypot**: render it as a hidden field that humans don't see or tab into, always send it empty. If filled, the backend answers `201` but silently drops the recipe.

Categories and tags must be existing ones (friends can't create new ones). Max **5 submissions per hour per IP**: over the limit → `429 { message }` with a `Retry-After` header (seconds) — show a friendly "try again later".

## Categories, tags, ingredients

- `GET /api/categories` (public) → `[{ id, name }]`, in meal order (Breakfast → Drinks)
- `POST /api/categories` body `{ name }` → `201`; `PUT /api/categories/{id}` → `200`; `DELETE /api/categories/{id}` → `204`, or `400` if recipes use it (show the message)
- `GET /api/tags` (public) → `[{ id, name }]`, alphabetical
- `POST /api/tags` body `{ name }` → `201`; `DELETE /api/tags/{id}` → `204` (removes the tag from all recipes)
- Names max 50, unique ignoring case → duplicate = `400`
- `GET /api/ingredients?search=tom` (public) → up to 10 `[{ id, name }]`; empty search → `[]`. For the ingredient autocomplete in the recipe form.

## Frontend-only logic

- **Serving scaling** (nothing in the backend): `quantity * newServings / servings`; `TO_TASTE` and `null` quantities stay unchanged.

## Later (not now)

- Image upload with Cloudinary (for now `imageUrl` is a plain string)
- Optional AI recipe import
- Deploy (Koyeb or similar for the backend, online PostgreSQL); the frontend's production origin will then have to be added to the backend's `cors.allowed-origins`
