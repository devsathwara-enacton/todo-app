import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from '@fastify/passport'
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
      callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      console.log(email, googleId);
    }
  )
);

// Serialize user into the session
// register a serializer that stores the user object's id in the session ...
fastifyPassport.registerUserSerializer(
  async (user, request) => {
    const { id, displayName }:any = user
    const userForSession = { id, displayName }
    return userForSession
  }
)

// ... and then a deserializer that will fetch that user from the database when a request with an id in the session arrives
fastifyPassport.registerUserDeserializer(async (userFromSession, request) => {
  return userFromSession
})


// // Protect routes using fastify-passport.isAuthenticated
// fastify.decorate("authenticate", fastifyPassport.authenticate);

app.register(fastifyPassport.initialize());
app.register(fastifyPassport.secureSession());
app.register(import("./routes/userRoutes"), { prefix: "/api/user" });
app.register(import("./routes/todoRoutes"), { prefix: "/api/todo" });
app.get('/',
  {
    preValidation: (req, res, done) => { 
      if (!req.user) {
        res.redirect('/login')
      }
      done()
    }
  },
  async (req:FastifyRequest, res:FastifyReply) => {
      res.send(`Hello ${req}!`)
  }
)
app.get(
  '/login',
  {
    preValidation: fastifyPassport.authenticate('google', { scope: [ 'profile', 'email'] })
  },
  async () => {
    console.log('GOOGLE API forward')
  }
)
app.get(
  '/auth/google/callback',
  {
    preValidation: fastifyPassport.authenticate('google', { scope: [ 'profile', 'email']})
  },
  function (req:FastifyRequest, res:FastifyReply) {
    res.redirect('/');
  }
)
export default app;
