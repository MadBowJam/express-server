// routes/usersRoutes.mjs
import express from 'express';
const usersRoutes = express.Router();
import { usersController } from '../controllers/usersController.mjs';
import { basicAuth } from '../middlewares/authMiddleware.mjs';
import { validateUserInput } from '../middlewares/validateMiddleware.mjs';

usersRoutes.get('/', basicAuth, usersController.getUsers);
usersRoutes.post('/', validateUserInput, usersController.postUser);
usersRoutes.get('/:userId', basicAuth, usersController.getUserById);
usersRoutes.put('/:userId', basicAuth, usersController.putUserById);
usersRoutes.delete('/:userId', basicAuth, usersController.deleteUserById);

export { usersRoutes };