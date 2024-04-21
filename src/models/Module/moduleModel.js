/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Quản lý học phần
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

//Define Collection (Name & Schema)
const MODULE_COLLECTION_NAME = 'modules'
const MODULE_COLLECTION_SCHEMA = Joi.object({
    modulecode: Joi.string().required().min(1).max(5000).trim().strict(),
    modulename: Joi.string().required().min(1).max(5000).trim().strict(),
    numofcredit: Joi.string().required().pattern(/^[0-9]{1,2}$/),
    compulsory: Joi.boolean().required(),
    numoftheory: Joi.string().pattern(/^[0-9]{1,2}$/),
    numofpractice: Joi.string().pattern(/^[0-9]{1,2}$/),
    numoftask: Joi.string().pattern(/^[0-9]{1,2}$/),
    numofexam: Joi.string().pattern(/^[0-9]{1,2}$/),
    moduledescription: Joi.string().min(1).max(5000).trim().strict(),
    chapters: Joi.array().items(
        Joi.object({
            chaptername: Joi.string().min(1).max(5000).trim().strict(),
            description: Joi.string().min(1).max(255).trim().strict()
        })
    ),
    note: Joi.string().min(0).max(5000).trim().strict(),
    modulestatus: Joi.number().valid(0, 1, 2, 3).default(0),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id']
const validateBeforeCreate = async (data) => {
    return await MODULE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}


const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);

        // Kiểm tra trường chapters tồn tại và không phải là undefined
        const chaptersWithIds = validData.chapters && Array.isArray(validData.chapters)
            ? validData.chapters.map(chapter => ({
                ...chapter,
                _id: new ObjectId()
            }))
            : [];

        const newModuleToAdd = {
            ...validData,
            chapters: chaptersWithIds
        }
        
        const createdModule = await GET_DB().collection(MODULE_COLLECTION_NAME).insertOne(newModuleToAdd);

        return createdModule;
    } catch (error) {
        throw new Error(error);
    }
}


const findOneById = async (moduleId) => {
    try {
        const result = await GET_DB().collection(MODULE_COLLECTION_NAME).findOne({
            _id: new ObjectId(moduleId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllModules = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allModules = await GET_DB().collection(MODULE_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allModules;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(MODULE_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByModuleId = async (gradeId) => {
    try {
        const result = await GET_DB().collection(MODULE_COLLECTION_NAME).deleteMany({
            gradeId: new ObjectId(gradeId)
        })
        console.log('deleteManyByModuleId - module', result)
        return result
    } catch (error) { throw new Error(error) }
}


const update = async (moduleId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(MODULE_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(moduleId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}


const deleteOneById = async (moduleId) => {
    try {
        const result = await GET_DB().collection(MODULE_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(moduleId)
        })
        console.log('deleteOneById - module', result)
        return result
    } catch (error) { throw new Error(error) }
}



const addChapterToModule = async (moduleId, chapter) => {
    try {
        const result = await GET_DB().collection(MODULE_COLLECTION_NAME).updateOne(
            { _id: new ObjectId(moduleId) },
            { $push: { chapters: chapter } }
        );
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

const deleteChapterFromModule = async (moduleId, chapterId) => {
    try {
        const result = await GET_DB().collection(MODULE_COLLECTION_NAME).updateOne(
            { _id: new ObjectId(moduleId) },
            { $pull: { chapters: { _id: chapterId } } }
        );
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

const updateChapterById = async (moduleId, chapterId, updateData) => {
    try {
        const result = await GET_DB().collection(MODULE_COLLECTION_NAME).updateOne(
            { _id: new ObjectId(moduleId), 'chapters._id': chapterId },
            { $set: { 'chapters.$': updateData } }
        );
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

const updateModuleAndChapters = async (moduleId, updateData) => {
    try {
        const { moduleData, chaptersToUpdate, chaptersToAdd, chaptersToDelete } = updateData;

        await update(moduleId, moduleData);

        const updatePromises = chaptersToUpdate.map(async chapter => {
            const chapterId = chapter._id;
            const chapterUpdateData = { chaptername: chapter.chaptername, description: chapter.description };
            return await updateChapterById(moduleId, chapterId, chapterUpdateData);
        });

        const addPromises = chaptersToAdd.map(async chapter => {
            return await addChapterToModule(moduleId, chapter);
        });

        const deletePromises = chaptersToDelete.map(async chapterId => {
            return await deleteChapterFromModule(moduleId, chapterId);
        });

        await Promise.all([...updatePromises, ...addPromises, ...deletePromises]);

        const updatedModule = await findOneById(moduleId);

        return updatedModule;
    } catch (error) {
        throw new Error(error);
    }
}

export const moduleModel = {
    MODULE_COLLECTION_NAME,
    MODULE_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllModules,
    deleteManyByModuleId,
    update,
    deleteOneById,
    updateModuleAndChapters,
    addChapterToModule,
    deleteChapterFromModule
}