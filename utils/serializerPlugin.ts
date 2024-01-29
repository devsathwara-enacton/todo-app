// dateSerializerPlugin.ts
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { serializeDate } from "./serializer";

const dateSerializerPlugin = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  next: () => void
) => {
  fastify.addHook("onRequest", (request, reply, done) => {
    // Register the date serializer for the entire application
    reply.serializer(serializeDate);
    done();
  });

  next();
};

export default dateSerializerPlugin;
