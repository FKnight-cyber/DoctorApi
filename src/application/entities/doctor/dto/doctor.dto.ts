import Joi from 'joi';

export const DoctorSchema = Joi.object({
  name: Joi.string().max(120).required(),
  crm: Joi.string().regex(/^\d+$/).max(7).required(),
  telefoneFixo: Joi.string().regex(/^\d+$/).required(),
  telefoneCelular: Joi.string().regex(/^\d+$/).required(),
  cep: Joi.string().regex(/^\d+$/).required(),
  specialties: Joi.array().items(Joi.number()).min(2).required(),
}).options({
  abortEarly: false,
  allowUnknown: true
});