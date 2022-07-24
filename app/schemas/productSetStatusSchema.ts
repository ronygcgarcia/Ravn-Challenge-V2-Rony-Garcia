import Joi from "joi";

const productSetStatusSchema: Joi.ObjectSchema = Joi.object({
    active: Joi.bool()
        .required()
});

export default productSetStatusSchema;