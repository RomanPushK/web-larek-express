import HttpError from './http-error';

export default class NotFoundError extends HttpError {
  constructor(message = 'Маршрут не найден') {
    super(404, message);
  }
}
