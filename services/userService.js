// services/userService.js
import User from '../models/User.js';

// Пошук користувача за email
const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (err) {
    console.error("Error finding user by email:", err);
    throw err;
  }
};

// Створення нового користувача
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

// Пошук користувача за ID
const findUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {
    console.error(`Error finding user by id: ${err.message}`);
    throw err;
  }
};

// Вставка багатьох користувачів
const insertManyUsers = async (userDataArray) => {
  try {
    const result = await User.insertMany(userDataArray);
    return result;
  } catch (err) {
    console.error("Error inserting many users:", err);
    throw err;
  }
};

// Оновлення одного користувача
const updateOneUser = async (id, updateData) => {
  try {
    const result = await User.findByIdAndUpdate(id, updateData, { new: true });
    return result;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};

// Оновлення багатьох користувачів
const updateManyUsers = async (updateDataArray) => {
  try {
    const results = [];
    for (const updateData of updateDataArray) {
      const { _id, ...rest } = updateData;
      const result = await User.findByIdAndUpdate(_id, rest, { new: true });
      results.push(result);
    }
    return results;
  } catch (err) {
    console.error("Error updating many users:", err);
    throw err;
  }
};

// Заміна одного користувача
const replaceOneUser = async (id, newData) => {
  try {
    const result = await User.replaceOne({ _id: id }, newData);
    return result;
  } catch (err) {
    console.error("Error replacing user:", err);
    throw err;
  }
};

// Видалення одного користувача
const deleteOneUser = async (id) => {
  try {
    const result = await User.findByIdAndDelete(id);
    return result;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
};

// Видалення багатьох користувачів
const deleteManyUsers = async (ids) => {
  try {
    const result = await User.deleteMany({ _id: { $in: ids } });
    return result;
  } catch (err) {
    console.error("Error deleting users:", err);
    throw err;
  }
};

// Пошук користувачів
const findUsers = async (filter = {}, projection = {}) => {
  try {
    return await User.find(filter, projection);
  } catch (err) {
    console.error("Error finding users:", err);
    throw err;
  }
};

// Використання курсора для отримання користувачів
const getUsersWithCursor = async () => {
  try {
    return User.find().cursor();
  } catch (err) {
    console.error("Error getting users with cursor:", err);
    throw err;
  }
};

// Агрегаційний запит для отримання статистики користувачів
const getUserStatistics = async () => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          uniqueEmails: { $addToSet: "$email" },
        },
      },
    ]);
    return result[0];
  } catch (err) {
    console.error("Error getting user statistics:", err);
    throw err;
  }
};

export {
  findUserByEmail,
  createUser,
  findUserById,
  insertManyUsers,
  updateOneUser,
  updateManyUsers,
  replaceOneUser,
  deleteOneUser,
  deleteManyUsers,
  findUsers,
  getUsersWithCursor,
  getUserStatistics,
};
