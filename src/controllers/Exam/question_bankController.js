/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { question_bankService } from '~/services/Exam/question_bankService'

const createNew = async (req, res, next) => {
    try {
        const createdQuestion_bank = await question_bankService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdQuestion_bank)
    } catch (error) { next(error) }
}


const getAllQuestion_banks = async (req, res, next) => {
    try {
        const { moduleId, question_format, difficulty, chapter } = req.query;
        let chaptersArray = [];

        // Kiểm tra nếu chapter là một chuỗi và không rỗng
        if (chapter && typeof chapter === 'string' && chapter.trim() !== '') {
            // Phân tách chuỗi thành mảng các chapters
            chaptersArray = chapter.split(',').map(ch => ch.trim());
        }

        // Gọi phương thức từ service để lấy tất cả các câu hỏi
        // và sử dụng query params để lọc dữ liệu
        const allQuestion_banks = await question_bankService.getAllQuestion_banks(moduleId, question_format, difficulty, chaptersArray);

        res.status(StatusCodes.OK).json(allQuestion_banks);
    } catch (error) {
        next(error);
    }
}



const getDetails = async (req, res, next) => {
    try {
        const question_bankId = req.params.id
        const question_bank = await question_bankService.getDetails(question_bankId)
        res.status(StatusCodes.OK).json(question_bank)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const question_bankId = req.params.id;
        const updatedQuestion_bank = await question_bankService.update(question_bankId, req.body);

        res.status(StatusCodes.OK).json(updatedQuestion_bank);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const question_bankId = req.params.id
        const result = await question_bankService.deleteItem(question_bankId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const question_bankController = {
    createNew,
    getDetails,
    getAllQuestion_banks,
    update,
    deleteItem
}