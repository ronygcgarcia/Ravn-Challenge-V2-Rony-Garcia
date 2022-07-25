import BaseError from './BaseError';
import HttpCode from '../configs/httpCode';

export default class ForbiddenException extends BaseError {
    constructor(
        description = 'Denied access',
    ) {
        super('FORBIDDEN', HttpCode.HTTP_FORBIDDEN, description);
    }
}
