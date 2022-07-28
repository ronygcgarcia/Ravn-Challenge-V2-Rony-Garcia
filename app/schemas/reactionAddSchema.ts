import Joi from "joi";

const reactionAddSchema: Joi.ObjectSchema = Joi.object({
    reaction_type_id: Joi.number()
        .required()
});

export default reactionAddSchema;