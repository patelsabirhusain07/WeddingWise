<div align="center">

# 💍 WeddingWise
### *Modern Luxury & Budget Wedding Planning Platform*

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  A complete wedding budgeting and event orchestration system. Set your real budget ceiling, calculate category shares, track actual vendor bills, record advance payments, manage guest RSVPs, and generate printable PDF financial reports.
</p>

[How to Run](#-how-to-run-this-application) •
[Core Features](#-core-features) •
[User Guide](#-how-to-use-the-platform) •
[Project Architecture](#-project-architecture) •
[Scripts](#-available-scripts)

</div>

---

## 🚀 How to Run This Application

Follow these steps to set up and run **WeddingWise** on your computer.

### 1. Prerequisites

Make sure you have **Node.js** installed on your system:
- **Node.js**: `v18.0.0` or higher (recommended: `v20+` or `v24+`)
- **npm** (comes bundled with Node.js) or **pnpm** / **yarn**

To check if Node.js is installed, run:
```bash
node -v
npm -v
```
*(If not installed, download it from [nodejs.org](https://nodejs.org/)).*

---

### 2. Step-by-Step Setup

#### Step 1: Clone or Open the Repository
```bash
git clone https://github.com/patelsabirhusain07/WeddingWise.git
cd WeddingWise
```
*(If you already have the folder opened in VS Code or Antigravity terminal, you can skip `git clone`).*

#### Step 2: Install Dependencies
Install all required packages (React, TypeScript, Lucide Icons, jsPDF, Tailwind CSS, Canvas-Confetti):
```bash
npm install
```

#### Step 3: Start the Development Server
Run the local Vite development server:
```bash
npm run dev
```

#### Step 4: Open in Your Browser
Once the server starts, you will see output like this:
```
  VITE v6.x.x  ready in 400 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```
👉 Click or visit: **[http://localhost:5173/](http://localhost:5173/)** in your web browser.

---

### 3. Build for Production Deployment

To generate an optimized, minified production build:
```bash
npm run build
```
This will compile all TypeScript and CSS into the `dist/` directory.

To test and preview the production build locally:
```bash
npm run preview
```

---

## 📖 How to Use the Platform

| Step | Section | What to Do |
| :--- | :--- | :--- |
| **1** | **Cost Estimator** | Enter your **Overall Budget Target** (e.g. ₹ 15,00,000), total guest count, duration (days), and preferences for Catering, Venue, Decor, and Photography. Click **Save & Calculate Estimates**. |
| **2** | **Dashboard** | View real-time KPI metrics: **Planned Budget**, **Actual Committed**, **Advance Paid**, and **Pending Balances**. |
| **3** | **Bills & Expenses** | Manage expenditures using **Invoice Cards** or **Table View**. Click **View Full Bill** on any expense to view and print official financial receipts. |
| **4** | **Events & Timeline** | Schedule ceremonies (*Mehendi, Sangeet, Pheras, Reception*) with event-specific budgets and dress codes. |
| **5** | **Vendors & Quotes** | Compare supplier bids side-by-side, view ratings, and update vendor status (*Selected, Backup, Rejected*). |
| **6** | **Guests & RSVP** | Track guests by Bride/Groom side, headcounts with plus-ones, dietary restrictions, and room allocations. |
| **7** | **Checklist** | Complete chronological milestones with celebratory confetti bursts. |
| **8** | **Export PDF** | Click **Export PDF** in the top navigation bar at any time to download your full financial dossier. |

---

## 🌟 Core Features

- **🎯 100% User-Driven Manual Budget**: All category shares start at zero until you enter your amount. No pre-calculated fictitious numbers.
- **📊 Real-Time Financial Dashboard**: Visual category progress meters, countdown to wedding date, and remaining buffer indicators.
- **🧾 Printable Bill Receipts & Vouchers**: Dedicated modal displaying formal invoice IDs, settlement percentages, vendor terms, and browser print (`window.print()`) support.
- **💡 AI Advisor Heuristics**: Automatic warning alerts for budget overruns, pending payouts, and cash flow bottlenecks.
- **📄 Instant PDF Reports**: Generates professional PDF financial reports with couple names, event itineraries, and payment breakdowns.
- **📱 Fully Responsive Design**: Built with Tailwind CSS for mobile, tablet, and widescreen layouts.

---

## 🏗️ Project Architecture

```
WeddingWise/
├── public/                     # Favicon and static public assets
├── src/
│   ├── assets/                 # SVGs and branding media
│   ├── components/             # Reusable UI component modules
│   │   ├── BillReceiptModal.tsx# Official printable invoice voucher modal
│   │   ├── ChecklistView.tsx   # Interactive milestones roadmap & confetti
│   │   ├── CostEstimator.tsx   # Proportional budget calculator & parameter matrix
│   │   ├── Dashboard.tsx       # KPI summary, category meters, and itinerary highlights
│   │   ├── EventTimeline.tsx   # Multi-day ceremony scheduling
│   │   ├── ExpenseTracker.tsx  # Dual-mode expense ledger & card view
│   │   ├── GuestListRSVP.tsx   # Attendance tracker, rooming & dietary records
│   │   ├── Navbar.tsx          # Sticky responsive header with quick budget stats
│   │   └── VendorManagement.tsx# Side-by-side vendor quotation comparison
│   ├── data/                   # Default initial configurations
│   ├── types/                  # Strict TypeScript definitions & interfaces
│   │   └── wedding.ts          # Core data models for expenses, events, and guests
│   ├── utils/                  # Utility helpers & external engines
│   │   ├── budgetCalculations.ts# Proportional allocation & heuristic AI logic
│   │   └── pdfExport.ts        # Client-side PDF financial report generator
│   ├── App.tsx                 # Root application controller & persistence layer
│   ├── index.css               # Tailwind CSS styling rules
│   └── main.tsx                # React DOM entrypoint
├── index.html                  # HTML5 template with Google fonts
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler rules
└── vite.config.ts              # Vite build setup with Tailwind v4 plugin
```

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` — Runs the application in development mode with Hot Module Replacement (HMR).
- `npm run build` — Compiles TypeScript and builds the production bundle into `dist/`.
- `npm run preview` — Locally previews the built production output.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Crafted with ❤️ for couples and wedding planners worldwide.
</div>
