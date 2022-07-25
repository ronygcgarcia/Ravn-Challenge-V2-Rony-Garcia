import Joi from "joi";

const recoveryPasswordEmailSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
});

export default recoveryPasswordEmailSchema;