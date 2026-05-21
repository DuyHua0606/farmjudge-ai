# FarmJudge AI

AI-powered crypto farming research assistant.

## Overview

FarmJudge AI helps users evaluate crypto projects through AI-generated analysis and structured farming signals.

Users can:

- Analyze farming potential
- Evaluate project risk
- Review ecosystem participation
- Generate actionable farming checklists

---

## Features

- AI-powered crypto project scanning
- Risk scoring engine
- Farm opportunity evaluation
- Beginner-friendly verdict generation
- URL-based project analysis
- Lightweight dashboard interface

---

## Tech Stack

- Next.js
- TypeScript
- OpenRouter
- Tailwind CSS
- Vercel

---

## Live Demo

https://farmjudge-ai-kappa.vercel.app

## Repository

https://github.com/DuyHua0606/farmjudge-ai

---

## Local Development

```bash
git clone https://github.com/DuyHua0606/farmjudge-ai

cd farmjudge-ai

npm install

cp .env.example .env.local

npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Environment Variables

```env
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-5.5
```

---

## Architecture

User URL
↓
API Route
↓
OpenRouter
↓
Analysis Engine
↓
Scoring + Verdict
↓
Frontend Dashboard

---

## Future Roadmap

- GenLayer integration
- On-chain reputation
- Semantic AI scoring
- Smart contract signal registry
- Multi-chain farming analytics

---

## Status

Current Version: MVP
Deployment: Production (Vercel)
