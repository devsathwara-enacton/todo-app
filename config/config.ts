import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: {
    app: {
      port: Number(process.env.PORT),
    },
    database: {
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT),
    },
  },
};
