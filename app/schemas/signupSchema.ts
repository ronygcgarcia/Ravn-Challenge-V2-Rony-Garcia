import Joi from "joi";

const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&-_.:])([A-Za-z$@$!%*?&]|[^ ]){8,20}$';
const signupSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: Joi.string()
        .pattern(new RegExp(passwordPattern)),
    confirm_password: Joi.ref('password'),
})
    .with('password', 'confirm_password');

export default signupSchema;