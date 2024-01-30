import { FastifyReply, FastifyRequest } from "fastify";

export const isAuthenticated = (
  req: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) => {
  let email = req.session.get("email");

  if (!email) {
    return reply.status(401).send({ error: "Not authenticated" });
  } else {
    done();
  }
};
