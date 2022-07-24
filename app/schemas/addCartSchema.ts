import Joi from "joi";

const addCartSchema: Joi.ObjectSchema = Joi.object({
    product_id: Joi.number()
        .required(),
});

export default addCartSchema;