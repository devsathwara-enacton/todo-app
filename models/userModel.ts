import { InsertResult } from "kysely";
import { db } from "../database/database";
import { Users } from "../database/db";
export const register = async (data: any): Promise<InsertResult> => {
  const result: InsertResult = await db
    .insertInto("users")
    .values(data)
    .executeTakeFirst();
  return result;
};

export const login = async (email: string): Promise<Users> => {
  const user: any = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", `${email}`)
    .executeTakeFirst();
  return user;
};
