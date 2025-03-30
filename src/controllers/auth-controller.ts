import { Request, Response } from "express";
import { JsonController, Post, Body, Req, UseBefore, Res } from "routing-controllers";
import { Container, Service } from "typedi";
import { body } from "express-validator";
import AuthService from "../services/auth-service";
import { validateRequest } from "../middlewares/validate-request";

@Service()
@JsonController()
export default class AuthController {
  private authService = Container.get(AuthService);

  @Post('/register')
  @UseBefore(
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email must be valid!'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters!'),
    validateRequest
  )
  async registerUser(@Body() userData: { email: string; password: string }, @Res() res: Response) {
    const { email, password } = userData;
    const user = await this.authService.registerUser(email, password);
    return res.status(201).json(user);
  };

  @Post('/login')
  @UseBefore(
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email must be valid!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password!'),
    validateRequest
  )
  async loginUser(@Body() userData: { email: string; password: string }, @Req() req: Request, @Res() res: Response) {
    if (req.session?.jwt) {
      return res.status(200).json({ message: 'You are already logged in' });
    };

    const { email, password } = userData;

    const user = await this.authService.loginUser(email, password, req.session!);
    return res.status(200).json(user);
  };

  @Post('/logout')
  async logoutUser(@Req() req: Request, @Res() res: Response) {
    req.session = null;
    return res.status(200).json({ message: 'Logged out successfully' });
  };
};