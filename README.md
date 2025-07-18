# OTC Trade Application

A full-stack application for managing over-the-counter trades, deposits, and withdrawals.

## Features

- User Authentication (Register/Login)
- Deposit and Withdrawal Management
- Multiple Payment Methods Support
- Transaction History
- Admin Dashboard
- Real-time Balance Updates
- Multi-currency Support (USD, EUR, GBP)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- TypeScript

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- Axios

## Project Structure

```
otc-trade-app/
├── server/                 # Backend server
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js          # Server entry point
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   └── services/     # API services
│   └── package.json
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd otc-trade-app
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Create a .env file in the server directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/otc-trade
JWT_SECRET=your-secret-key
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Branch Structure

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `release/*`: Release branches

## Development Workflow

1. Create a new feature branch from develop:
```bash
git checkout develop
git checkout -b feature/new-feature
```

2. Make changes and commit:
```bash
git add .
git commit -m "feat: add new feature"
```

3. Push changes and create a pull request:
```bash
git push origin feature/new-feature
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 