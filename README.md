# S.C.I.O.N.

A personal AI research assistant with persistent memory, document retrieval, streaming chat, and configurable model connectivity.

## Features

- Conversational AI interface with streaming responses
- Persistent conversation sessions stored locally
- Research/document ingestion and lightweight retrieval
- OpenAI-compatible model integration via environment configuration
- Fallback local generation mode when no API key is configured
- Distinctive S.C.I.O.N. personality with scientific-genius character

## Getting started

1. Install dependencies:
   npm install
2. Copy the example environment file:
   cp .env.example .env.local
3. Optional: set an OpenAI-compatible API key and model:
   OPENAI_API_KEY=your_key
   OPENAI_MODEL=gpt-4o-mini
   AI_BASE_URL=https://api.openai.com/v1
4. Run the app:
   npm run dev
5. Open http://localhost:3000

## Environment variables

- OPENAI_API_KEY: API key for an OpenAI-compatible provider.
- OPENAI_MODEL: model name to use.
- AI_BASE_URL: base URL for an OpenAI-compatible endpoint.

## Notes

This app stores conversation and document data in local JSON files under `data/` for quick local use and experimentation.
