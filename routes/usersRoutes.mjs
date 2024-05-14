import express from 'express';
const usersRoutes = express.Router();
import { usersController } from '../controllers/usersController.mjs';

usersRoutes.get('/', usersController.getUsers);
usersRoutes.post('/', usersController.postUser);
usersRoutes.get('/:userId', usersController.getUserById);
usersRoutes.put('/:userId', usersController.putUserById);
usersRoutes.delete('/:userId', usersController.deleteUserById);

export { usersRoutes };