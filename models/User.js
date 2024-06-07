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

const insertManyUsers = async (userDataArray) => {
  try {
    const collection = getUserCollection();
    const result = await collection.insertMany(userDataArray);
    return result.insertedIds;
  } catch (err) {
    console.error("Error inserting many users:", err);
    throw err;
  }
};

const updateOneUser = async (id, updateData) => {
  try {
    const collection = getUserCollection();
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return result.modifiedCount;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};

const updateManyUsers = async (updateDataArray) => {
  try {
    const collection = getUserCollection();
    const results = [];
    
    for (const updateData of updateDataArray) {
      const { _id, ...rest } = updateData;
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: rest }
      );
      if (result.matchedCount === 1) {
        results.push(await collection.findOne({ _id: new ObjectId(_id) }));
      }
    }
    
    return results;
  } catch (err) {
    console.error("Error updating many users:", err);
    throw err;
  }
};

const replaceOneUser = async (id, newData) => {
  try {
    const collection = getUserCollection();
    const result = await collection.replaceOne({ _id: new ObjectId(id) }, newData);
    return result.modifiedCount;
  } catch (err) {
    console.error("Error replacing user:", err);
    throw err;
  }
};

const deleteOneUser = async (id) => {
  try {
    const collection = getUserCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
};

const deleteManyUsers = async (ids) => {
  try {
    const collection = getUserCollection();
    const objectIds = ids.map(id => new ObjectId(id));
    const result = await collection.deleteMany({ _id: { $in: objectIds } });
    
    if (result.deletedCount > 0) {
      return { message: `${result.deletedCount} users deleted successfully` };
    } else {
      throw new Error("No users found for deletion");
    }
  } catch (err) {
    console.error("Error deleting users:", err);
    throw err;
  }
};

const findUsers = async (filter = {}, projection = {}) => {
  try {
    const collection = getUserCollection();
    return await collection.find(filter).project(projection).toArray();
  } catch (err) {
    console.error("Error finding users:", err);
    throw err;
  }
};

// Функція для використання курсора
const getUsersWithCursor = async () => {
  try {
    const collection = getUserCollection();
    const cursor = collection.find();
    return cursor;
  } catch (err) {
    console.error("Error getting users with cursor:", err);
    throw err;
  }
};

// Функція для агрегаційного запиту
const getUserStatistics = async () => {
  try {
    const collection = getUserCollection();
    const pipeline = [
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          uniqueEmails: { $addToSet: "$email" }
        }
      }
    ];
    const result = await collection.aggregate(pipeline).toArray();
    return result[0];
  } catch (err) {
    console.error("Error getting user statistics:", err);
    throw err;
  }
};

export { findUserByEmail, createUser, findUserById, insertManyUsers, updateOneUser, updateManyUsers, replaceOneUser, deleteOneUser, deleteManyUsers, findUsers, getUsersWithCursor, getUserStatistics };
