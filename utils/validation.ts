import z from "zod";

export const todosSchema = z.object({
  fid: z.number().int(),
  title: z.string().max(255),
  description: z.string().max(255), // Adjust as needed
  is_completed: z.boolean(),
  is_pinned: z.boolean(),
  due_date: z.string().max(255), // Adjust as needed
});
