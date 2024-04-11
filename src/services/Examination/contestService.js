/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { contestModel } from '~/models/Examination/contestModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newContest = {
            ...reqBody
        }
        const createdContest = await contestModel.createNew(newContest)
        const getNewContest = await contestModel.findOneById(createdContest.insertedId)

        
        return getNewContest
    } catch (error) {
        throw error
    }
}

const getAllContests = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allContests = await contestModel.getAllContests()
        return allContests
    } catch (error) { throw error }
}

const getDetails = async (contestId) => {
    try {
        const contest = await contestModel.getDetails(contestId)
        if (!contest) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Contest not found!')
        }

        return contest
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
        const updatedContest = await contestModel.update(id, updateData);
        console.log ('newquestion: ', reqBody.question)
        return updatedContest;
    } catch (error) {
        throw error;
    }
}

const deleteItem = async (contestId) => {
    try {
        const targetContest = await contestModel.findOneById(contestId)
        if (!targetContest) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Contest not found!')
        }
        // Xóa contest
        await contestModel.deleteOneById(contestId)
        // Xóa toàn bộ student thuộc contest

        // Xóa contestId trong mảng contestOrderIds trong Faculty chứa nó


        return { deleteResult: 'The contest and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const contestService = {
    createNew,
    getDetails,
    getAllContests,
    update,
    deleteItem
}