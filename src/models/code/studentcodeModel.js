/* eslint-disable indent */
//sv đưa source của bài lên
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

// Define Collection (Name & Schema)
const STUDENT_CODE_COLLECTION_NAME = 'studentcodes';
const STUDENT_CODE_COLLECTION_SCHEMA = Joi.object({
    student_examId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    question_bankId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    sourceCode: Joi.string().required().min(1).trim().strict(),
    scoregot: Joi.number().min(0),
    output: Joi.array().items(
        Joi.object({
            input: Joi.string(),
            executionOutput: Joi.string().required().min(1).max(5000).trim().strict(),
            expectedOutput: Joi.string().required().min(1).max(5000).trim().strict(),
            executionError: Joi.string().allow(''),
            check:Joi.boolean().default(false),
            score: Joi.number().required().min(0),
        })
    ).min(1),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    startedAt: Joi.date().timestamp('javascript'),
    completedAt: Joi.date().timestamp('javascript'),
    executionTime:  Joi.string().min(0).max(5000).trim().strict(),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
});

const INVALID_UPDATE_FIELDS = ['_id', 'question_bankId', 'student_examId', 'createdAt']

// Validate data before creating
const validateBeforeCreate = async (data) => {
    return await STUDENT_CODE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

// Create new student code
const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        const newStudentCodeToAdd = {
            ...validData,
            student_examId: new ObjectId(validData.student_examId),
            question_bankId: new ObjectId(validData.question_bankId)
        };
        const createdStudentCode = await GET_DB().collection(STUDENT_CODE_COLLECTION_NAME).insertOne(newStudentCodeToAdd);
        return createdStudentCode;
    } catch (error) {
        throw new Error(error);
    }
};

const update = async (studentcodeId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(STUDENT_CODE_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(studentcodeId) },
            { $set: updateData},
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(STUDENT_CODE_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllByStudentExamId = async (student_examId) => {
    try {
        const result = await GET_DB().collection(STUDENT_CODE_COLLECTION_NAME).find({
            student_examId: new ObjectId(student_examId)
        }).toArray();
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

// Find one student code by ID
const findOneById = async (studentCodeId) => {
    try {
        const result = await GET_DB().collection(STUDENT_CODE_COLLECTION_NAME).findOne({
            _id: new ObjectId(studentCodeId)
        });
        return result;
    } catch (error) {
        throw new Error(error);
    }
};


// Find one student code by Question ID
const findOneByQuestionAndExamId = async (student_examId, question_bankId) => {
    try {
        const result = await GET_DB().collection(STUDENT_CODE_COLLECTION_NAME).findOne({
            student_examId: new ObjectId(student_examId),
            question_bankId: new ObjectId(question_bankId)
        });
        
        console.log('student_examId: ',student_examId);
        console.log('question_bankId: ', question_bankId);
        
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

// Export student code model
export const studentcodeModel = {
    STUDENT_CODE_COLLECTION_NAME,
    STUDENT_CODE_COLLECTION_SCHEMA,
    getAllByStudentExamId,
    createNew,
    update,
    getDetails,
    findOneById,
    findOneByQuestionAndExamId,
};
