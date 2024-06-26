/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Đợt thi (kỳ thi)
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

//Define Collection (Name & Schema)
const CONTEST_COLLECTION_NAME = 'contests'
const CONTEST_COLLECTION_SCHEMA = Joi.object({
    scholastic: Joi.string().required().min(1).max(5000).trim().strict(),
    semester: Joi.string().required().min(1).max(5000).trim().strict(),
    contest_name: Joi.string().required().min(1).max(5000).trim().strict(),
    start_time: Joi.date().required().iso(), // định dạng DD/MM/YYYY
    end_time: Joi.date().required().iso(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
});


const INVALID_UPDATE_FIELDS = ['_id', 'moduleId', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await CONTEST_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}


const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)

        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newContestToAdd = {
            ...validData,
        }
        const createdContest = await GET_DB().collection(CONTEST_COLLECTION_NAME).insertOne(newContestToAdd)


        return createdContest
    } catch (error) { throw new Error(error) }
}

const findOneById = async (contestId) => {
    try {
        const result = await GET_DB().collection(CONTEST_COLLECTION_NAME).findOne({
            _id: new ObjectId(contestId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllContests = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allContests = await GET_DB().collection(CONTEST_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allContests;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(CONTEST_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByContestId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(CONTEST_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByContestId - contest', result)
        return result
    } catch (error) { throw new Error(error) }
}

const update = async (contestId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        });

        // Kiểm tra xem trường question có trong updateData không
        if (updateData.question) {
            // Lặp qua mảng question và chuyển đổi các question_bankId thành ObjectId
            updateData.question = updateData.question.map(item => ({
                ...item,
                question_bankId: new ObjectId(item.question_bankId)
            }));
        }

        const result = await GET_DB().collection(CONTEST_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(contestId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result;
    } catch (error) {
        throw new Error(error);
    }
};


const deleteOneById = async (contestId) => {
    try {
        const result = await GET_DB().collection(CONTEST_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(contestId)
        })
        console.log('deleteOneById - contest', result)
        return result
    } catch (error) { throw new Error(error) }
}

export const contestModel = {
    CONTEST_COLLECTION_NAME,
    CONTEST_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllContests,
    deleteManyByContestId,
    update,
    deleteOneById
}