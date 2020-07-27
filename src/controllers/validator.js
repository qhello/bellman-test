import Joi from '@hapi/joi'

export default input =>
  Joi.object({
    condoSize: Joi.number().integer().min(1).required(),
    heating: Joi.bool().required(),
    employee: Joi.bool().required(),
    elevator: Joi.bool().required(),
  })
    .required()
    .validate(input)
