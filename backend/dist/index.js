import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import apiRoutes from './routes/index.js';
const app = express();
app.use(express.json());
app.use(cors());
// Mount the aggregator API router
app.use('/api', apiRoutes);
// Start Server
app.listen(3000, () => {
    console.log('API Server running on http://localhost:3000');
});
//# sourceMappingURL=index.js.map