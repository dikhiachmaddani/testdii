import express from 'express';
import { envClient } from './config/env.config.js';
import authRoutes from './routes/auth.routes.js';
import menuRoutes from './routes/menu.routes.js';
import roleRoutes from './routes/role.routes.js';
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/menu', menuRoutes);
app.use('/roles', roleRoutes);
app.get('/', (_req, res) => {
    res.send({
        'hello': "world"
    });
});
app.listen(envClient.port, () => {
    console.log(`Server is running on [http://localhost:${envClient.port}]`);
});
