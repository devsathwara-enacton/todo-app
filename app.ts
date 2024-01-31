import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from "@fastify/passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";
const app: FastifyInstance = fastify({ logger: true });
const swaggerOptions = {
  swagger: {
    info: {
      title: "Todo Api",
      description: "My Description.",
      version: "1.0.0",
    },
    host: "127.0.0.1:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{ name: "Default", description: "Default" }],
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);
app.register(cors);

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
fastifyPassport.use(
  new GitHubStrategy(
    {
      clientID: "b67901070b3e70464486",
      clientSecret: "8921abc2251f0cd09b11da4f3c36426737ce8b88",
      callbackURL: "http://127.0.0.1:3000/auth/github/callback",
    },
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
      console.log(profile, accessToken);
      done(null, profile);
    }
  )
);

fastifyPassport.use(
  new GoogleStrategy(
    {
      clientID:
        "480901636612-j1p0rfq5lppofflh00fs607s6mrm8p7t.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      console.log(profile, accessToken, refreshToken);
      return done(null, profile);
    }
  )
);

// Serialize user into the session
// register a serializer that stores the user object's id in the session ...
fastifyPassport.registerUserSerializer(async (user, request) => {
  const { id, displayName, username }: any = user;
  const userForSession = { id, displayName, username };
  return userForSession;
});

// ... and then a deserializer that will fetch that user from the database when a request with an id in the session arrives
fastifyPassport.registerUserDeserializer(async (userFromSession, request) => {
  return userFromSession;
});

// // Protect routes using fastify-passport.isAuthenticated
// fastify.decorate("authenticate", fastifyPassport.authenticate);

app.register(fastifyPassport.initialize());
app.register(fastifyPassport.secureSession());
app.register(import("./routes/userRoutes"), { prefix: "/api/user" });
app.register(import("./routes/todoRoutes"), { prefix: "/api/todo" });

app.setErrorHandler((error, request, reply) => {
  console.log(error.toString());
  reply.status(Number(error.statusCode)).send({ error: error.toString });
});

app.get(
  "/",
  {
    preValidation: (req, res, done) => {
      if (!req.user) {
        res.redirect("/");
      }
      done();
    },
  },
  async (req: FastifyRequest, res: FastifyReply) => {
    res.send(`Hello ${req}!`);
  }
);
app.get(
  "/login",
  {
    preValidation: fastifyPassport.authenticate("google", {
      scope: ["profile", "email"],
    }),
  },
  async () => {
    console.log("GOOGLE API forward");
  }
);
app.get(
  "/auth/google/callback",
  {
    preValidation: fastifyPassport.authenticate("google", {
      scope: ["profile", "email"],
      failureRedirect: "/",
    }),
  },
  (req: FastifyRequest, reply: FastifyReply) => {
    reply.redirect("/home");
  }
);
app.get("/home", (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.user;
  if (!user) {
    reply.redirect("/login");
  }
  reply.send(user);
});
app.get("/logout", (req: FastifyRequest, reply: FastifyReply) => {
  req.session.delete();
  req.logout();
  reply.redirect("/");
});

app.get(
  "/login/github",
  {
    preValidation: fastifyPassport.authenticate("github", {
      scope: ["profile", "email"],
    }),
  },
  async () => {
    console.log("Github API forward");
  }
);

// GitHub OAuth route
app.get("/auth/github", fastifyPassport.authenticate("github"));

app.get(
  "/auth/github/callback",
  {
    preValidation: fastifyPassport.authenticate("github", {
      failureRedirect: "/",
    }),
  },
  (req: FastifyRequest, reply: FastifyReply) => {
    reply.redirect("/home");
  }
);

export default app;
