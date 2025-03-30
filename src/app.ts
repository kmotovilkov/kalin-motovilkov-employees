import "reflect-metadata";
import express from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import dbConnect from "./config/db";

if (process.env.NODE_ENV !== 'test') {
  dbConnect();
};

useContainer(Container);

const app = express();
app.set('trust proxy', true);
app.use(
  cookieSession({
    signed: false,
    maxAge: 60 * 60 * 1000
  })
);
app.use(json());

useExpressServer(app, {
  controllers: [__dirname + '/controllers/*.{ts,js}'],
  middlewares: [__dirname + '/middlewares/*.{ts,js}'],
  classTransformer: false,
  defaultErrorHandler: false
});

export { app };
