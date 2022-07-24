import Joi from "joi";

const removeCartSchema: Joi.ObjectSchema = Joi.object({
    product_id: Joi.number()
        .required()
});

export default removeCartSchema;