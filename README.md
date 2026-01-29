# Jones County XC

A web application for Jones County Cross Country.

## Project Structure

```
jones-county-xc/
├── frontend/    # React app (Vite + Tailwind CSS)
├── backend/     # Go HTTP server
├── docs/        # Documentation
└── README.md
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173

### Backend

```bash
cd backend
go run main.go
```

The backend runs on http://localhost:8080

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api` | GET | API info |
