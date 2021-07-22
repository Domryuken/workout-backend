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
            client.db("testdb").collection('testCollection').findOne({}, 
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
            
            const filter = { username: req.body.username };
            const update = { $push: { workouts: req.body.workout }};
            client.db("testdb").collection("testCollection").updateOne(
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
    MongoClient.connect(
        url,
        (err, client) => {
            if (err) throw err;
            if (!client) throw "No database...?"
            
            const filter = { workout: req.body.workout}; //fix this
            client.db("testdb").collection("testCollection").deleteOne(
                filter,
                (err, res) => {
                    if (err) throw err;
                    console.log("1 document updated");
                    client.close();
                }
            );
        }
    );
}

export const workoutRoutes = (app: Application) => {
    app.route(`/workouts`)
        .all(onAll)
        .get(onGet)
        .put(onPut)
        .delete(onDelete);   
}
