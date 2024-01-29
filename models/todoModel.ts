import { InsertResult, sql } from "kysely";
import { db } from "../database/database";
import { Folders, Todos } from "../database/db";

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
export const fetchAll = async (
  is_completed: number,
  is_pinned: number,
  uid: number
): Promise<Todos[]> => {
  let query = db.selectFrom("todos").selectAll().where("uid", "=", uid);
  if (is_completed !== null && is_completed !== undefined) {
    query = query.where("is_completed", "=", is_completed);
  }
  if (is_pinned !== null && is_pinned !== undefined) {
    query = query.where("is_pinned", "=", is_pinned);
  } else {
    query = query.orderBy("id asc");
  }
  const result: any = await query.execute();
  return result;
};

export const filterColor = async (
  color: string,
  uid: number
): Promise<Todos[]> => {
  const query = db
    .selectFrom("todos")
    .selectAll()
    .innerJoin("folders", "todos.fid", "folders.id")
    .where("folders.color", "=", `${color}`)
    .where("folders.uid", "=", uid)
    .where("todos.uid", "=", uid);
  const result: any = await query.execute();
  return result;
};

export const folder = async (uid: number): Promise<any> => {
  const query = db
    .selectFrom(["todos", "folders"])
    .selectAll()
    .where("folders.uid", "=", uid)
    .where("todos.uid", "=", uid)
    .execute();
  return query;
};
