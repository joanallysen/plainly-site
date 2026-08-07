# Plainly — deploy guide

## 1. Get API keys

- **Claude**: console.anthropic.com (a.k.a. platform.claude.com) → create an API key.
  New accounts get a small starter credit, no card required for the trial.
- **Gemini**: oogle AI Studio → create an API key.
  Model names may change over time; update /api/gemini.js if Google retires a model.

## 2. Deploy (Vercel)

```
npm i -g vercel      # if you don't have it
vercel login
vercel --prod
```

Accept the defaults — Vercel auto-detects the static `index.html` plus the
two functions in `/api`.

## 3. Set environment variables

```
vercel env add ANTHROPIC_API_KEY
vercel env add GEMINI_API_KEY
vercel --prod        # redeploy so the functions pick up the new env vars
```

Or set them in the dashboard: Project → Settings → Environment Variables.

## 4. Use it

Open your deployed URL, pick a sample document, choose a model from the
"Model:" dropdown, and press "Run Plainly →". The status line under each
result names which model produced it, so you can flip between Claude and
Gemini on the same document and compare.

## Notes

- Neither API key ever reaches the browser — both `api/claude.js` and
  `api/gemini.js` read the key server-side from environment variables and
  proxy the request.
- If a key is missing, the relevant call will return a clear error in the UI
  rather than failing silently.


Good Afternoon