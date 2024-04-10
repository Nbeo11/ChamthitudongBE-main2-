/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes';
import { exerciseService } from '~/services/code/exerciseService';

const createNew = async (req, res, next) => {
    try {
        const createdExercise = await exerciseService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdExercise);
    } catch (error) {
        next(error);
    }
};

const getAllExercises = async (req, res, next) => {
    try {
        const allExercises = await exerciseService.getAllExercises();
        res.status(StatusCodes.OK).json(allExercises);
    } catch (error) {
        next(error);
    }
};

const getDetails = async (req, res, next) => {
    try {
        const exerciseId = req.params.id;
        const exercise = await exerciseService.getDetails(exerciseId);
        res.status(StatusCodes.OK).json(exercise);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const exerciseId = req.params.id;
        const updatedExercise = await exerciseService.update(exerciseId, req.body);
        res.status(StatusCodes.OK).json(updatedExercise);
    } catch (error) {
        next(error);
    }
};

const deleteItem = async (req, res, next) => {
    try {
        const exerciseId = req.params.id;
        const result = await exerciseService.deleteItem(exerciseId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

export const exerciseController = {
    createNew,
    getDetails,
    getAllExercises,
    update,
    deleteItem
};
