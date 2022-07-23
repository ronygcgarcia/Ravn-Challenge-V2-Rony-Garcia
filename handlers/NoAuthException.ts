import BaseError from './BaseError';
import HttpCode from '../configs/httpCode';

export default class NoAuthException extends BaseError {
  constructor(description = 'Unauthorized') {
    super('UNAUTHORIZED', HttpCode.HTTP_UNAUTHORIZED, description);
  }
}
