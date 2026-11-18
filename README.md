<div align="center">

# 💍 WeddingWise
### *Smart Luxury & Budget Wedding Planning Platform*

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  A modern, responsive, end-to-end wedding planning and financial management application built with React, TypeScript, Tailwind CSS, and jsPDF. Designed to eliminate guesswork, streamline vendor negotiations, track real expenditures, and empower couples to execute their dream celebration within budget.
</p>

[Explore Features](#-core-features) •
[Quick Start](#-quick-start) •
[Architecture](#-project-architecture) •
[Screenshots & Modules](#-modules--screenshots) •
[Contributing](#-contributing)

</div>

---

## 🌟 Highlights

- **🎯 Zero Artificial Data Overwrite**: 100% user-driven manual budget input. Categories compute strictly based on your specified financial ceiling.
- **📊 Real-Time Financial Dashboard**: Instant tracking of Total Planned, Committed Actuals, Advances Settled, and Pending Balances.
- **🧾 Printable Bill & Voucher System**: Full-page official expense receipts with voucher IDs, vendor details, settlement percentages, and one-click browser print integration (`window.print()`).
- **💡 AI-Powered Advisor & Savings Engine**: Built-in heuristics alert against budget overruns, cash flow bottlenecks, and unnecessary supplier premiums.
- **📄 Instant PDF Financial Export**: Generate clean, branded PDF financial reports containing couple summaries, multi-day schedules, and itemized accounts using `jspdf` & `jspdf-autotable`.
- **📱 Fully Responsive Luxury UI**: Hand-crafted gold and rose aesthetics with fluid mobile, tablet, and desktop viewports.

---

## 🛠️ Core Features

### 1. 💰 Dynamic Cost Estimator & Parameter Configurator
- Set your total budget target, duration (number of days), expected headcount, and target city/destination.
- Supports multiple currency formats: **₹ (INR)**, **$ (USD)**, **€ (EUR)**, **£ (GBP)**, and **AED**.
- Multi-dimensional preference multipliers:
  - **Venue & Stay**: Destination Resort, Heritage Palace, Beachfront Villa, 5-Star Banquet, Community Hall.
  - **Catering & Dining**: Multi-Cuisine, Pure Vegetarian/Maharaj, Gourmet Non-Veg & Seafood, Organic Farm-to-Table.
  - **Decor & Floral Styling**: Royal Regal, Exotic Floral Extravaganza, Traditional Marigold & Brass, Boho-Chic, Minimalist Pastel.
  - **Photography & Cinematics**: Candid 4K Cinema + Teasers, Drone Multi-Team, Celebrity Studio, Standard.
  - **Bridal & Groom Attire**: Haute Couture Handcrafted, Pure Heritage Silks, Custom Tailored, Ready-to-Wear.
  - **Invitations & Logistics**: Luxury Boxed Hampers, Foil-Stamped Cards, Eco-Seed Paper, Digital-Only RSVPs.

### 2. 🧾 Bills, Expenses & Advance Payments
- **Dual Display Modes**:
  - **Invoice Cards View**: Card-based visual tiles displaying category color tags, actual costs, settled advances, pending balance warnings, and payment progress meters.
  - **Full Table View**: Traditional ledger format for rapid desktop scanning and sorting.
- **Official Bill Receipt Voucher (`View Full Bill`)**:
  - Modal displaying official voucher ID, date issued, vendor, ceremony assignment, and contractual notes.
  - One-click print-ready styling for family records or event coordinators.

### 3. 📅 Multi-Day Celebration Schedule & Itinerary
- Chronological breakdown for ceremonies (e.g. *Haldi & Mehendi Fiesta*, *Sangeet & Cocktails*, *Pheras & Wedding Vows*, *Grand Reception*).
- Individual budget allocations, timing, locations, aesthetic themes, and suggested dress codes per event.

### 4. 🏢 Vendor Quotation & Contract Matrix
- Side-by-side comparison of supplier quotes grouped by service category.
- Record package inclusions, ratings, contact numbers, and notes.
- Quick status workflow: `Selected`, `Backup`, `Rejected`, or `In Discussion`.

### 5. 👥 Guest List, RSVPs & Room Allocations
- Filter guests by affiliation: **Bride’s Side**, **Groom’s Side**, or **Mutual Friends**.
- Live headcounts accounting for primary guests and plus-ones.
- Track dietary restrictions (e.g. Jain, Vegan, Allergies) and assigned hotel room / seating numbers.

### 6. ✅ 12-Month Wedding Roadmap & Milestones
- Chronological milestones broken down into phases (*6-12 Months Before*, *2-3 Months Before*, *1 Week Before*, *Wedding Day*).
- Dynamic progress bar with celebratory confetti bursts upon milestone completion using `canvas-confetti`.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/patelsabirhusain07/WeddingWise.git
   cd WeddingWise
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173) to view the live application.

---

## 🏗️ Project Architecture

```
WeddingWise/
├── public/                     # Static assets and icons
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
│   ├── index.css               # Tailwind CSS v4 styling rules
│   └── main.tsx                # React DOM entrypoint
├── index.html                  # HTML5 template with Google typography
├── package.json                # Project dependencies and script declarations
├── tsconfig.json               # TypeScript compiler rules
└── vite.config.ts              # Vite build setup with Tailwind v4 plugin
```

---

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production bundle locally:

```bash
npm run preview
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
  Crafted with ❤️ for couples and wedding planners worldwide.
</div>
