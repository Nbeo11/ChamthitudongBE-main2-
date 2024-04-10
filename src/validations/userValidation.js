// validation.js
import Joi from 'joi';

export const loginValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});
