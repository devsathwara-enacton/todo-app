import { FastifyReply, FastifyRequest } from "fastify";
import { user } from "../models";
import { Users } from "../database/db";
import bcrypt from "bcryptjs";
interface RegisterRequestBody {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avtar: string;
  theme: string;
}

export const register = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, firstName, lastName, password, avtar, theme } =
      req.body as RegisterRequestBody;
    let hashPassword = await bcrypt.hash(password, 10);
    let data = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: hashPassword,
      avtar: avtar,
      theme: theme,
      created_at: new Date(),
    };
    const userExist: Users = await user.login(email);
    if (userExist) {
      return reply.status(409).send({ message: "User already exist" });
    } else {
      const result = await user.register(data);
      if (result) {
        return reply
          .status(200)
          .send({ success: true, message: "Register Successful" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = req.body as RegisterRequestBody;
    const userExist = await user.login(email);
    if (userExist) {
      const validPassword = await bcrypt.compare(
        password,
        userExist.password.toString()
      );
      if (!validPassword) {
        return reply.status(203).send({
          success: false,
          token: null,
          message: "Wrong Password",
        });
      } else {
        req.session.set("email", email);
        req.session.set("uid", userExist.id);
        return reply.status(200).send({ message: "Logged In" });
      }
    } else {
      return reply.status(409).send({
        success: true,
        message: "User doesn't exist please register!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export const logout = async (req: FastifyRequest, reply: FastifyReply) => {
  req.session.delete();
  reply.send("logged out");
};
