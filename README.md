# Browser Session Recorder

A full browser interaction recorder built using **Next.js + TypeScript**.

## Features
- Click tracking (with screenshot)
- Keypress tracking (Enter/Escape/Tab)
- Input commits (input, textarea, contenteditable)
- SPA route changes detection (history patch + popstate)
- Tab visibility events
- Screenshot capture using html2canvas
- Chat-style UI showing all events
- Export full **PDF session report**
- Password fields are skipped
- Screenshot throttling (800ms)

## Run Locally
```bash
npm install
npm run dev
