import jwt from 'jsonwebtoken';
import { envClient } from '../config/env.config.js';
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, envClient.jwt.accessTokenSecretKey, {
        expiresIn: envClient.jwt.accessTokenExpiresIn / 1000,
    });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, envClient.jwt.refreshTokenSecretKey, {
        expiresIn: envClient.jwt.refreshTokenExpiresIn / 1000,
    });
};
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, envClient.jwt.accessTokenSecretKey);
    }
    catch (error) {
        return null;
    }
};
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, envClient.jwt.refreshTokenSecretKey);
    }
    catch (error) {
        return null;
    }
};
