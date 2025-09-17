Netlify deployment and GoDaddy domain setup

This guide shows how to deploy the Next.js project to Netlify and connect a GoDaddy domain. I do not perform any network operations for you — follow these steps locally.

Prerequisites
- A Git repository (GitHub, GitLab, or Bitbucket) with this project pushed.
- A Netlify account (https://app.netlify.com/).
- Your GoDaddy account credentials and the domain you purchased.

1) Ensure your repo is pushed to GitHub

```pwsh
# create a repo locally (if you haven't)
git init
git add .
git commit -m "Prepare for Netlify deployment"
# create remote and push (replace URL with your GitHub repo)
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

2) Add Netlify config file (already added)
- `netlify.toml` is included at project root. It configures the Next.js plugin and sets the build command.

3) Install plugin locally (optional but recommended to match Netlify build environment)

```pwsh
npm install --save-dev @netlify/plugin-nextjs
```

4) Create a new site on Netlify
- Login to Netlify.
- Click "Add new site" → "Import from Git".
- Select your Git provider and the repository.
- For the build command, use: `npm run build`.
- For the publish directory, leave as default (Netlify will use the Next.js plugin to handle this).
- In "Advanced build settings" you can add environment variables if needed (e.g., `NODE_VERSION`).

5) Deploy and verify
- Trigger a deploy by clicking "Deploy site" in Netlify.
- After build completes, open the site URL Netlify gives you and verify the app loads.

6) Connect your GoDaddy domain to Netlify
Option A — Use Netlify DNS (recommended)
- In Netlify, go to Site settings → Domain management → Add custom domain → Enter your domain.
- Choose "Set up Netlify DNS". Netlify will ask you to change your domain's nameservers to Netlify's nameservers.
- In GoDaddy:
  - Open your domain management page.
  - Find "Nameservers" and choose "Change".
  - Select "Custom" and paste Netlify's nameservers (provided by Netlify during setup).
  - Save. Nameserver changes can take up to 48 hours, usually much faster.

Option B — Use A and CNAME records (if you prefer to keep GoDaddy nameservers)
- In Netlify, add your custom domain to the site (Site settings → Domain management → Add custom domain).
- Netlify will give you a set of DNS records to add (usually a CNAME for `www` and A records for the apex/root domain).
- In GoDaddy DNS management, add or edit records accordingly.
  Example:
  - Type: A | Host: @ | Points to: <Netlify A record IP> | TTL: 600
  - Type: CNAME | Host: www | Points to: <your-site>.netlify.app | TTL: 600
- Save changes. DNS propagation may take up to 48 hours.

7) Force HTTPS
- After DNS is live, in Netlify domain settings enable "HTTPS" — Netlify will provision a Let's Encrypt certificate automatically.

Troubleshooting
- Builds failing on Netlify? Check the deploy logs in Netlify. Ensure `@netlify/plugin-nextjs` is installed or present in `netlify.toml` plugins list.
- If Next.js needs specific environment variables (API keys), add them in Netlify site environment variables.
- If your site 404s on client-side navigation, ensure you're using the App Router correctly; Netlify's Next plugin supports Next.js App Router.

Additional notes
- If you prefer CI/CD with GitHub Actions or other providers, Netlify also supports connecting via Git.
- If you want me to walk through the Netlify UI steps or prepare GitHub Actions instead, tell me which option you prefer.

Validation checklist (what to verify after deploy)

1) Build succeeded on Netlify
- Open the Netlify site deploy logs and confirm the build step (`npm run build`) completed with exit code 0.

2) Site content loads
- Visit the Netlify-provided URL (e.g., `https://your-site-name.netlify.app`) and verify the app renders. Check both `/` and `/obs` routes.

3) DNS is configured and TLS works
- If you used Netlify DNS (nameservers), confirm the domain on Netlify shows `Verified` and HTTPS is `Provisioned`.
- If you used GoDaddy DNS records, use `nslookup` or `dig` to confirm the A/CNAME records point to Netlify, then check the domain in a browser via `https://your-domain.com`.

Commands for quick DNS checks (PowerShell)

```pwsh
# check the www CNAME
Resolve-DnsName -Name www.your-domain.com -Type CNAME
# check the apex A record
Resolve-DnsName -Name your-domain.com -Type A
```

If any of these fail, double-check the DNS records in GoDaddy and the custom domain entries in Netlify.

If you're ready, push your changes to GitHub and I will give the exact next UI steps to connect the repo to Netlify and configure the domain.

