import express, { json, Application } from 'express';
import { Server, createServer } from "http"
import cors from 'cors';
import * as workoutRoutes from './WorkoutsRoutes';

const app: Application = express();
const server: Server = createServer(app);
const port = 5000;

app.use(json());
app.use(cors());

app.route(`/workouts/:username/`)
    .get(workoutRoutes.onGet)
    
app.route(`/workouts/update/`)
    .put(workoutRoutes.onPut)

app.route(`/workouts/delete/:id/`)
    .delete(workoutRoutes.onDelete);

server.listen(port, () => {
    console.log("Running");
});