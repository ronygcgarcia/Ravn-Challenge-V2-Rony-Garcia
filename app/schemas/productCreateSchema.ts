import Joi from "joi";

const productCreateSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string()
        .required(),
    price: Joi.number()
        .required(),
    quantity: Joi.number()
        .required(),
    category_id: Joi.number()
        .required(),
});

export default productCreateSchema;