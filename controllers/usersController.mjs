// Import the User model
import User from '../models/User.js';

// Controller to get all users
export const findUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to delete user by ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to create a new user
export const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Controller to update a user by ID
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Function to find a user by email
export const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (err) {
        console.error('Error finding user by email:', err);
        throw err;
    }
};

// Function to find a user by ID
export const findUserById = async (id) => {
    try {
        return await User.findById(id);
    } catch (err) {
        console.error('Error finding user by id:', err);
        throw err;
    }
};

// Function to insert many users
export const insertManyUsers = async (userDataArray) => {
    try {
        return await User.insertMany(userDataArray);
    } catch (err) {
        console.error('Error inserting many users:', err);
        throw err;
    }
};

// Function to update one user by ID
export const updateOneUser = async (id, updateData) => {
    try {
        return await User.updateOne({ _id: id }, { $set: updateData });
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
};

// Function to update many users
export const updateManyUsers = async (updateDataArray) => {
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

// Function to replace one user by ID
export const replaceOneUser = async (id, newData) => {
    try {
        return await User.updateOne({ _id: id }, newData);
    } catch (err) {
        console.error('Error replacing user:', err);
        throw err;
    }
};

// Function to delete one user by ID
export const deleteOneUser = async (id) => {
    try {
        return await User.deleteOne({ _id: id });
    } catch (err) {
        console.error('Error deleting user:', err);
        throw err;
    }
};

// Function to delete many users by IDs
export const deleteManyUsers = async (ids) => {
    try {
        return await User.deleteMany({ _id: { $in: ids } });
    } catch (err) {
        console.error('Error deleting users:', err);
        throw err;
    }
};

// Function to find users with filter and projection
export const findUsersWithFilter = async (filter = {}, projection = {}) => {
    try {
        return await User.find(filter).select(projection);
    } catch (err) {
        console.error('Error finding users:', err);
        throw err;
    }
};

// Function to get users with cursor
export const getUsersWithCursor = async () => {
    try {
        return await User.find().cursor();
    } catch (err) {
        console.error('Error getting users with cursor:', err);
        throw err;
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to get user statistics
export const getUserStatistics = async () => {
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