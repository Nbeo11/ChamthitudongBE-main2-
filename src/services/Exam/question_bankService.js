/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { question_bankModel } from '~/models/Exam/question_bankModel';
import ApiError from '~/utils/ApiError';


const createNew = async (reqBody) => {
    try {
        const newQuestion_bank = {
            ...reqBody
        }
        const createdQuestion_bank = await question_bankModel.createNew(newQuestion_bank)
        const getNewQuestion_bank = await question_bankModel.findOneById(createdQuestion_bank.insertedId)

        
        return getNewQuestion_bank
    } catch (error) {
        throw error
    }
}

const getAllQuestion_banks = async (moduleId, question_format, difficulty, chapters) => {
    try {
        // Tạo điều kiện truy vấn dựa trên các tham số lọc dữ liệu
        const query = {};
        if (moduleId) {
            // Chuyển đổi moduleId sang ObjectId
            query.moduleId = new ObjectId(moduleId);
        }
        if (question_format) {
            query.question_format = question_format;
        }
        if (difficulty) {
            query.difficulty = difficulty;
        }
        if (chapters && chapters.length > 0) {
            // Lọc theo nhiều chapters trong mảng chapters
            query['chapters.chapter'] = { $in: chapters };
        }

        // Gọi phương thức từ Model để lấy tất cả các câu hỏi với các điều kiện lọc
        const allQuestion_banks = await question_bankModel.getAllQuestion_banks(query);

        return allQuestion_banks;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}



const getDetails = async (question_bankId) => {
    try {
        const question_bank = await question_bankModel.getDetails(question_bankId)
        if (!question_bank) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Question_bank not found!')
        }

        return question_bank
    } catch (error) {
        throw error
    }
}

const update = async (id, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedQuestion_bank = await question_bankModel.update(id, updateData);
        return updatedQuestion_bank
    } catch (error) {
        throw error
    }
}

const deleteItem = async (question_bankId) => {
    try {
        const targetQuestion_bank = await question_bankModel.findOneById(question_bankId)
        if (!targetQuestion_bank) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Question_bank not found!')
        }
        // Xóa question_bank
        await question_bankModel.deleteOneById(question_bankId)
        // Xóa toàn bộ student thuộc question_bank

        // Xóa question_bankId trong mảng question_bankOrderIds trong Faculty chứa nó


        return { deleteResult: 'The question_bank and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const question_bankService = {
    createNew,
    getDetails,
    getAllQuestion_banks,
    update,
    deleteItem
}