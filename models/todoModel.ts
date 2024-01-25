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
export const fetchAll = async (
  is_completed: number | null,
  is_pinned: number | null
): Promise<Todos> => {
  const result: any = sql<any>`SELECT *
  FROM todos
  WHERE 
    (is_completed IS NOT NULL OR is_pinned IS NOT NULL)
    AND (${
      is_completed !== undefined
        ? sql`\`is_completed\` = ${is_completed}`
        : sql`1`
    })
    AND (${
      is_pinned !== undefined ? sql`\`is_pinned\` = ${is_pinned}` : sql`1`
    })
  ORDER BY id; -- Adjust your ordering condition as needed
  `.execute(db);
  console.log(result);
  return result;
};
export const filterCompleted = async (completed: number): Promise<Todos> => {
  console.log(completed);
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
