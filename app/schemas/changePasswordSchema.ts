import Joi from "joi";

const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&-_.:])([A-Za-z$@$!%*?&]|[^ ]){8,20}$';
const changePasswordSchema: Joi.ObjectSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp(passwordPattern)),
    confirm_password: Joi.ref('password'),
});

export default changePasswordSchema;