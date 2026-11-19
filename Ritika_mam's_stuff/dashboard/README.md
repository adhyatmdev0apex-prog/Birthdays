# Birthday Studio Dashboard

A standalone, private dashboard for planning the Ritika Ma'am tribute. It is an
admin workspace only: it does not generate, replace, or publish the birthday
website. The tribute project's existing files are left untouched.

## Run locally

Requires Node.js 18 or newer. From this folder, run:

```powershell
npm start
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). The dashboard binds to
localhost only. Without GitHub App credentials, drafts are saved in
`studio-config.json` on this computer.

## Add photos and messages

Open the **Photos & messages** section in the dashboard to add a portrait, up
to four memory photos, their titles and captions, three birthday wishes, the
birthday-card message, and the final message and signature. Images must be JPG,
PNG, or WebP and no larger than 5 MB each. Save the draft to store uploads in
`uploads/` and their text and paths in `studio-config.json`.

The dashboard keeps these files as planning content in its own folder; it does
not insert them into or publish the separate tribute website.

## Reference blend

- **Scenes and animation direction:** `my-bros-birthday-main` is the reference
  for cinematic scene order, reveals, pacing, and motion.
- **Background, imagery, and writing direction:** `Chutu_X_mutt_chachus-bday`
  and `Mama-b;day` provide the family-photo, collage, warm-atmosphere, and
  personal-message references.
- Two explicitly selected local project photographs are served to this
  localhost-only dashboard as visual references. The source projects are never
  modified.

## Optional GitHub App sync

See [GITHUB_APP_SETUP.md](./GITHUB_APP_SETUP.md) for the complete
field-by-field creation, permission, installation, and local configuration
instructions.

The recommended connection is a GitHub App installed only on the Birthdays
repository. It needs:

- **Repository permissions:** Contents — Read and write; Metadata — Read-only.
- **Installation scope:** only the `Birthdays` repository.
- **No webhook, OAuth client secret, or browser token.**

Create the App, generate a private key, and install it on the repository. Copy
`.env.example` to `.env`, then set the App ID, installation ID, repository owner,
repository name, and branch. Keep the downloaded `.pem` key inside this folder
as `github-app-private-key.pem` (or update `GITHUB_APP_PRIVATE_KEY_PATH`).
Restart the dashboard after configuration.

When configured, the server uses short-lived installation tokens and can read
or update the draft and image files inside:

```text
Ritika_mam's_stuff/dashboard/studio-config.json
Ritika_mam's_stuff/dashboard/uploads/
```

The private key is read by the local server and is never sent to the browser.
GitHub's Contents permission is repository-wide (not folder-scoped), so install
the App on the Birthdays repository only. Dashboard code limits its own writes
to the paths above.
The dashboard does not modify the tribute website or publish a deployment. If
GitHub is unavailable, the dashboard reports the sync failure and keeps a
browser-local backup of the text draft.
