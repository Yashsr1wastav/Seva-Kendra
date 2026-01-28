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
- npm (comes with Node.js)
- MongoDB Atlas account or local MongoDB instance

### Quick Start (Run Both Servers)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Seva-Kendra
   ```

2. **Setup Backend**
   ```bash
   cd sevaKendra-backend
   npm install
   ```

3. **Configure Backend Environment**
   
   Create a `.env` file in the `sevaKendra-backend` folder:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Setup Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```

5. **Configure Frontend Environment**
   
   Create a `.env` file in the `Frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

### Running the Application

You need to run **both servers** simultaneously in separate terminals:

#### Terminal 1 - Start Backend Server
```bash
cd sevaKendra-backend
npm run dev
```
The backend will start on **http://localhost:5000**

#### Terminal 2 - Start Frontend Server
```bash
cd Frontend
npm run dev
```
The frontend will start on **http://localhost:5173**

### Access the Application

Once both servers are running:
- Open your browser and go to: **http://localhost:5173**
- You should see the Sign In page
- Backend API is available at: **http://localhost:5000/api/v1**

### Available Scripts

#### Backend (`sevaKendra-backend/`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload (nodemon) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

#### Frontend (`Frontend/`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secure-secret-key` |
| `PORT` | Server port (optional) | `5000` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api/v1` |

## Troubleshooting

### Common Issues

1. **"Cannot connect to MongoDB"**
   - Check your `MONGODB_URI` in `.env`
   - Ensure your IP is whitelisted in MongoDB Atlas

2. **"CORS Error"**
   - Make sure the backend is running on port 5000
   - Check `VITE_API_URL` matches the backend URL

3. **"Module not found"**
   - Run `npm install` in both `Frontend` and `sevaKendra-backend` folders

4. **Port already in use**
   - Kill the process using the port or change the port in `.env`

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
