import * as Joi from 'joi';

import { Service } from '../../tokens';
import { Config } from '../model';

export const configProvider = {

    provide: Service.CONFIG,
    useFactory: (): Config => {
        const env = process.env;
        const validationSchema = Joi.object<Config>().unknown().keys({
            API_PORT: Joi.number().required(),
            API_PREFIX: Joi.string().required(),
            SWAGGER_ENABLE: Joi.number().required(),
            JWT_SECRET: Joi.string().required(),
            JWT_ISSUER: Joi.string().required(),
            HEALTH_TOKEN: Joi.string().required(),
            PASSENGERS_ALLOWED: Joi.string().valid('yes', 'no').required(),
            REDIS_HOST: Joi.string().required(),
            REDIS_PORT: Joi.number().required()
        });
        const result = validationSchema.validate(env);
        if (result.error) {
            throw new Error(`Configuration not valid: ${result.error.message}`);
        }

        return result.value;
    }

};
