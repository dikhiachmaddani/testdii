import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
export const envClientSchemaObj = {
    port: z.coerce.number().min(1).max(65535).default(3000),
    nodeEnv: z.enum(["development", "production", "test"]).default("development"),
    jwt: z.object({
        accessTokenSecretKey: z.string().default("secret"),
        refreshTokenSecretKey: z.string().default("secret"),
        accessTokenExpiresIn: z.coerce.number().default(3600000), // 1 hour
        refreshTokenExpiresIn: z.coerce.number().default(2592000000), // 30 days
    }),
};
export const envClientCollectionObj = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    jwt: {
        accessTokenSecretKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
        refreshTokenSecretKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
        accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    },
};
export const envClientSchema = z.object(envClientSchemaObj);
export const envClient = envClientSchema.parse(envClientCollectionObj);
