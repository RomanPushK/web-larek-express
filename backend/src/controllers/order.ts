import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import { IOrder, orderSchema } from '../validation/order';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const checkOrder = async (order: object) => {
  const { error, value } = orderSchema.validate(order);
  if (error) return { error: true, total: 0, type: 'Неверный формат заказа' };

  const validOrder = value as IOrder;
  const items = new Map<string, number>();
  validOrder.items.forEach((item) => {
    items.set(item, (items.get(item) || 0) + 1);
  });

  let products;

  try {
    products = await Product.find({
      _id: { $in: Array.from(items.keys()) },
    });
  } catch (err) {
    return {
      error: true,
      total: 0,
      type: 'Некорректный идентификатор товара',
    };
  }

  if (products.length !== items.size) return { error: true, total: 0, type: 'Выбранный товар не существует' };

  let hasError = false;
  let total = 0;

  products.forEach((product) => {
    if (product.price === null) {
      hasError = true;
      return;
    }

    total += product.price * (items.get(String(product._id)) || 0);
  });

  if (hasError) {
    return {
      error: true,
      total: 0,
      type: 'Выбранный товар недоступен для покупки',
    };
  }
  if (total !== validOrder.total) return { error: true, total, type: 'Цена товаров неверная' };
  return { error: false, total, type: '' };
};

export default async (req: Request, res: Response, next: NextFunction) => {
  const order = req.body;
  try {
    const { error, total, type } = await checkOrder(order);

    if (error) {
      return next(new BadRequestError(type));
    }

    return res.status(200).json({
      id: faker.string.uuid(),
      total,
    });
  } catch (error) {
    return next(error);
  }
};
