/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { teaching_groupService } from '~/services/Module/teaching_groupService'

const createNew = async (req, res, next) => {
    try {
        const createdTeaching_group = await teaching_groupService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdTeaching_group)
    } catch (error) { next(error) }
}


const getAllTeaching_groups = async (req, res, next) => {
    try {
        const allTeaching_groups = await teaching_groupService.getAllTeaching_groups();
        res.status(StatusCodes.OK).json(allTeaching_groups);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const teaching_groupId = req.params.id
        const teaching_group = await teaching_groupService.getDetails(teaching_groupId)
        res.status(StatusCodes.OK).json(teaching_group)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const teaching_groupId = req.params.id;
        const updatedTeaching_group = await teaching_groupService.update(teaching_groupId, req.body);

        res.status(StatusCodes.OK).json(updatedTeaching_group);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const teaching_groupId = req.params.id
        const result = await teaching_groupService.deleteItem(teaching_groupId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export const teaching_groupController = {
    createNew,
    getDetails,
    getAllTeaching_groups,
    update,
    deleteItem
}