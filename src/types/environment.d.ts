export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_PORT: number;
            DB_USER: string;
            PORT: number;
            USER_SECRET: string;
            ENV: 'test' | 'dev' | 'prod';
        }
    }
}

declare module "express-session" {
    interface Session {
        passport: {
            user: any;
        };
    }
}