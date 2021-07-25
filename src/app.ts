import express, { json, Application } from 'express';
import { Server, createServer } from "http"
import cors from 'cors';
import * as workoutRoutes from './WorkoutsRoutes';

const app: Application = express();
const server: Server = createServer(app);
const port = 5000;

app.use(json());
app.use(cors());

app.route(`/workouts/:arg`)
    .get(workoutRoutes.onGet)
    .put(workoutRoutes.onPut)
    .delete(workoutRoutes.onDelete);

server.listen(port, () => {
    console.log("Running");
});