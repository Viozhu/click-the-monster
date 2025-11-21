# Click The Monster

A clicker game built with React, TypeScript, Vite, TanStack Query, Zustand, TailwindCSS, and Framer Motion.

## Features

- 🎮 Click monsters to deal damage
- ⚡ Automatic DPS (Damage Per Second)
- 💰 Earn gold by defeating monsters
- 🛒 Buy upgrades to increase damage and DPS
- 📈 Monsters scale in difficulty as levels increase
- ✨ Smooth animations with Framer Motion
- 🎨 Beautiful UI with TailwindCSS

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Game Mechanics

- **Click Damage**: Start with 0.1 damage per click
- **DPS**: Start with 0 DPS (can be upgraded)
- **Monster Scaling**: HP = 10 × (1.25^level), Reward = 1 × (1.2^level)
- **Upgrade Scaling**: Cost = baseCost × (1.15^timesBought)

## Tech Stack

- React 18
- TypeScript
- Vite
- TanStack Query (React Query)
- Zustand (State Management)
- TailwindCSS
- Framer Motion
