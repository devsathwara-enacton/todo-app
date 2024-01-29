import { FastifyReply, FastifyRequest } from "fastify";
import { todo } from "../models";
import { Todos } from "../database/db";
import { serializeBoolean, serializeDate } from "../utils/serializer";
interface InsertRequestBody {
  uid: number;
  fid: number;
  title: string;
  description: string;
  is_completed: number;
  is_pinned: number;
  due_date: string;
}
export const insert = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const uid = req.session.get("uid");
  const { fid, title, description, is_completed, is_pinned, due_date } =
    req.body as InsertRequestBody;
  let data: InsertRequestBody = {
    uid: uid,
    fid: fid,
    title: title,
    description: description,
    is_completed: is_completed,
    is_pinned: is_pinned,
    due_date: due_date,
  };
  const insert = await todo.insert(data);
  if (!insert) {
    reply.status(409).send({ status: "error", message: "Failed to add todo" });
  } else {
    reply.status(201).send({
      status: "success",
      success: true,
      message: "Inserted Successfully",
    });
  }
};
export const fetch = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const { is_completed, is_pinned, color }: any = req.query;
  const uid = req.session.get("uid");
  if (color !== null && color !== undefined) {
    const todos = await todo.filterColor(color, uid);
    if (!todos) {
      return reply.status(404).send({ message: "Not found" });
    } else {
      return reply.status(200).send({
        success: true,
        todos: todos.map((todo) => ({
          ...todo,
          is_completed: serializeBoolean(Number(todo.is_completed)),
          is_pinned: serializeBoolean(Number(todo.is_pinned)),
        })),
      });
    }
  } else {
    const todos = await todo.fetchAll(is_completed, is_pinned, uid);
    if (!todos) {
      return reply.status(404).send({ message: "Not found" });
    } else {
      return reply.status(200).send({
        success: true,
        todos: todos.map((todo) => ({
          ...todo,
          is_completed: serializeBoolean(Number(todo.is_completed)),
          is_pinned: serializeBoolean(Number(todo.is_pinned)),
        })),
      });
    }
  }
};
export const folder = async (req: FastifyRequest, reply: FastifyReply) => {
  const uid = req.session.get("uid");
  const result = await todo.folder(uid);
  if (!result) {
    return reply.status(500).send({ message: "Not Found Please make Folders" });
  } else {
    return reply.status(200).send({
      folders: result.map((todo: any) => ({
        ...todo,
        is_completed: serializeBoolean(Number(todo.is_completed)),
        is_pinned: serializeBoolean(Number(todo.is_pinned)),
        due_date: serializeDate(todo.due_date),
        completed_at: serializeDate(todo.completed_at),
        created_at: serializeDate(todo.created_at),
        updated_at: serializeDate(todo.updated_at),
      })),
    });
  }
};
