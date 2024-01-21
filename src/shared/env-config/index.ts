import * as Joi from 'joi';

export const envSchema = Joi.object({
  PORT: Joi.number().required(),
  DB_URL: Joi.string().required(),
});
