import fastify, { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
const app: FastifyInstance = fastify({ logger: true });
app.register(fastifyCookie);
app.register(fastifySecureSession, {
  secret: "averylogphrasebiggerthanthirtytwochars",
  salt: "mq9hDxBVDbspDR6n",
  sessionName: "session",
  cookieName: "email",
  cookie: {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 3600000),
  },
});
app.register(import("./routes/userRoutes"), { prefix: "/api/user" });
app.register(import("./routes/todoRoutes"), { prefix: "/api/todo" });

export default app;
