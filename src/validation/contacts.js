import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.number(),
  email: Joi.string().email().min(3).max(20).required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid('work', 'home', 'personal')
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.number(),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),
});
