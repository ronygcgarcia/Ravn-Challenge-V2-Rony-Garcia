import Joi from "joi";

const reactionAddSchema: Joi.ObjectSchema = Joi.object({
    reactionTypeId: Joi.number()
        .required()
});

export default reactionAddSchema;