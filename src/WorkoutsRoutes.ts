import { NextFunction, Application, Response, Request } from 'express';
import { MongoClient, MongoError } from 'mongodb'
import { url } from './ConfigStuff'

const onAll = (req: Request, res: Response, next: NextFunction) => {
    next();
}

const onGet = (req: Request, res: Response) => {

    MongoClient.connect(
        url,
        (err, client) => {
            if (err) throw err
            if (!client) throw "No database...?"
            const db = client.db("testdb");

            db.collection('testCollection').findOne({}, 
                (err, result) => {
                    if (err) throw err
                    if (!result) throw "No result...?"
                    res.send(result.workouts);
                }
            );
        }
    );
}

const onPut = (req: Request, res: Response) => {

    MongoClient.connect(
        url,
        (err, client) => {
            if (err) throw err;
            if (!client) throw "No database...?"
            const db = client.db("testdb");
            
            const filter = { username: req.body.username };
            const update = { $push: { workouts: req.body.workout }};
        
            db.collection("testCollection").updateOne(
                filter,
                update,
                (err, res) => {
                    if (err) throw err;
                    console.log("1 document updated");
                    client.close();
                }
            );
        }
    );
}

const onDelete = (req: Request, res: Response) => {
    res.status(200).send(`DELETE requested for id ${req.params.userId}`);
}

export const workoutRoutes = (app: Application) => {
    app.route(`/workouts`)
        .all(onAll)
        .get(onGet)
        .put(onPut)
        .delete(onDelete);   
}
