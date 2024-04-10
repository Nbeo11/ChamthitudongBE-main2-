/* eslint-disable indent */
import bcrypt from 'bcrypt';
import { GET_DB } from '~/config/mongodb';

const USER_COLLECTION_NAME = 'user';

export const userService = {
    getAllUsers: async () => {
        try {
            const users = await GET_DB().collection(USER_COLLECTION_NAME).find().toArray();
            return users;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getUserByUsername: async (username) => {
        try {
            const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ username });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateUserPassword: async (userId, newPassword) => {
        try {
            // Hash the new password before updating it in the database
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Update user password in the database
            const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
                { _id: userId },
                { $set: { password: hashedPassword } }
            );
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    comparePasswords: async (plainPassword, hashedPassword) => {
        try {
            // Compare plain password with hashed password
            const match = await bcrypt.compare(plainPassword, hashedPassword);
            return match;
        } catch (error) {
            throw new Error(error.message);
        }
    }
};
