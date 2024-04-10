// file: services/authService.js
import { GET_DB } from '~/config/mongodb';

export const authenticateUser = async (email, password) => {
    const user = await GET_DB().collection('users').findOne({ email, password });
    return user;
};
