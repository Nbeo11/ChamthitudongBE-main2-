/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Lớp học
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { organize_examModel } from './Examination/organize_examModel'
import { courseModel } from './courseModel'
import { ologyModel } from './ologyModel'
import { studentModel } from './studentModel'

//Define Collection (Name & Schema)
const GRADE_COLLECTION_NAME = 'grades'
const GRADE_COLLECTION_SCHEMA = Joi.object({
    courseId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    ologyId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    studentOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    gradecode: Joi.string().required().min(1).max(5000).trim().strict(),
    gradename: Joi.string().required().min(1).max(5000).trim().strict(),
    gradedescription: Joi.string().min(0).max(5000).trim().strict(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'courseId', 'ologyId', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await GRADE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newGradeToAdd = {
            ...validData,
            courseId: new ObjectId(validData.courseId),
            ologyId: new ObjectId(validData.ologyId)
        }
        const createdGrade = await GET_DB().collection(GRADE_COLLECTION_NAME).insertOne(newGradeToAdd)
        return createdGrade
    } catch (error) { throw new Error(error) }
}

const findOneById = async (gradeId) => {
    try {
        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).findOne({
            _id: new ObjectId(gradeId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllByOlogyId = async (ologyId) => {
    try {
        // Lấy tất cả các grade thuộc ology
        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).find({
            ologyId: new ObjectId(ologyId)
        }).toArray();
        return result;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getAllByCourseAndOlogyId = async (courseId, ologyId) => {
    try {
        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).find({
            courseId: new ObjectId(courseId),
            ologyId: new ObjectId(ologyId)
        }).toArray();

        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const getCourseNameByCourseId = async (courseId) => {
    try {
        const course = await courseModel.findOneById(courseId);
        return course ? course.coursename : null; // Trả về tên course nếu tồn tại, ngược lại trả về null
    } catch (error) {
        throw new Error(error);
    }
}

const getOlogyNameByOlogyId = async (ologyId) => {
    try {
        const ology = await ologyModel.findOneById(ologyId);
        return ology ? ology.ologyname : null; // Trả về tên ology nếu tồn tại, ngược lại trả về null
    } catch (error) {
        throw new Error(error);
    }
}

const getAllGrade = async () => {
    try {
        // Lấy tất cả các grade
        const grades = await GET_DB().collection(GRADE_COLLECTION_NAME).find().toArray();

        // Duyệt qua từng grade để lấy thông tin về course và thêm vào
        const gradesWithCourseInfo = await Promise.all(grades.map(async (grade) => {
            // Lấy tên của course từ courseId
            const courseName = await getCourseNameByCourseId(grade.courseId);
            const ologyName = await getOlogyNameByOlogyId(grade.ologyId)
            return {
                ...grade,
                courseName: courseName,
                ologyName: ologyName
            };
        }));

        return gradesWithCourseInfo;
    } catch (error) {
        throw new Error(error);
    }
}

const getDetails = async (id) => {
    try {
        const currentTime = new Date(); // Lấy thời điểm hiện tại

        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).aggregate([
            {
                $match: {
                    _id: new ObjectId(id),
                    _destroy: false
                }
            },
            {
                $lookup: {
                    from: studentModel.STUDENT_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'gradeId',
                    as: 'students'
                }
            },
            {
                $lookup: {
                    from: organize_examModel.ORGANIZE_EXAM_COLLECTION_NAME,
                    let: { gradeId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$$gradeId', '$details.gradeId']
                                }
                            }
                        },
                        {
                            $addFields: {
                                details: {
                                    $filter: {
                                        input: '$details',
                                        as: 'detail',
                                        cond: { $eq: ['$$detail.gradeId', '$$gradeId'] }
                                    }
                                }
                            }
                        }
                    ],
                    as: 'organizeExams'
                }
            }
        ]).toArray();

        if (result.length === 0) return {}; // Trả về kết quả rỗng nếu không tìm thấy dữ liệu

        // Lọc ra các kỳ thi đã qua thời gian hiện tại
        const examsPassedCurrentTime = [];
        const examsUpcoming = result[0].organizeExams.filter(exam => {
            const examStartTime = new Date(exam.details[0].exam_end);
            if (examStartTime > currentTime) {
                return true; // Kỳ thi sắp tới
            } else {
                examsPassedCurrentTime.push(exam); // Kỳ thi đã qua thời gian hiện tại
                return false;
            }
        });

        // Sắp xếp các kỳ thi sắp tới theo thời gian tăng dần
        examsUpcoming.sort((a, b) => {
            const startTimeA = new Date(a.details[0].exam_start);
            const startTimeB = new Date(b.details[0].exam_start);
            return startTimeA - startTimeB;
        });

        // Ghép danh sách các kỳ thi đã qua thời gian hiện tại vào cuối danh sách
        const organizeExams = [...examsUpcoming, ...examsPassedCurrentTime];

        // Thêm trạng thái cho mỗi organizeExams
        const examsWithStatus = organizeExams.map(exam => {
            // Kiểm tra xem 'details' có tồn tại và có phần tử không
            if (Array.isArray(exam.details) && exam.details.length > 0) {
                // Lấy phần tử đầu tiên của mảng 'details'
                const firstDetail = exam.details[0];
                // Lấy giá trị 'exam_start' và 'exam_end' từ phần tử đầu tiên
                const examStartTime = new Date(firstDetail.exam_start);
                const examEndTime = new Date(firstDetail.exam_end);

                // Kiểm tra thời gian hiện tại và áp dụng trạng thái tương ứng
                if (currentTime < examStartTime) {
                    return { ...exam, status: 0 }; // Trước giờ thi
                } else if (currentTime >= examStartTime && currentTime <= examEndTime) {
                    return { ...exam, status: 1 }; // Trong giờ thi
                } else {
                    return { ...exam, status: 2 }; // Sau giờ thi
                }
            } else {
                // Trong trường hợp 'details' không tồn tại hoặc rỗng
                return { ...exam, status: -1 }; // Trạng thái không xác định
            }
        });
        
        return {
            ...result[0],
            organizeExams: examsWithStatus
        };
    } catch (error) {
        throw new Error(error);
    }
}

const pushStudentOrderIds = async (student) => {
    try {
        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(student.gradeId) },
            { $push: { studentOrderIds: new ObjectId(student._id) } },
            { returnDocument: 'after' }
        )

        return result
    } catch (error) { throw new Error(error) }
}

const pullStudentOrderIds = async (student) => {
    try {
        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(student.courseId) },
            { $pull: { studentOrderIds: new ObjectId(student._id) } },
            { returnDocument: 'after' }
        )

        return result
    } catch (error) { throw new Error(error) }
}

const update = async (gradeId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(gradeId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (gradeId) => {
    try {
        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(gradeId)
        })
        console.log('deleteOneById - grade', result)
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByGradeId = async (ologyId) => {
    try {
        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).deleteMany({
            ologyId: new ObjectId(ologyId)
        })
        console.log('deleteManyByGradeId - grade', result)
        return result
    } catch (error) { throw new Error(error) }
}


export const gradeModel = {
    GRADE_COLLECTION_NAME,
    GRADE_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllByOlogyId,
    deleteManyByGradeId,
    getAllGrade,
    pushStudentOrderIds,
    update,
    deleteOneById,
    pullStudentOrderIds,
    getAllByCourseAndOlogyId
}