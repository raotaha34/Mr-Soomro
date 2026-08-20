# Mr. Soomro RAG Chatbot

RAG chatbot API for the Mr. Soomro website. See "What you still have to do"
below — one thing remains that only you can do.

## What's tested and confirmed working
- Express server, routing, static file serving
- Local TF-IDF chunking + embedding + cosine similarity vector search
- RAG orchestration (retrieval -> prompt -> AI call)
- Lead capture with validation, saved to leads.json
- Admin key auth on GET /api/lead (tested: no header -> 401, wrong key -> 401, correct key -> 200)
- Rate limiting: /api/chat capped at 15 requests/minute per IP (tested: requests 16+ return 429)
- Rate limiting: /api/lead capped at 5 submissions/minute per IP
- Frontend chatbot widget (cream/orange brand)
- Honest failure mode when no Gemini API key is set (no fake answers)
- The real Gemini API call, verified end to end against the live API
- The website is served by the same server, so http://localhost:5000 works

## What you still have to do

Replace every file in knowledge/*.txt with real Mr. Soomro website copy.
Everything in there right now is placeholder text. Do not deploy with
placeholder content — the bot will confidently give customers wrong
information about your business.

## Setup

1. npm install
2. cp .env.example .env, then fill in GEMINI_API_KEY and ADMIN_API_KEY
3. npm run dev
4. Open http://localhost:5000 — the website and the chat widget are both
   served from there, and the API docs are at /api-docs

## Reading captured leads

GET /api/lead requires this header:
   x-admin-key: <your ADMIN_API_KEY value>

Example:
   curl -H "x-admin-key: YOUR_KEY" http://localhost:5000/api/lead

## Architecture

POST /api/chat  (rate limited: 15/min per IP)
  -> ragService.answerQuery()
     -> vectorService.search()       (TF-IDF cosine similarity over knowledge/*.txt)
     -> aiService.generateAnswer()   (Gemini API call with retrieved context)

POST /api/lead  (rate limited: 5/min per IP)
  -> leadService.saveLead()          (writes to leads.json)

GET /api/lead   (requires x-admin-key header)
  -> leadService.getAllLeads()

## Known limitations still open

1. TF-IDF search is keyword-based, not semantic. If retrieval quality is
   poor on real customer questions, upgrade embeddingService.js to a real
   embedding API (OpenAI, Voyage, Cohere).
2. In-memory vector store rebuilds from disk only on server restart. Editing
   knowledge/*.txt while the server runs won't apply until you restart it.
3. leads.json is a flat file, not a database. Fine for low volume; migrate
   to a real database (Postgres, SQLite) if lead volume grows.
4. Rate limiting is per-IP and resets on server restart (in-memory). Fine
   for a single small server; won't work correctly if you run multiple
   server instances behind a load balancer without a shared store.
5. Behind a reverse proxy, set TRUST_PROXY_HOPS to the number of proxies,
   otherwise every visitor shares one rate-limit bucket.
6. leads.json writes are not locked across processes. Fine for one server
   instance; use a database if you run more than one.

## Gemini-specific note

The model name is read from GEMINI_MODEL and defaults to gemini-flash-latest.
Google retires model names (gemini-pro and gemini-2.0-flash are both gone),
which shows up as a 404 from the API. To see what your key can use:

   curl "https://generativelanguage.googleapis.com/v1beta/models" -H "x-goog-api-key: $GEMINI_API_KEY"

Then set GEMINI_MODEL in .env to one of the listed names.

Overloaded-model responses (429/503) are retried up to three times with
backoff before /api/chat returns 503.
