import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import replenishmentRoutes from './routes/replenishment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/replenishment', replenishmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Project Sentry API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
