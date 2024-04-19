/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Sinh viên (user)
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { teacherModel } from '../teacherModel'
import { moduleModel } from './moduleModel'


//Define Collection (Name & Schema)
const TEACHING_GROUP_COLLECTION_NAME = 'teaching_groups'
const TEACHING_GROUP_COLLECTION_SCHEMA = Joi.object({
    moduleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    lecturerincharge: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    mainlecturer: Joi.array().items(
        Joi.object({
            lecturerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        })
    ).min(1),
    assistantlecturer: Joi.array().items(
        Joi.object({
            lecturerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        })
    ).min(1),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id']
const validateBeforeCreate = async (data) => {
    return await TEACHING_GROUP_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}


const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);

        const newTeaching_groupToAdd = {
            ...validData
        }

        const createdTeaching_group = await GET_DB().collection(TEACHING_GROUP_COLLECTION_NAME).insertOne(newTeaching_groupToAdd);

        return createdTeaching_group;
    } catch (error) {
        throw new Error(error);
    }
}

const findOneById = async (teaching_groupId) => {
    try {
        const result = await GET_DB().collection(TEACHING_GROUP_COLLECTION_NAME).findOne({
            _id: new ObjectId(teaching_groupId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const findOneByModuleId = async (moduleId) => {
    try {
        const result = await GET_DB().collection(TEACHING_GROUP_COLLECTION_NAME).findOne({
            _id: new ObjectId(moduleId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getModuleCodeByModuleId = async (moduleId) => {
    try {
        const module = await moduleModel.findOneById(moduleId);
        return module ? module.modulecode : null; // Trả về tên module nếu tồn tại, ngược lại trả về null
    } catch (error) {
        throw new Error(error);
    }
}

const getModuleNameByModuleId = async (moduleId) => {
    try {
        const module = await moduleModel.findOneById(moduleId);
        return module ? module.modulename : null; // Trả về tên module nếu tồn tại, ngược lại trả về null
    } catch (error) {
        throw new Error(error);
    }
}

const getLecturerNameByLecturerId = async (lecturerId) => {
    try {
        const teacher = await teacherModel.findOneById(lecturerId);
        return teacher ? teacher.username : null; // Trả về tên module nếu tồn tại, ngược lại trả về null
    } catch (error) {
        throw new Error(error);
    }
}


const getAllTeaching_groups = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const teaching_groups = await GET_DB().collection(TEACHING_GROUP_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        const teaching_groupsInfo = await Promise.all(teaching_groups.map(async (teaching_group) => {
            // Lấy tên của course từ courseId
            const moduleCode = await getModuleCodeByModuleId(teaching_group.moduleId);
            const moduleName = await getModuleNameByModuleId(teaching_group.moduleId);
            const lecturerInChargeName = await getLecturerNameByLecturerId(teaching_group.lecturerincharge);

            const mainLecturersWithNames = await Promise.all(teaching_group.mainlecturer.map(async (lecturer) => {
                const lecturerName = await getLecturerNameByLecturerId(lecturer.lecturerId);
                return {
                    ...lecturer,
                    lecturerName: lecturerName
                };
            }));

            // Thêm tên của giảng viên vào từng ID trong assistantlecturer
            const assistantLecturersWithNames = await Promise.all(teaching_group.assistantlecturer.map(async (lecturer) => {
                const lecturerName = await getLecturerNameByLecturerId(lecturer.lecturerId);
                return {
                    ...lecturer,
                    lecturerName: lecturerName
                };
            }));

            return {
                ...teaching_group,
                lecturerInChargeName: lecturerInChargeName,
                moduleCode: moduleCode,
                moduleName: moduleName,
                mainlecturer: mainLecturersWithNames,
                assistantlecturer: assistantLecturersWithNames
            };
        }));

        return teaching_groupsInfo;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(TEACHING_GROUP_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByTeaching_groupId = async (gradeId) => {
    try {
        const result = await GET_DB().collection(TEACHING_GROUP_COLLECTION_NAME).deleteMany({
            gradeId: new ObjectId(gradeId)
        })
        console.log('deleteManyByTeaching_groupId - teaching_group', result)
        return result
    } catch (error) { throw new Error(error) }
}


const update = async (teaching_groupId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(TEACHING_GROUP_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(teaching_groupId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (teaching_groupId) => {
    try {
        const result = await GET_DB().collection(TEACHING_GROUP_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(teaching_groupId)
        })
        console.log('deleteOneById - teaching_group', result)
        return result
    } catch (error) { throw new Error(error) }
}


export const teaching_groupModel = {
    TEACHING_GROUP_COLLECTION_NAME,
    TEACHING_GROUP_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllTeaching_groups,
    deleteManyByTeaching_groupId,
    update,
    deleteOneById,
    findOneByModuleId
}