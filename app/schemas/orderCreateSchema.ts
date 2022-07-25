import Joi from "joi";

const orderCreateSchema: Joi.ObjectSchema = Joi.object({
    address: Joi.string()
        .required(),
        phone: Joi.string()
        .required(),
});

export default orderCreateSchema;