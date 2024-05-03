/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Độ khó của câu hỏi
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

//Define Collection (Name & Schema)
const QUESTION_BANK_COLLECTION_NAME = 'question_banks'
const QUESTION_BANK_COLLECTION_SCHEMA = Joi.object({
    moduleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    chapters: Joi.array().items(
        Joi.object({
            chapter: Joi.string()
        })
    ).min(1).required(),
    question_format: Joi.string().valid('Trắc nghiệm', 'Thực hành', 'Lý thuyết').required(),
    difficulty: Joi.string().required().trim().strict(),
    question_detail: Joi.string().required().min(1).trim().strict(),
    inputs: Joi.alternatives().conditional('question_format', {
        is: 'Thực hành',
        then: Joi.array().items(
            Joi.object({
                input: Joi.string(),
                testcase: Joi.string().required().min(1).max(5000).trim().strict(),
                score_percentage: Joi.number().required().min(0).max(100),
            })
        ).min(1).required(),
        otherwise: Joi.array().items(
            Joi.object({
                input: Joi.string().required(),
            })
        ).min(1).required(),
    }),
    key: Joi.when('question_format', {
        is: 'Trắc nghiệm',
        then: Joi.array().items(Joi.string()).min(1).required(),
        otherwise: Joi.forbidden(),
    }),
    question_bankstatus: Joi.number().valid(1, 2, 3).default(1),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
});

const INVALID_UPDATE_FIELDS = ['_id', 'moduleId', 'question_format', 'createdAt']

const validateBeforeCreate = async (data) => {
    try {
        const validData = await QUESTION_BANK_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
        
        if (validData.question_format === 'Trắc nghiệm') {
            // Kiểm tra xem có đáp án đúng không, nếu không có, báo lỗi
            
            // Kiểm tra các phần tử trong mảng key phải có trong mảng inputs
            validData.key.forEach(keyItem => {
                if (!validData.inputs.some(input => input.input === keyItem)) {
                    throw new Error('Mỗi phần tử trong mảng key phải tồn tại trong mảng inputs');
                }
            });
        }
        
        return validData;
    } catch (error) {
        throw new Error(error);
    }
}




const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)

        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newQuestion_bankToAdd = {
            ...validData,
            moduleId: new ObjectId(validData.moduleId)
        }
        const createdQuestion_bank = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).insertOne(newQuestion_bankToAdd)


        return createdQuestion_bank
    } catch (error) { throw new Error(error) }
}

const findOneById = async (question_bankId) => {
    try {
        const result = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).findOne({
            _id: new ObjectId(question_bankId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllQuestion_banks = async (query) => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các câu hỏi với các điều kiện lọc
        const allQuestion_banks = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).find(query).toArray();

        const resultWithNames = await Promise.all(allQuestion_banks.map(async (qeuestion_bank) => {
            const moduleName = await getModuleNameById(qeuestion_bank.moduleId);

            return { ...qeuestion_bank, moduleName };
        }));
        return resultWithNames;

    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getModuleNameById = async (moduleId) => {
    try {
        const result = await GET_DB().collection('modules').findOne({
            _id: new ObjectId(moduleId)
        });
        return result ? result.modulename : null;
    } catch (error) {
        throw new Error(error);
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        });

        const moduleName = await getModuleNameById(result.moduleId)

        // Kết hợp tên module vào kết quả trả về
        const detailsWithModuleName = {
            ...result,
            moduleName
        };

        return detailsWithModuleName;
    } catch (error) {
        throw new Error(error);
    }
}


const deleteManyByQuestion_bankId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByQuestion_bankId - question_bank', result)
        return result
    } catch (error) { throw new Error(error) }
}

const update = async (question_bankId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(question_bankId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (question_bankId) => {
    try {
        const result = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(question_bankId)
        })
        console.log('deleteOneById - question_bank', result)
        return result
    } catch (error) { throw new Error(error) }
}

export const question_bankModel = {
    QUESTION_BANK_COLLECTION_NAME,
    QUESTION_BANK_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllQuestion_banks,
    deleteManyByQuestion_bankId,
    update,
    deleteOneById
}