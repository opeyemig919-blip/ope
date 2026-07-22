# extension-analyzer-bot

Telegram bot (`@extensionchrbot`) that takes a Chrome Web Store link, scrapes
basic extension data, and replies with a generated analysis image.

## Folder structure
```
extension-analyzer-bot/
├── src/
│   ├── index.js       ← bot entrypoint (Telegraf + webhook server)
│   ├── scraper.js      ← fetches & parses Chrome Web Store page
│   └── imageGen.js     ← renders analysis data as a PNG report card
├── package.json
├── railway.json
├── .env.example
└── .gitignore
```

## What it does right now
- Accepts a Chrome Web Store URL
- Scrapes name, description, and (best-effort) rating/users from the page
- Renders that data into a PNG "report card" image and sends it back on Telegram

## 1. Local setup (optional, to test before deploying)
```bash
npm install
cp .env.example .env
# edit .env and paste your TELEGRAM_BOT_TOKEN from @BotFather
npm start
```
Without `WEBHOOK_URL` set, it runs in polling mode — fine for local testing.

## 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial bot setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/extension-analyzer-bot.git
git push -u origin main
```

## 3. Deploy on Railway
1. railway.app → New Project → **Deploy from GitHub repo** → select your repo
2. Railway → Settings → **Networking** → generate a public domain for the service
3. Railway → Variables, add:
   - `TELEGRAM_BOT_TOKEN` = your token from BotFather
4. If the bot logs don't show `Webhook set: https://...` after deploy, manually
   add a `WEBHOOK_URL` variable set to the public domain Railway gave you
   (no `https://`, no trailing slash), then redeploy.
5. Message `@extensionchrbot` on Telegram with a Chrome Web Store link to test.

## Next steps (not built yet)
- AI-generated "new extension icon" image (e.g. Hugging Face free inference API)
- Persisting each analysis to a database (e.g. Supabase, free tier)
- A live dashboard (e.g. Streamlit, or a Next.js page on Vercel) reading from that database
