/* eslint-disable indent */
import { GET_DB } from '~/config/mongodb';

const USER_COLLECTION_NAME = 'users';

const createUsersCollection = async (userData) => {
    try {
        if (!['sinhvien', 'giangvien', 'phongdaotao', 'phongkhaothi', 'bomon'].includes(userData.role)) {
            throw new Error('Unsupported user role');
        }

        await GET_DB().collection(USER_COLLECTION_NAME).insertOne({
            user_id: userData._id,
            email: userData.email,
            username: userData.username,
            password: userData.password,
            role: userData.role
        });
    } catch (error) {
        throw new Error(error);
    }
};

const deleteOneByUserId = async (user_id) => {
    try {
        const result = await GET_DB().collection(USER_COLLECTION_NAME).deleteOne({ user_id });
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const userModel = {
    createUsersCollection,
    USER_COLLECTION_NAME,
    deleteOneByUserId
};
