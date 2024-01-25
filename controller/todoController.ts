import { FastifyReply, FastifyRequest } from "fastify";
import { todo } from "../models";
import { Todos } from "../database/db";
interface InsertRequestBody {
  uid: number;
  fid: number;
  title: string;
  description: string;
  is_completed: number;
  is_pinned: number;
  due_date: Date;
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
  const is_completed: any = req.params;
  const is_pinned: any = req.params;
  if (is_completed) {
    const todos = await todo.filterCompleted(is_completed);
    if (!todos) {
      return reply.status(404).send({ message: "Not found" });
    } else {
      return reply.status(200).send({ success: true, todos: todos });
    }
  }
  if (is_pinned) {
    const todos = await todo.filterPinned(is_pinned);
    if (!todos) {
      return reply.status(404).send({ message: "Not found" });
    } else {
      return reply.status(200).send({ success: true, todos: todos });
    }
  } else {
    const todos = await todo.fetchAll();
    if (!todos) {
      return reply.status(404).send({ message: "Not found" });
    } else {
      return reply.status(200).send({ success: true, todos: todos });
    }
  }
};
