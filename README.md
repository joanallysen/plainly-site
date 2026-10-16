# Plainly

https://github.com/user-attachments/assets/04b851c8-ace7-4583-ab36-bce1f20b8578

**Plain English for official documents.**

Plainly takes dense official text, such as a government letter, a tax notice or a council notice, and rewrites it in plain English. It was designed with Deaf New Zealanders in mind. NZSL (New Zealand Sign Language) is a language in its own right, and for many people who use it as a first language, English is a second language. Official documents are often hard to follow.

> **Prototype.** Plainly is a best attempt at applying published plain-language accessibility research. It is not a verified or finished solution, and it has **not yet been tested with Deaf or NZSL-first readers**.

## Features

- **Three sample documents:** a Work and Income letter, an IRD tax notice and a council enforcement letter.
- **Paste your own text** or **upload a PDF** (text is extracted in your browser).
- **Step 1: flagging.** Highlights problem areas in the original: idioms and legalese, passive voice, jargon (hover for a plain meaning) and long sentences.
- **Steps 2 to 3: AI rewrite and self-check.** Gemini rewrites the text following a set of plain-language rules, then a second pass checks the rewrite against the same rules and fixes any violations.
- **"What changed, and why" panel** listing the main edits, each with a short label such as passive voice, idiom or jargon.

## Current status

- **Gemini** is the only AI provider in use.
- **Claude is not used right now.** `api/claude.js` exists in the repo, but the frontend does not call it, mainly because of API cost. It may be wired in later.
- The app currently runs **locally** through a small Express server. Hosting is planned but not done yet.

## Tech stack

- **Frontend:** a single static `index.html` (HTML, CSS and vanilla JavaScript)
- **PDF reading:** [pdf.js](https://mozilla.github.io/pdf.js/) 3.11.174, loaded from a CDN
- **Backend:** Node.js 18+ with Express 5 and dotenv
- **AI:** Google Gemini API, model `gemini-3.1-flash-lite`

## Project structure

```
plainly-site/
├── api/
│   ├── gemini.js     # Proxy to the Gemini API (keeps the key on the server)
│   └── claude.js     # Proxy for Claude (present, but not used yet)
├── .env              # Your API key (never commit this)
├── .gitignore
├── index.html        # The whole frontend
├── package.json
├── README.md
└── server.js         # Local Express server
```

## Installation

1. Install [Node.js](https://nodejs.org/) 18 or newer. Check with `node -v`.
2. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/joanallysen/plainly-site.git
   cd plainly-site
   npm install
   ```
3. Create a `.env` file in the project root:
   ```
   GEMINI_API_KEY=your_key_here
   ```
   Get a key from [Google AI Studio](https://aistudio.google.com). Never commit this file.
4. Start the app:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000), pick a sample and press **Run Plainly →**.

Open the app through `localhost:3000`. Opening `index.html` directly from your files will not work, because the page needs the `/api/gemini` route from the server.

## Configuration

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key |
| `PORT` | No | Port for the local server (defaults to 3000) |

If Google retires or renames the model, update the model name in `api/gemini.js`.

## How it works

1. **Input.** The text comes from a sample, the paste box or an uploaded PDF. PDF text is extracted in the browser with pdf.js and never leaves your machine at this stage.
2. **Step 1: flagging (no AI).** The browser scans the original with simple rules and highlights matches:
   - **Idioms and legalese:** a fixed list of phrases such as "pursuant to" and "hereby"
   - **Passive voice:** a pattern match on forms like "was reviewed" or "is required"
   - **Jargon:** a small built-in glossary of terms, each with a plain meaning shown on hover
   - **Long sentences:** sentences over 25 words
3. **Step 2: rewrite.** The browser sends the text to `POST /api/gemini`. The server adds the API key, calls Gemini, and returns the result. Gemini rewrites the text and lists the main changes.
4. **Step 3: self-check.** A second request asks Gemini to check the rewritten text against the rules and correct any remaining problems.
5. **Output.** The final text and the "What changed, and why" panel are shown next to the flagged original.

Each run makes two Gemini requests. The flagging step is free because it runs in the browser.

### The rewrite rules

Gemini is instructed to:

1. Use no passive voice, and always name who is doing the action
2. Avoid idioms and legal filler phrases
3. Put one idea in each sentence
4. Keep sentences short, aiming for under 18 words
5. Use plain, everyday vocabulary
6. Briefly explain any legal or technical term that must stay, in brackets, the first time it appears

## Security and privacy

- The API key stays on the server. The browser never sees it.
- Do not commit `.env`. Make sure it is listed in `.gitignore`. If a key is ever pushed by accident, revoke it and create a new one.
- Text you submit is sent to Google's Gemini API for processing. Avoid submitting documents that contain sensitive personal information.

## Known limitations

- **Plain English is not NZSL.** Plainly does not translate to NZSL or apply NZSL grammar. It is most useful to Deaf readers who already have some English literacy, and it does not close the access gap on its own.
- **Untested with the intended audience.** The next necessary step is testing with Deaf and NZSL-first readers.
- **Rule-based flagging is limited.** It only catches phrases on its lists and a simple passive-voice pattern, so it misses irregular verbs and can flag some false positives. The glossary contains 12 terms.
- **The self-check does not see the original document.** It checks the rewrite against the rules, but it cannot tell whether the meaning has drifted. Always review the output before relying on it.
- **Long documents may fail.** The output limit is 1000 tokens, so a very long document can produce truncated output and an error.
- **Text-based PDFs only.** There is no OCR, so scanned PDFs will not extract properly.
- **AI output can be wrong.** Do not rely on the rewritten text for legal, financial or health decisions. Check the original document or ask the issuing agency.

## Roadmap

- Wire in Claude as an optional model
- Deploy to a hosting service
- Test with Deaf and NZSL-first readers and revise based on their feedback
