# GitHub App setup — Birthday Studio

Follow these steps to connect the local Birthday Studio dashboard to the
`Birthdays` repository. The dashboard runs on your computer; GitHub does not
host or publish it.

## 1. Create the GitHub App

Open [Create a GitHub App](https://github.com/settings/apps/new), then fill in
the form as follows:

| GitHub field | What to enter |
| --- | --- |
| **GitHub App name** | `Birthday Studio Dashboard` (if unavailable, use `Birthday Studio Dashboard - Adhyatm`) |
| **Homepage URL** | `https://github.com/adhyatmdev0apex-prog/Birthdays/tree/main/Ritika_mam's_stuff/dashboard` |
| **Callback / Redirect URL** | Leave blank |
| **Allow wildcard matching** | Leave off |
| **Expire user authorization tokens** | Leave off; this app does not use user authorization |
| **Request user authorization (OAuth) during installation** | Leave off |
| **Enable Device Flow** | Leave off |
| **Post installation / Setup URL** | Leave blank |
| **Redirect on update** | Leave off |
| **Webhook Active** | Turn off / uncheck |
| **Webhook URL and Secret** | Leave blank |

### Permissions

Under **Repository permissions**, set only:

- **Contents:** Read and write
- **Metadata:** Read-only (GitHub requires this and it is usually selected by
  default)

Leave every other repository, organization, account, and enterprise permission
at **No access**. Do not select any webhook events.

**Important:** GitHub's `Contents` permission is repository-wide; it cannot be
limited to one folder. During installation, limit this app to the `Birthdays`
repository only. The dashboard code itself reads and writes only the dashboard
draft and upload paths listed below.

Under **Where can this GitHub App be installed?**, choose:

- **Only on this account** — `@adhyatmdev0apex-prog`

Click **Create GitHub App**.

## 2. Install it on the Birthdays repository only

1. On the new App's settings page, open **Install App**.
2. Select the `adhyatmdev0apex-prog` account.
3. Choose **Only select repositories**.
4. Select **Birthdays** and install the App.
5. Do not grant it access to other repositories.

The installation ID is the number at the end of the installation settings URL.
You can find it by opening the account's **Settings → Applications → Installed
GitHub Apps → Configure** for this App. The URL will look similar to
`https://github.com/settings/installations/12345678`; in that example, the
installation ID is `12345678`.

## 3. Download and protect the private key

1. Return to the App's **General** settings.
2. Find **Private keys** and click **Generate a private key**.
3. GitHub downloads a `.pem` file. Copy it into this dashboard folder:

   ```text
   Ritika_mam's_stuff/dashboard/github-app-private-key.pem
   ```

4. Keep this key private. Do not paste it into chat, the browser, or source
   code. The dashboard's `.gitignore` excludes the key and `.env` file.

For a Render deployment, do not add the key to the connected Git repository.
Instead, add it as a Render Secret File as described below.

## 4. Configure the dashboard

In the `dashboard` folder, copy `.env.example` to a new file named `.env`.
Fill in the values:

```dotenv
GITHUB_APP_ID=YOUR_APP_ID
GITHUB_APP_INSTALLATION_ID=YOUR_INSTALLATION_ID
GITHUB_APP_PRIVATE_KEY_PATH=github-app-private-key.pem
GITHUB_OWNER=adhyatmdev0apex-prog
GITHUB_REPOSITORY=Birthdays
GITHUB_BRANCH=main
```

- **App ID:** shown near the top of the App's **General** settings.
- **Installation ID:** from the installed App's settings URL in step 2.
- Replace `YOUR_APP_ID` and `YOUR_INSTALLATION_ID` with the actual numbers; do
  not type the placeholder words literally.
- Keep the private-key path as shown if the `.pem` file is in the dashboard
  folder.

Do not upload or commit `.env` or the `.pem` file.

## 5. Configure Render

Render Secret Files are stored by Render, not committed to your connected Git
repository. In your Render service:

1. Open **Environment** and choose **Add Secret File**.
2. Set **Filename** to `github-app-private-key.pem`.
3. Paste the complete private key into **Contents**, including its existing
   `BEGIN` and `END` lines.
4. Add or update the environment variable
   `GITHUB_APP_PRIVATE_KEY_PATH` with this exact value:

   ```text
   /etc/secrets/github-app-private-key.pem
   ```

5. Ensure `GITHUB_APP_PRIVATE_KEY` is unset, since it takes precedence over the
   file path.
6. Save the changes and let Render deploy the service.

Keep the key only in Render's Secret File; do not paste it into source code,
commit it, or send it in chat.

## 6. Start and check the dashboard

Open a terminal in the dashboard folder and run:

```powershell
npm start
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173), then scroll to **GitHub App
connection**. The status should show the repository and **GitHub App**. If it
does not:

1. Confirm the App is installed on `Birthdays`.
2. Recheck the App ID, installation ID, owner, repository, branch, and key path
   in `.env`.
3. Confirm the `.pem` file is in the dashboard folder.
4. Stop the server with `Ctrl+C`, start it again with `npm start`, and reload
   the page.

When sync is enabled, saving a dashboard draft may create commits only at:

```text
Ritika_mam's_stuff/dashboard/studio-config.json
Ritika_mam's_stuff/dashboard/uploads/
```

The separate birthday tribute website is not changed or published.
