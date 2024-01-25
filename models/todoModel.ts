import { InsertResult, sql } from "kysely";
import { db } from "../database/database";
import { Todos } from "../database/db";

export const insert = async (data: any): Promise<InsertResult> => {
  const result: any = await db.insertInto("todos").values(data).execute();
  return result;
};

export const fetch = async (id: number): Promise<Todos> => {
  const result: any = await db
    .selectFrom("todos")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
  return result;
};
export const remove = async (id: number): Promise<Todos> => {
  const result: any = await db
    .deleteFrom("todos")
    .where("id", "=", id)
    .execute();
  return result;
};
export const fetchAll = async (): Promise<Todos> => {
  const result: any = await db.selectFrom("todos").selectAll().execute();
  return result;
};
export const filterCompleted = async (completed: number): Promise<Todos> => {
  const result: any = await db
    .selectFrom("todos")
    .selectAll()
    .where("is_completed", "=", completed)
    .execute();
  return result;
};
export const filterPinned = async (pinned: number): Promise<Todos> => {
  const result: any = await db
    .selectFrom("todos")
    .selectAll()
    .where("is_pinned", "=", pinned)
    .execute();
  return result;
};
export const filterColor = async (color: string): Promise<Todos> => {
  const result: any = sql<any>`
  SELECT t2.*
FROM todos t2
JOIN folders t1 ON t2.fid = t1.id
WHERE t1.color = ${color};`.execute(db);
  return result;
};
