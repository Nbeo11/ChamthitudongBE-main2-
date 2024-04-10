/* eslint-disable no-useless-catch */
/* eslint-disable indent */
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

const EXERCISE_COLLECTION_NAME = 'exercises';
const EXERCISE_COLLECTION_SCHEMA = Joi.object({
    requirement: Joi.string().required(),
    inputs: Joi.array().items(
        Joi.object({
            input: Joi.string(),
            testcase: Joi.string().required().min(1).max(50).trim().strict(),
            score_percentage: Joi.string().required().min(1).max(50).trim().strict()
        })
    ).min(1).required(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
});

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const validateBeforeCreate = async (data) => {
    return await EXERCISE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);

        const newExerciseToAdd = {
            ...validData,
        };
        const createdExercise = await GET_DB().collection(EXERCISE_COLLECTION_NAME).insertOne(newExerciseToAdd);

        return createdExercise;
    } catch (error) {
        throw new Error(error);
    }
};

const findOneById = async (exerciseId) => {
    try {
        const result = await GET_DB().collection(EXERCISE_COLLECTION_NAME).findOne({
            _id: new ObjectId(exerciseId)
        });
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const getAllExercises = async () => {
    try {
        const allExercises = await GET_DB().collection(EXERCISE_COLLECTION_NAME).find().toArray();
        return allExercises;
    } catch (error) {
        throw error;
    }
};

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(EXERCISE_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        });
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteManyByExerciseId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(EXERCISE_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        });
        console.log('deleteManyByExerciseId - exercise', result);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const update = async (exerciseId, updateData) => {
    try {
        Object.keys(updateData).forEach(fieldName => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName];
            }
        });
        const result = await GET_DB().collection(EXERCISE_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(exerciseId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteOneById = async (exerciseId) => {
    try {
        const result = await GET_DB().collection(EXERCISE_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(exerciseId)
        });
        console.log('deleteOneById - exercise', result);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const exerciseModel = {
    EXERCISE_COLLECTION_NAME,
    EXERCISE_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllExercises,
    deleteManyByExerciseId,
    update,
    deleteOneById
};
