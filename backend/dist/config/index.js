import 'dotenv/config';
export const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_123',
    databaseUrl: process.env.DATABASE_URL,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
    logLevel: process.env.LOG_LEVEL || 'debug',
};
//# sourceMappingURL=index.js.map