import { FastifyInstance } from "fastify";
import { todoController } from "../controller/index";
import { isAuthenticated } from "../middleware/authMiddleware";
// Schema for creating a new todo item
const createTodoSchema = {
  body: {
    type: "object",
    required: ["title", "uid", "fid"], // Assuming these are the required fields
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      fid: { type: "number" },
      due_date: { type: "string", format: "date-time" },
      is_completed: { type: "boolean" },
      is_pinned: { type: "boolean" },
      tags: { type: "string" },
    },
  },
};
const fetchTodoSchema = {
  querystring: {
    type: "object",
    properties: {
      is_pinned: { type: "number" }, // Example query parameter
      is_completed: { type: "number" }, // Example query parameter
      color: { type: "string" }, // Another query parameter
    },
  },
};
export default async function (app: FastifyInstance) {
  app.post(
    "/insert",
    {
      schema: createTodoSchema,
      preHandler: isAuthenticated,
    },
    todoController.insert
  );
  app.get(
    "/fetchAll",
    { schema: fetchTodoSchema, preHandler: isAuthenticated },
    todoController.fetch
  );
  app.get("/folder", { preHandler: isAuthenticated }, todoController.folder);
}
