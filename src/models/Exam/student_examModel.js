/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Bài thi
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { studentcodeModel } from '../code/studentcodeModel';
import { examModel } from './examModel';

//Define Collection (Name & Schema)
const STUDENT_EXAM_COLLECTION_NAME = 'student_exams'
const STUDENT_EXAM_COLLECTION_SCHEMA = Joi.object({
    studentId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    examId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    question: Joi.array().items(
        Joi.object({
            question_bankId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
            question_score: Joi.number().min(0).max(100),
        })
    ).min(1),
    finalscore: Joi.number().min(0).default(0),
    student_examstatus: Joi.number().valid(1, 2, 3).default(1),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
});


const INVALID_UPDATE_FIELDS = ['_id', 'studentId', 'examId', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await STUDENT_EXAM_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}


const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);

        let newStudent_examToAdd = { ...validData };

        // Nếu tồn tại examId
        if (validData.examId) {
            // Lấy dữ liệu của exam từ examModel
            const exam = await examModel.findOneById(validData.examId);

            // Sao chép giá trị của mảng question từ exam sang student_exam
            newStudent_examToAdd.question = exam.question;
        }

        // Chuyển đổi các giá trị ObjectId
        newStudent_examToAdd = {
            ...newStudent_examToAdd,
            examId: new ObjectId(newStudent_examToAdd.examId),
            studentId: new ObjectId(newStudent_examToAdd.studentId),
            question: newStudent_examToAdd.question.map(item => ({
                ...item,
                question_bankId: new ObjectId(item.question_bankId)
            }))
        };

        // Thêm dữ liệu vào student_exam
        const createdStudent_exam = await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).insertOne(newStudent_examToAdd);

        return createdStudent_exam;
    } catch (error) {
        throw new Error(error);
    }
};
const findOneById = async (student_examId) => {
    try {
        const result = await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).findOne({
            _id: new ObjectId(student_examId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const findStudentExamsByExamId = async (examId) => {
    try {
        // Sử dụng MongoDB để tìm các bản ghi student_exam có examId tương ứng
        const studentExams = await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).find({ examId: examId }).toArray();
        return studentExams;
    } catch (error) {
        console.error('Error finding student exams by examId:', error);
        throw new Error('Error finding student exams by examId');
    }
};

const getAllStudent_exams = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allStudent_exams = await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allStudent_exams;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByStudent_examId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByStudent_examId - student_exam', result)
        return result
    } catch (error) { throw new Error(error) }
}

const update = async (student_examId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(student_examId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (student_examId) => {
    try {
        const result = await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(student_examId)
        })
        console.log('deleteOneById - student_exam', result)
        return result
    } catch (error) { throw new Error(error) }
}

const updateStudentExamsWithNewQuestions = async (examId, newQuestions) => {
    try {
        // Lấy tất cả các bản ghi student_exam liên quan đến examId
        const studentExams = await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).find({ examId: new ObjectId(examId) }).toArray();

        // Cập nhật mảng question trong từng bản ghi student_exam
        for (const studentExam of studentExams) {
            // Cập nhật mảng question_bankId trong studentExam.question
            studentExam.question = newQuestions.map(item => ({
                question_bankId: new ObjectId(item.question_bankId),
                question_score: item.question_score
            }));

            // Cập nhật bản ghi student_exam
            await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).updateOne(
                { _id: studentExam._id },
                { $set: { question: studentExam.question } }
            );
        }

        console.log(`Updated ${studentExams.length} student exams.`);
    } catch (error) {
        console.error('Error updating student exams:', error);
    }
};

const calculateAndUpdateFinalScore = async (student_examId) => {
    try {
        // Lấy tất cả các student codes của student_examId
        const studentCodes = await studentcodeModel.getAllByStudentExamId(student_examId);

        // Tính tổng scoregot
        let totalScore = 0;
        for (const studentCode of studentCodes) {
                totalScore += studentCode.scoregot || 0;
                console.log ('totalScore: ', studentCode.scoregot)
        }
        console.log ('finalscore: ', totalScore)
        // Cập nhật finalscore vào student_exam
        const result = await GET_DB().collection(STUDENT_EXAM_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(student_examId) },
            { $set: { finalscore: totalScore } },
            { returnDocument: 'after' }
        );

        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const student_examModel = {
    STUDENT_EXAM_COLLECTION_NAME,
    STUDENT_EXAM_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllStudent_exams,
    deleteManyByStudent_examId,
    update,
    deleteOneById,
    findStudentExamsByExamId,
    updateStudentExamsWithNewQuestions,
    calculateAndUpdateFinalScore
}