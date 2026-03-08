# Google Indexing API — Setup (Phase 5)

The site can notify Google of new or updated article URLs via the **Indexing API** so they are discovered quickly. The API is called **server-side only** (credentials never go to the browser).

---

## 1. Google Cloud and Indexing API

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project or select an existing one.
3. Enable the **Indexing API**:
   - APIs & Services → **Library** → search for **Indexing API** → **Enable**.

---

## 2. Service account

1. APIs & Services → **Credentials** → **Create credentials** → **Service account**.
2. Name it (e.g. `ghnews-indexing`) → **Create and continue**.
3. (Optional) Add a role; the Indexing API is used with Search Console delegation, so the service account does not need a project role for Indexing.
4. **Done** → open the new service account → **Keys** tab.
5. **Add key** → **Create new key** → **JSON** → download the JSON file.
6. **Keep this file secret.** Do not commit it to git.

---

## 3. Search Console delegation

1. Open [Google Search Console](https://search.google.com/search-console) and select the property for **https://ghnewsmedia.com** (or your domain).
2. Go to **Settings** (left) → **Users and permissions**.
3. Click **Add user**.
4. Enter the **service account email** from the JSON key (e.g. `ghnews-indexing@your-project.iam.gserviceaccount.com`).
5. Set permission to **Full** (or the minimum that allows “URL Inspection” / indexing if your UI offers it).
6. Save.

Without this step, the Indexing API will return 403 for your property.

---

## 4. Credentials in the app

The app reads credentials in one of two ways.

### Option A: JSON string (recommended for Vercel / serverless)

1. Open the downloaded JSON key file.
2. Copy the **entire** JSON (one line or minified is fine).
3. In your host’s environment variables, add:
   - **Name:** `GOOGLE_INDEXING_CREDENTIALS_JSON`
   - **Value:** the pasted JSON string (no extra quotes; the value is the raw JSON).

Example (value is the JSON, not a path):

```bash
GOOGLE_INDEXING_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@....iam.gserviceaccount.com",...}
```

### Option B: Key file path (e.g. local or GCP)

1. Put the JSON key file on the server (e.g. in a secure directory).
2. Set:
   - **Name:** `GOOGLE_APPLICATION_CREDENTIALS`
   - **Value:** absolute path to the file, e.g. `/app/secrets/google-indexing-key.json`.

Option A is usually easier for Vercel, Netlify, etc., and keeps the key out of the repo.

---

## 5. Local development

- In the project root, create or edit **.env.local** (this file should be in **.gitignore**).
- Add one of:
  - `GOOGLE_INDEXING_CREDENTIALS_JSON=<paste full JSON here>`
  - or `GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-key.json`
- Restart the dev server so env vars are picked up.

If neither variable is set, the app still runs: the Indexing API is skipped and only sitemap pings are used.

---

## 6. How it’s used in the app

- **Trigger:** When an article is published or updated and the UI calls “notify search engines” (e.g. from the article page for recent articles or from the CMS edit screen after saving as published), the front end calls **POST /api/notify-indexing** with `{ category, slug }` (or `{ url }`).
- **Server:** The API route runs on the server, reads the credentials from env, calls the Google Indexing API with **URL_UPDATED** for the article URL, then pings the sitemap and notifies other search engines.
- **Security:** The service account JSON is only ever read on the server (env); it is never sent to the browser.

---

## 7. Troubleshooting

| Issue | What to check |
|-------|----------------|
| 403 from Indexing API | Service account email added in Search Console with at least Full (or URL Inspection) permission. |
| 401 / invalid token | Credentials in env are valid: correct JSON, or correct path and file contents. |
| No Indexing API call (only sitemap ping) | Env var not set or not loaded (restart server after changing env). |
| “Missing or invalid url” from API | Request body must include either `url` or both `category` and `slug`. |

---

*Part of the SEO Implementation Plan (Phase 5). See [SEO-IMPLEMENTATION-PLAN.md](./SEO-IMPLEMENTATION-PLAN.md).*
