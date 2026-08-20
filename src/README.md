# Mr. Soomro RAG Chatbot

Full implementation of all 10 phases. Security gaps from the first version
have been fixed and tested. See "What you still have to do" below — three
things remain that only you can do.

## What's tested and confirmed working
- Express server, routing, static file serving
- Local TF-IDF chunking + embedding + cosine similarity vector search
- RAG orchestration (retrieval -> prompt -> AI call)
- Lead capture with validation, saved to leads.json
- Admin key auth on GET /api/lead (tested: no header -> 401, wrong key -> 401, correct key -> 200)
- Rate limiting: /api/chat capped at 15 requests/minute per IP (tested: requests 16+ return 429)
- Rate limiting: /api/lead capped at 5 submissions/minute per IP
- Frontend chatbot widget (cream/orange brand)
- Honest failure mode when no Groq API key is set (no fake answers)

## What is NOT tested — could not be tested in this environment
- The real Groq API call in aiService.js. No API key was available in
  the build sandbox. You must test this yourself with a real key.

## What you still have to do (in order)

1. Add your real GROQ_API_KEY to .env, run the server, and confirm
   the chatbot gives a real answer (not the "AI is not connected" message).

2. Set ADMIN_API_KEY in .env to any long random string. Without this,
   GET /api/lead returns 503 and you cannot view captured leads at all
   (fails closed by design — safer than leaving it open).

3. Replace every file in knowledge/*.txt with real Mr. Soomro website copy.
   Everything in there right now is placeholder text I wrote. Do not deploy
   with placeholder content — the bot will confidently give customers wrong
   information about your business.

## Setup

1. npm install
2. Edit .env:
   GROQ_API_KEY=gsk_...
   ADMIN_API_KEY=<any long random string>
3. npm run dev
4. Open http://localhost:5000

## Reading captured leads

GET /api/lead requires this header:
   x-admin-key: <your ADMIN_API_KEY value>

Example:
   curl -H "x-admin-key: YOUR_KEY" http://localhost:5000/api/lead

## Architecture

POST /api/chat  (rate limited: 15/min per IP)
  -> ragService.answerQuery()
     -> vectorService.search()       (TF-IDF cosine similarity over knowledge/*.txt)
     -> aiService.generateAnswer()   (Groq API call with retrieved context)

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

## Groq-specific note

Switched from Anthropic to Groq (src/services/aiService.js).
Free tier with generous limits.
Model used: openai/gpt-oss-20b.

IMPORTANT: The real Groq API call was NOT tested end-to-end during
development. The build sandbox's network does not allow outbound access
to api.groq.com, so only the failure paths were
tested (no key -> clean placeholder, invalid key -> clean 500 error,
no crash). You must test a real successful response yourself.
