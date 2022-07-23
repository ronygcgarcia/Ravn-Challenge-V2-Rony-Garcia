import BaseError from './BaseError';
import HttpCode from '../configs/httpCode';

export default class BadRequestException extends BaseError {
    constructor(
        description = 'Invalid values',
    ) {
        super('BAD_REQUEST', HttpCode.HTTP_BAD_REQUEST, description);
    }
}
