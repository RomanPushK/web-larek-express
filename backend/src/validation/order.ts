import Joi from "joi";

export type IOrder = {
  items: string[];
  total: number;
  payment: string;
  email: string;
  phone: string;
  address: string;
}

export const orderSchema = Joi.object({
  items: Joi.array().items(Joi.string()).min(1).required(),
  total: Joi.number().required(),
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required()
});