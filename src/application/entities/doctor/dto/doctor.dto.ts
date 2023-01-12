import Joi from 'joi';

export const DoctorSchema = Joi.object({
  name: Joi.string().max(120).required(),
  crm: Joi.string().regex(/^\d+$/).max(7).required(),
  telefoneFixo: Joi.string().regex(/^\d+$/).required(),
  telefoneCelular: Joi.string().regex(/^\d+$/).required(),
  cep: Joi.string().regex(/^\d+$/).max(8).required(),
  specialties: Joi.array().items(Joi.number().min(1).max(8)).min(2).required(),
}).options({
  abortEarly: false,
  allowUnknown: true
});

export const UpdateSchema = Joi.object({
  name: Joi.string().max(120),
  crm: Joi.string().regex(/^\d+$/).max(7),
  telefoneFixo: Joi.string().regex(/^\d+$/),
  telefoneCelular: Joi.string().regex(/^\d+$/),
  cep: Joi.string().regex(/^\d+$/).max(8),
  specialties: Joi.array().items(Joi.number().min(1).max(8)).min(2),
}).options({
  abortEarly: false,
  allowUnknown: true
});