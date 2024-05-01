/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Cấu trúc đề thi
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { moduleModel } from '../Module/moduleModel';

//Define Collection (Name & Schema)
const EXAM_STRUCTURE_COLLECTION_NAME = 'exam_structures'
const EXAM_STRUCTURE_COLLECTION_SCHEMA = Joi.object({
    moduleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    exam_time: Joi.string().pattern(/^[0-9]{1,3}$/),
    exam_format: Joi.string().valid('Trắc nghiệm', 'Thực hành', 'Lý thuyết'),
    exam_structure: Joi.array().items(
        Joi.object({
            score: Joi.number().min(1),
            chapters: Joi.array().items(
                Joi.object({
                    chapter: Joi.string()
                })
            ).min(1),
            difficulty: Joi.string().trim().strict(),
        })
    ),
    note: Joi.string().min(1).max(5000).trim().strict(),
    exam_structurestatus: Joi.number().valid(0, 1, 2, 3).default(0),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
});


const INVALID_UPDATE_FIELDS = ['_id', 'moduleId', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await EXAM_STRUCTURE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}


const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)

        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newExam_structureToAdd = {
            ...validData,
            moduleId: new ObjectId(validData.moduleId)
        }
        const createdExam_structure = await GET_DB().collection(EXAM_STRUCTURE_COLLECTION_NAME).insertOne(newExam_structureToAdd)


        return createdExam_structure
    } catch (error) { throw new Error(error) }
}

const findOneById = async (exam_structureId) => {
    try {
        const result = await GET_DB().collection(EXAM_STRUCTURE_COLLECTION_NAME).findOne({
            _id: new ObjectId(exam_structureId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getByModuleId = async (moduleId) => {
    try {
        // Lấy tất cả các student thuộc grade
        const result = await GET_DB().collection(EXAM_STRUCTURE_COLLECTION_NAME).findOne({
            moduleId: new ObjectId(moduleId)
        })
        const moduleInfo = await getModuleNameByModuleId(result.moduleId)
        const detail = {
            ...result,
            moduleName: moduleInfo.modulename,
            moduleCode: moduleInfo.modulecode,
            numofCredit: moduleInfo.numofcredit
        };
        return detail
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getAllExam_structures = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allExam_structures = await GET_DB().collection(EXAM_STRUCTURE_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allExam_structures;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getModuleNameByModuleId = async (moduleId) => {
    try {
        const module = await moduleModel.findOneById(moduleId);
        return module; // Trả về tên module nếu tồn tại, ngược lại trả về null
    } catch (error) {
        throw new Error(error);
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(EXAM_STRUCTURE_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        const moduleInfo = await getModuleNameByModuleId(result.moduleId)
        const detail = {
            ...result,
            moduleName: moduleInfo.modulename,
            moduleCode: moduleInfo.modulecode,
            numofCredit: moduleInfo.numofcredit
        };
        return detail
    } catch (error) { throw new Error(error) }
}

const deleteManyByExam_structureId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(EXAM_STRUCTURE_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByExam_structureId - exam_structure', result)
        return result
    } catch (error) { throw new Error(error) }
}

const update = async (exam_structureId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(EXAM_STRUCTURE_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(exam_structureId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (exam_structureId) => {
    try {
        const result = await GET_DB().collection(EXAM_STRUCTURE_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(exam_structureId)
        })
        console.log('deleteOneById - exam_structure', result)
        return result
    } catch (error) { throw new Error(error) }
}

const deleteByModuleId = async (moduleId) => {
    try {
        const result = await GET_DB().collection(EXAM_STRUCTURE_COLLECTION_NAME).deleteMany({
            moduleId: new ObjectId(moduleId)
        });
        console.log('deleteByModuleId - exam_structure', result);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}


export const exam_structureModel = {
    EXAM_STRUCTURE_COLLECTION_NAME,
    EXAM_STRUCTURE_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllExam_structures,
    deleteManyByExam_structureId,
    update,
    deleteOneById,
    getByModuleId,
    deleteByModuleId
}