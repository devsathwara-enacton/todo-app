import app from "./app";
import { config } from "./config/config";

const logger = app.log;
app.ready((err) => {
  if (err) throw err;

  // Now you can safely call app.swagger()
  app.swagger();

  // Start listening for requests
  app.listen({ port: config.env.app.port }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server running on ${address}`);
  });
});
