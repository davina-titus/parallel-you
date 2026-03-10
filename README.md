# ✦ ParallelYou

> *What would your life look like if you made different choices?*

ParallelYou is an AI-powered multiverse simulator that generates 3 distinct life trajectories based on your background, goals, and risk tolerance — powered by Claude (Anthropic).

---

## ✨ Features

- **3 Parallel Timelines** — AI generates genuinely different career paths, not just variations
- **Salary Progression Chart** — visualize earnings across years 1, 3, 5, 10, 15, and 20
- **Compare Two People** — run simulations for two profiles side by side with a head-to-head breakdown
- **Export to PNG** — save your results as a high-res image
- **Dark / Light Mode** — full theme toggle with smooth transitions
- **Rich Inputs** — age range, education level, city, major, career goal, lifestyle priority, and risk tolerance

---

## 🖥 Demo

> *(Add your Vercel URL here once deployed)*

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/parallel-you.git
cd parallel-you
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚠️ API Key Setup

This app calls the Anthropic API. For **local development**, the call is made directly from the browser.

For **production**, you should proxy the request through a serverless function to keep your API key secret. See [`DEPLOY.md`](./DEPLOY.md) for full instructions.

---

## 🛠 Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Anthropic Claude API](https://www.anthropic.com/) (`claude-sonnet-4-20250514`)
- `html2canvas` for PNG export
- Pure CSS animations — no UI library

---

## 📁 Project Structure

```
parallel-you/
├── src/
│   └── App.jsx        # Main component (all UI + logic)
├── public/
├── DEPLOY.md          # Deployment guide (Vercel, Netlify, etc.)
└── README.md
```

---

## 🌐 Deploying

See [`DEPLOY.md`](./DEPLOY.md) for step-by-step instructions to deploy on Vercel (recommended), Netlify, or other platforms.

---

<p align="center">Built with ✦ and Claude · <a href="https://anthropic.com">Anthropic</a></p>
