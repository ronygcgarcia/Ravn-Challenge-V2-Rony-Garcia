import Joi from "joi";

const loginSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: Joi.string()
        .required(),
});

export default loginSchema;