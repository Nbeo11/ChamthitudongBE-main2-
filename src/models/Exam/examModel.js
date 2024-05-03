/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Bài thi
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { exam_structureService } from '~/services/Exam/exam_structureService';
import { question_bankService } from '~/services/Exam/question_bankService';
import { organize_examService } from '~/services/Examination/organize_examService';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

//Define Collection (Name & Schema)
const EXAM_COLLECTION_NAME = 'exams'
const EXAM_COLLECTION_SCHEMA = Joi.object({
    organize_examId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    moduleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    totalscore: Joi.number().required().min(1),
    exam_format: Joi.string().valid('Trắc nghiệm', 'Thực hành', 'Lý thuyết').required(),
    question: Joi.array().items(
        Joi.object({
            question_bankId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
            question_score: Joi.number().required().min(0).max(100),
        })
    ).min(1).required(),
    examstatus: Joi.number().valid(1, 2, 3).default(1),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
});


const INVALID_UPDATE_FIELDS = ['_id', 'moduleId', 'createdAt']

const validateBeforeCreate = async (data) => {
    try {
        const validData = await EXAM_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });

        // Kiểm tra xem question_format có giống với exam_format không
        await Promise.all(validData.question.map(async (questionItem) => {
            const question = await GET_DB().collection('question_banks').findOne({
                _id: new ObjectId(questionItem.question_bankId)
            });
            if (question.question_format !== validData.exam_format) {
                throw new Error('question_format phải giống với exam_format');
            }
        }));

        return validData;
    } catch (error) {
        throw new Error(error);
    }
}


const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)

        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newExamToAdd = {
            ...validData,
            moduleId: new ObjectId(validData.moduleId),
            organize_examId: new ObjectId(validData.organize_examId),
            question: validData.question.map(item => ({
                ...item,
                question_bankId: new ObjectId(item.question_bankId) // Chuyển đổi question_bankId sang ObjectId
            }))
        }
        const createdExam = await GET_DB().collection(EXAM_COLLECTION_NAME).insertOne(newExamToAdd)


        return createdExam
    } catch (error) { throw new Error(error) }
}

const createAutoExam = async (moduleId, numberOfExams = 1) => {
    try {
        const exams = [];

        for (let i = 0; i < numberOfExams; i++) {
            // Lấy organize_examId
            const organize_exam = await organize_examService.getByModuleId(moduleId);
            const organize_examId = organize_exam._id.toString(); 
            // console.log('organize_examId', organize_examId);

            // Lấy cấu trúc bài thi dựa trên moduleId
            const examStructure = await exam_structureService.getByModuleId(moduleId);
            // console.log('moduleId', moduleId);
            // console.log('examStructure', examStructure);

            // Trích xuất dữ liệu cần thiết từ examStructure
            const { exam_format, structures } = examStructure;
            // console.log('exam_format', exam_format);
            // console.log('exam_structure', structures);

            // Initialize array to store generated questions
            const generatedQuestions = [];

            // Lặp qua cấu trúc bài thi
            for (let j = 0; j < structures.length; j++) {
                const { difficulty, chapters } = structures[j];
                // console.log(`Difficulty: ${difficulty}`);
                for (const chapter of chapters) {
                    // console.log('Chapter:');
                    // console.log(chapter); // Log toàn bộ đối tượng chapter để xem cụ thể
                }
                const questions = await question_bankService.getAllQuestion_banks(
                    moduleId,
                    exam_format,
                    difficulty,
                    chapters.map(chapter => chapter)
                    
                );
                console.log(moduleId)
                console.log(exam_format)
                console.log(difficulty)
                console.log(chapters.map(chapter => chapter)
            )
                console.log('questions: ', questions)
                const randomIndex = Math.floor(Math.random() * questions.length);
                generatedQuestions.push({
                    ...questions[randomIndex],
                    question_score: structures[j].score // Lấy điểm số từ exam_structure
                });
                // console.log('generatedQuestions: ', generatedQuestions);
            }
            
            // Calculate total score based on the number of questions
            const totalScore = generatedQuestions.reduce((total, question) => total + question.question_score, 0);

            // Create exam object
            const autoExam = {
                organize_examId: organize_examId,
                moduleId: moduleId,
                totalscore: totalScore,
                exam_format,
                question: generatedQuestions.map(({ _id, question_score }) => ({
                    question_bankId: _id.toString(),
                    question_score
                })),
                examstatus: 1 // Assuming the default exam status
            };

            // Create the exam
            const createdExam = await createNew(autoExam);
            exams.push(createdExam);
        }

        return exams;
    } catch (error) {
        throw new Error(error);
    }
};



const findOneById = async (examId) => {
    try {
        const result = await GET_DB().collection(EXAM_COLLECTION_NAME).findOne({
            _id: new ObjectId(examId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllExams = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allExams = await GET_DB().collection(EXAM_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allExams;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(EXAM_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByExamId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(EXAM_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByExamId - exam', result)
        return result
    } catch (error) { throw new Error(error) }
}

const update = async (examId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        });

        // Kiểm tra xem trường question có trong updateData không
        if (updateData.question) {
            // Lặp qua mảng question và chuyển đổi các question_bankId thành ObjectId
            updateData.question = updateData.question.map(item => ({
                ...item,
                question_bankId: new ObjectId(item.question_bankId)
            }));
        }

        const result = await GET_DB().collection(EXAM_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(examId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result;
    } catch (error) {
        throw new Error(error);
    }
};


const deleteOneById = async (examId) => {
    try {
        const result = await GET_DB().collection(EXAM_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(examId)
        })
        console.log('deleteOneById - exam', result)
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByModuleId = async (moduleId) => {
    try {
        const result = await GET_DB().collection(EXAM_COLLECTION_NAME).deleteMany({
            moduleId: new ObjectId(moduleId)
        });
        console.log('deleteManyByModuleId - exams', result);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};


export const examModel = {
    EXAM_COLLECTION_NAME,
    EXAM_COLLECTION_SCHEMA,
    createNew,
    createAutoExam,
    findOneById,
    getDetails,
    getAllExams,
    deleteManyByExamId,
    update,
    deleteOneById,
    deleteManyByModuleId
}