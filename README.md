# 💸 Expense Splitter

Ever been in that awkward situation where you split a bill with friends and then everyone forgets who owes what? This app solves that! It's a simple way to track shared expenses, see exactly who owes whom, and finally settle up those lingering debts.

## What It Does

- **Create groups** for your trips, roommates, or friend circles
- **Add expenses** and split them equally or however you want
- **See balances** updated in real-time — no more mental math
- **Record payments** when someone finally pays up
- **Smart settlement** — the app figures out the minimum transactions needed to clear all debts

## The Tech Behind It

Built with the classic MERN stack (well, sans the R for Redux — went with Zustand instead for a lighter touch):

**Backend:**
- Node.js + Express for the API
- MongoDB for storing everything
- JWT for handling logins

**Frontend:**
- React with Vite (super fast!)
- Zustand for state management
- React Router for navigation

## Getting It Running

### What You Need
- Node.js (v18+)
- MongoDB (local install or a free Atlas cluster)

### Step-by-Step

1. **Backend setup**
   ```bash
   cd expense-splitter
   npm install
   ```
   
2. **Add your environment variables** — there's a `.env.example` file in there. You'll need:
   - Your MongoDB connection string
   - A JWT secret (just pick something random)

3. **Frontend setup**
   ```bash
   cd ../frontend
   npm install
   ```
   
4. **Start both servers**
   ```bash
   # In expense-splitter folder
   npm run dev
   
   # In frontend folder  
   npm run dev
   ```

The frontend runs on `http://localhost:5173` and talks to the backend at `http://localhost:5000`.

## Project Layout

```
expense-splitter/
├── expense-splitter/    # The API (Node/Express)
│   └── src/
│       ├── controllers/  # The business logic
│       ├── models/       # Database schemas
│       ├── routes/      # API endpoints
│       └── middleware/  # Auth & error handling
│
└── frontend/           # The UI (React)
    └── src/
        ├── components/  # Reusable UI pieces
        ├── pages/       # Full page views
        └── stores/      # State management
```

## For Developers

The backend follows a clean MVC-ish pattern — controllers handle the logic, models define the data, routes tie it all together. The balance calculation service is the real brains of the operation; it calculates net balances by going through every expense and settlement in a group.

Frontend uses Zustand for auth state and Axios for API calls. There's a little toast notification system for user feedback. The UI is dark mode with some neon accents — pretty easy on the eyes.

## License

MIT — use it however you want!
