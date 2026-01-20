# Seva Kendra CRM

A comprehensive CRM system for NGO management, handling Education, Health, and Social Justice programs.

## Features

- **Dashboard**: Real-time analytics and insights
- **Education Module**: Study centers, students, teachers, dropouts tracking
- **Health Module**: Health camps, disease management, patient tracking
- **Social Justice Module**: Legal aid, entitlements, workshops
- **Reports**: Comprehensive module-wise reporting with visualizations
- **Dark Theme**: Professional dark UI for reduced eye strain

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Shadcn/ui Components
- Recharts for data visualization
- React Router for navigation

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB

### Backend Setup

```bash
cd sevaKendra-backend
npm install
cp .env.example .env
# Configure your MongoDB connection string in .env
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Usage

1. Start the backend server on port 5000
2. Start the frontend dev server on port 5173
3. Access the application at http://localhost:5173
4. Default login credentials (if applicable)

## Project Structure

```
Seva Kendra/
├── Frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── lib/           # Utilities
│   └── public/
└── sevaKendra-backend/    # Node.js backend
    ├── src/
    │   ├── controllers/   # Request handlers
    │   ├── models/        # MongoDB models
    │   ├── routes/        # API routes
    │   ├── middleware/    # Custom middleware
    │   └── utils/         # Utility functions
    └── scripts/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[Your License Here]

## Contact

[Your Contact Information]
