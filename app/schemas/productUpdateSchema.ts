import Joi from "joi";

const productUpdateSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string(),
    price: Joi.number(),
    quantity: Joi.number(),
    category_id: Joi.number(),
});

export default productUpdateSchema;