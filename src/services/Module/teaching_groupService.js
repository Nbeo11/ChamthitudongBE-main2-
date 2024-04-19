/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
// Nhóm giảng dạy
import { StatusCodes } from 'http-status-codes'
import { teaching_groupModel } from '~/models/Module/teaching_groupModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newTeaching_group = {
            ...reqBody
        }
        const createdTeaching_group = await teaching_groupModel.createNew(newTeaching_group)
        const getNewTeaching_group = await teaching_groupModel.findOneById(createdTeaching_group.insertedId)
        
        return getNewTeaching_group
    } catch (error) {
        throw error
    }
}

const getAllTeaching_groups = async () => {
    try {
        const allTeaching_groups = await teaching_groupModel.getAllTeaching_groups()
        return allTeaching_groups
    } catch (error) { throw error }
}

const findOneByModuleId = async (moduleId) => {
    try {
        const result = await teaching_groupModel.findOneByModuleId(moduleId)
        
        return result
    } catch (error) {
        throw error
    }
}

const getDetails = async (teaching_groupId) => {
    try {
        const teaching_group = await teaching_groupModel.getDetails(teaching_groupId)
        if (!teaching_group) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Teaching_group not found!')
        }

        return teaching_group
    } catch (error) {
        throw error
    }
}

const update = async (id, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedTeaching_group = await teaching_groupModel.update(id, updateData);
        return updatedTeaching_group
    } catch (error) {
        throw error
    }
}

const deleteItem = async (teaching_groupId) => {
    try {
        const targetTeaching_group = await teaching_groupModel.findOneById(teaching_groupId)
        if (!targetTeaching_group) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Teaching_group not found!')
        }
        // Xóa teaching_group
        await teaching_groupModel.deleteOneById(teaching_groupId)
        // Xóa toàn bộ student thuộc teaching_group

        return { deleteResult: 'The teaching_group and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

const getTeachingGroupsByLecturer = async (lecturerId) => {
    try {
        // Tìm các môn học mà giảng viên đó là giảng viên phụ trách hoặc giảng viên dạy chính hoặc giảng viên trợ giảng
        const teachingGroups = await teaching_groupModel.find({
            $or: [
                { lecturerinchargeId: lecturerId },
                { mainlecturerId: { $in: [lecturerId] } },
                { assistantlecturerId: { $in: [lecturerId] } }
            ]
        }).exec();

        // Trả về danh sách các môn học và vai trò của giảng viên trong mỗi môn
        return teachingGroups.map(teachingGroup => {
            let role = '';
            if (teachingGroup.lecturerinchargeId === lecturerId) {
                role = 'Phụ trách';
            } else if (teachingGroup.mainlecturerId.includes(lecturerId)) {
                role = 'Giảng viên chính';
            } else if (teachingGroup.assistantlecturerId.includes(lecturerId)) {
                role = 'Trợ giảng';
            }

            return {
                moduleId: teachingGroup.moduleId,
                role: role
            };
        });
    } catch (error) {
        throw error;
    }
};

export const teaching_groupService = {
    createNew,
    getDetails,
    getAllTeaching_groups,
    update,
    deleteItem,
    getTeachingGroupsByLecturer,
    findOneByModuleId
};
