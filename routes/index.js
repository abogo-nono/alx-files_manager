import express from 'express';
import { getStatus, getStats } from '../controllers/AppController';
import { postNew, getMe } from '../controllers/UsersController';
import { getConnect, getDisconnect } from '../controllers/AuthController';

const routes = express.Router();

routes.get('/status', getStatus);
routes.get('/stats', getStats);

routes.post('/users', postNew);
routes.get('/users/me', getMe);

routes.get('/connect', getConnect);
routes.get('/disconnect', getDisconnect);

export default routes;
