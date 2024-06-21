import express from 'express';
import { findUsers, createUser, updateUser, getUserById, deleteUser  } from '../controllers/usersController.mjs';

const router = express.Router();

// Route to get all users
router.get('/users', findUsers);

// Route to create a new user
router.post('/users', createUser);

// GET a user by ID
router.get('/users/:id', getUserById);

// Route to update a user by ID
router.put('/users/:id', updateUser);

// DELETE user by ID
router.delete('/users/:id', deleteUser);

export default router;