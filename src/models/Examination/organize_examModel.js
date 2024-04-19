/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Chuyên ngành học
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

//Define Collection (Name & Schema)
const ORGANIZE_EXAM_COLLECTION_NAME = 'organize_exams'
const ORGANIZE_EXAM_COLLECTION_SCHEMA = Joi.object({
    contestId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    moduleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    time_countdown: Joi.number().integer().min(0).required(),
    details: Joi.array().items(
        Joi.object({
            ologyId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
            gradeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
            exam_date: Joi.date().required().iso(),
            exam_start: Joi.date().required(), // Lưu cả ngày và thời gian bắt đầu
            exam_end: Joi.date().required(),
            room: Joi.string().required().min(1).max(5000).trim().strict()
        })
    ).min(1).required(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'contestId', 'moduleId', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await ORGANIZE_EXAM_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newOrganize_examToAdd = {
            ...validData,
            contestId: new ObjectId(validData.contestId),
            moduleId: new ObjectId(validData.moduleId),
            details: validData.details.map(item => ({
                ...item,
                ologyId: new ObjectId(item.ologyId), // Chuyển đổi ologyId sang ObjectId
                gradeId: new ObjectId(item.gradeId),
            }))
        }
        const createdOrganize_exam = await GET_DB().collection(ORGANIZE_EXAM_COLLECTION_NAME).insertOne(newOrganize_examToAdd)
        return createdOrganize_exam
        // return await GET_DB().collection(ORGANIZE_EXAM_COLLECTION_NAME).insertOne(validData)
    } catch (error) { throw new Error(error) }
}

const findOneById = async (organize_examId) => {
    try {
        const result = await GET_DB().collection(ORGANIZE_EXAM_COLLECTION_NAME).findOne({
            _id: new ObjectId(organize_examId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllOrganize_exams = async (query) => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allOrganize_exams = await GET_DB().collection(ORGANIZE_EXAM_COLLECTION_NAME).find(query).toArray();
        // Trả về kết quả
        return allOrganize_exams;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(ORGANIZE_EXAM_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getByModuleId = async (moduleId) => {
    try {
        // Lấy tất cả các ology thuộc course
        const result = await GET_DB().collection(ORGANIZE_EXAM_COLLECTION_NAME).findOne({
            moduleId: new ObjectId(moduleId)
        });
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

const getDetailByGradeId = async (gradeId) => {
    try {
        const allOrganize_exams = await GET_DB().collection(ORGANIZE_EXAM_COLLECTION_NAME).find().toArray();
        
        // Lặp qua từng bản ghi organize_exam để tìm thông tin của gradeId
        const detailsArray = allOrganize_exams.reduce((acc, curr) => acc.concat(curr.details), []);
        // Tìm thông tin của gradeId trong mảng details
        const detail = detailsArray.find(detail => detail.gradeId === gradeId);

        if (detail) {
            // Nếu tìm thấy, trả về thông tin contestId, moduleId và time_countdown tương ứng
            const { contestId, moduleId, time_countdown } = detail;
            return { contestId, moduleId, time_countdown };
        } else {
            // Nếu không tìm thấy, trả về null
            return null;
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        throw new Error(error);
    }
}

const update = async (organize_examId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(ORGANIZE_EXAM_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(organize_examId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (organize_examId) => {
    try {
        const result = await GET_DB().collection(ORGANIZE_EXAM_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(organize_examId)
        })
        console.log('deleteOneById - organize_exam', result)
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByOrganize_examId = async (courseId) => {
    try {
        const result = await GET_DB().collection(ORGANIZE_EXAM_COLLECTION_NAME).deleteMany({
            courseId: new ObjectId(courseId)
        })
        console.log('deleteManyByOrganize_examId - organize_exam', result)
        return result
    } catch (error) { throw new Error(error) }
}


export const organize_examModel = {
    ORGANIZE_EXAM_COLLECTION_NAME,
    ORGANIZE_EXAM_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getDetailByGradeId,
    getAllOrganize_exams,
    update,
    deleteOneById,
    deleteManyByOrganize_examId,
    getByModuleId
}