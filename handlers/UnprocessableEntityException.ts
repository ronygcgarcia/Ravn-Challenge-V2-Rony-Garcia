import BaseError from './BaseError';
import HttpCode from '../configs/httpCode';

export default class UnprocessableEntityException extends BaseError {
    constructor(description = 'Unprocessable Entity') {
        super('UNPROCESSABLE_ENTITY', HttpCode.HTTP_UNPROCESSABLE_ENTITY, description);
    }
}
