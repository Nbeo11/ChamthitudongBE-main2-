/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { testModel } from '~/models/code/testModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newTest = {
            ...reqBody
        }
        const createdTest = await testModel.createNew(newTest)
        const getNewTest = await testModel.findOneById(createdTest.insertedId)

        
        return getNewTest
    } catch (error) {
        throw error
    }
}

const getAllTests = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allTests = await testModel.getAllTests()
        return allTests
    } catch (error) { throw error }
}

const getDetails = async (testId) => {
    try {
        const test = await testModel.getDetails(testId)
        if (!test) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Test not found!')
        }

        return test
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
        const updatedTest = await testModel.update(id, updateData);
        return updatedTest
    } catch (error) {
        throw error
    }
}

const deleteItem = async (testId) => {
    try {
        const targetTest = await testModel.findOneById(testId)
        if (!targetTest) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Test not found!')
        }
        // Xóa test
        await testModel.deleteOneById(testId)
        // Xóa toàn bộ student thuộc test

        // Xóa testId trong mảng testOrderIds trong Faculty chứa nó


        return { deleteResult: 'The test and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const testService = {
    createNew,
    getDetails,
    getAllTests,
    update,
    deleteItem
}