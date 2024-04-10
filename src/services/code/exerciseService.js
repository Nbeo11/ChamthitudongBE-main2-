/* eslint-disable indent */
/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes';
import { exerciseModel } from '~/models/code/exerciseModel';
import ApiError from '~/utils/ApiError';

const createNew = async (reqBody) => {
    try {
        const newExercise = {
            ...reqBody
        };
        const createdExercise = await exerciseModel.createNew(newExercise);
        const getNewExercise = await exerciseModel.findOneById(createdExercise.insertedId);

        return getNewExercise;
    } catch (error) {
        throw error;
    }
};

const getAllExercises = async () => {
    try {
        const allExercises = await exerciseModel.getAllExercises();
        return allExercises;
    } catch (error) {
        throw error;
    }
};

const getDetails = async (exerciseId) => {
    try {
        const exercise = await exerciseModel.getDetails(exerciseId);
        if (!exercise) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Exercise not found!');
        }

        return exercise;
    } catch (error) {
        throw error;
    }
};

const update = async (id, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        };
        const updatedExercise = await exerciseModel.update(id, updateData);
        return updatedExercise;
    } catch (error) {
        throw error;
    }
};

const deleteItem = async (exerciseId) => {
    try {
        const targetExercise = await exerciseModel.findOneById(exerciseId);
        if (!targetExercise) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Exercise not found!');
        }
        await exerciseModel.deleteOneById(exerciseId);
        return { deleteResult: 'The exercise and its references have been deleted!' };
    } catch (error) {
        throw error;
    }
};

export const exerciseService = {
    createNew,
    getDetails,
    getAllExercises,
    update,
    deleteItem
};
