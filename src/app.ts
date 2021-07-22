import express, { NextFunction, json, Application, Response, Request } from 'express';
import { Server, createServer } from "http"
import cors from 'cors';
import { workoutRoutes } from './WorkoutsRoutes';

const app: Application = express();
const server: Server = createServer(app);
const port = 5000;

app.use(json());
app.use(cors());

workoutRoutes(app);

server.listen(port, () => {
    // our only exception to avoiding console.log(), because we
    // always want to know when the server is done starting up
    console.log("Running");
});