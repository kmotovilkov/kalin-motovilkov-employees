import { Service } from "typedi";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import Password from "../utils/password";
import { HttpError } from "routing-controllers";

interface ISessionData {
  jwt?: string;
  [key: string]: any; 
};

@Service()
export default class AuthService {
  async registerUser(email: string, password: string) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new HttpError(400, 'A user with that email address already exists!');
    };

    const user = User.build({ email, password });

    try {
      await user.save();
      return user;
    }
    catch (err) {
      throw new HttpError(500, 'Error connecting to database');
    };
  };

  async loginUser(email: string, password: string, session: ISessionData) {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new HttpError(400, 'Invalid credentials!');
    };

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) {
      throw new HttpError(400, 'Invalid credentials!');
    };

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email
      },
      process.env.JWT_KEY!,
      {
        expiresIn: '1h'
      });

    session.jwt = userJwt;

    return existingUser;
  };
};