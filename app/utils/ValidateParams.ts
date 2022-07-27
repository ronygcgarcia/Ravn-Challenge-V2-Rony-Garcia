import UnprocessableEntityException from "../../handlers/UnprocessableEntityException";

export default class ValidateParams {
    static isValid(id: string, message = 'Unprocessable Entity by text') {
        if (!(/^\d+$/.test(String(id)) && Number(id) > 0)) {
            throw new UnprocessableEntityException(
                message,
            );
        }
        return Number.parseInt(id, 10);
    }
}