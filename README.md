# Bankflow

A simple banking dashboard built with Next.js and React. Bankflow lets users view linked accounts, track transactions, and simulate transfers between their accounts.

**Live Demo:** [View Bankflow](https://bankflow-gamma.vercel.app/)

## Features

- **Dashboard:** Overview of total balance, monthly income, expenses, and recent activity.
- **Accounts:** View linked savings, current, and salary accounts with their balances.
- **Transactions:** Search, filter, sort, and paginate transaction history.
- **Transfers:** Transfer money between accounts with validation, a review step, and confirmation.
- **Mock Authentication:** Demo login and logout flow with protected banking routes.
- **Responsive UI:** Works across desktop, tablet, and mobile screens.

## Tech Stack

- Next.js (App Router)
- React and TypeScript
- Tailwind CSS
- Jotai for shared state management
- Lucide React for icons

## Getting Started

Clone the repository:

```bash
git clone https://github.com/yashPundhir/Bankflow.git
cd Bankflow
```

Install dependencies and start the development server:

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Login

Use any valid email address and a non-empty password to sign in. No real account or credentials are required.

## Transfer Logic

Transfers are simulated locally. Before confirming a transfer, the application validates the selected accounts, amount, and available balance. A successful transfer updates both account balances and adds matching debit and credit transactions.

## Notes

- All account balances and transactions are mock data.
- Authentication and banking operations are for demonstration purposes only.
- Data is held in client-side state and resets when the application state is reinitialized or the page is refreshed.
- Fundamental unit used in this project for monetary data is `paisa` to enable simple mathematical calculations

## Running a Production Build

```bash
bun run build
bun run start
```
