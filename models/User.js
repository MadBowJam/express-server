// User.js
import { getDB } from '../config.js';
import { ObjectId } from 'mongodb';

const getUserCollection = () => {
  const db = getDB();
  return db.collection('users');
};

const findUserByEmail = async (email) => {
  const collection = getUserCollection();
  return await collection.findOne({ email });
};

const createUser = async (userData) => {
  try {
    const collection = getUserCollection();
    const result = await collection.insertOne(userData);
    if (result.insertedId) {
      const newUser = await collection.findOne({ _id: result.insertedId });
      return newUser;
    } else {
      throw new Error("Failed to create user");
    }
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

async function findUserById(id) {
  try {
    const collection = getUserCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  } catch (err) {
    throw new Error(`Error finding user by id: ${err.message}`);
  }
}

export { findUserByEmail, createUser, findUserById };
