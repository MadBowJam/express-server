import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Функції для роботи з користувачами

const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw err;
  }
};

const createUser = async (userData) => {
  try {
    return await User.create(userData);
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

const findUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {
    console.error('Error finding user by id:', err);
    throw err;
  }
};

const insertManyUsers = async (userDataArray) => {
  try {
    return await User.insertMany(userDataArray);
  } catch (err) {
    console.error('Error inserting many users:', err);
    throw err;
  }
};

const updateOneUser = async (id, updateData) => {
  try {
    return await User.updateOne({ _id: id }, { $set: updateData });
  } catch (err) {
    console.error('Error updating user:', err);
    throw err;
  }
};

const updateManyUsers = async (updateDataArray) => {
  try {
    const promises = updateDataArray.map(async (updateData) => {
      const { _id, ...rest } = updateData;
      return await User.updateOne({ _id }, { $set: rest });
    });
    return await Promise.all(promises);
  } catch (err) {
    console.error('Error updating many users:', err);
    throw err;
  }
};

const replaceOneUser = async (id, newData) => {
  try {
    return await User.updateOne({ _id: id }, newData);
  } catch (err) {
    console.error('Error replacing user:', err);
    throw err;
  }
};

const deleteOneUser = async (id) => {
  try {
    return await User.deleteOne({ _id: id });
  } catch (err) {
    console.error('Error deleting user:', err);
    throw err;
  }
};

const deleteManyUsers = async (ids) => {
  try {
    return await User.deleteMany({ _id: { $in: ids } });
  } catch (err) {
    console.error('Error deleting users:', err);
    throw err;
  }
};

const findUsers = async (filter = {}, projection = {}) => {
  try {
    return await User.find(filter).select(projection);
  } catch (err) {
    console.error('Error finding users:', err);
    throw err;
  }
};

const getUsersWithCursor = async () => {
  try {
    return await User.find().cursor();
  } catch (err) {
    console.error('Error getting users with cursor:', err);
    throw err;
  }
};

const getUserStatistics = async () => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          uniqueEmails: { $addToSet: '$email' }
        }
      }
    ];
    return await User.aggregate(pipeline).exec();
  } catch (err) {
    console.error('Error getting user statistics:', err);
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
  getUserStatistics
};