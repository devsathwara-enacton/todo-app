import fastify, { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from "fastify-passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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
fastifyPassport.use(
  new GoogleStrategy(
    {
      clientID:
        "480901636612-j1p0rfq5lppofflh00fs607s6mrm8p7t.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      console.log(email, googleId);
    }
  )
);

// Serialize user into the session
fastifyPassport.serializeUser((user: any, done: any) => {
  done(null, user);
});

// Deserialize user from the session
fastifyPassport.deserializeUser((obj: any, done: any) => {
  done(null, obj);
});
app.register(fastifyPassport.initialize());
app.register(fastifyPassport.secureSession());
app.register(import("./routes/userRoutes"), { prefix: "/api/user" });
app.register(import("./routes/todoRoutes"), { prefix: "/api/todo" });

export default app;
