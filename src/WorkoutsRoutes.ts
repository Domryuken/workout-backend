import { NextFunction, Application, Response, Request } from 'express';
import { ObjectId, MongoClient, MongoError } from 'mongodb'
import { url } from './ConfigStuff'

export const onGet = (req: Request, res: Response) => {

    MongoClient.connect(
        url,
        (err, client) => {
            if (err) throw err
            if (!client) throw "No database...?"

            const filter = { username: req.params.username}
            console.log(filter)
            
            client.db("testdb").collection('testCollection').find(filter).toArray( 
                (err, result) => {
                    if (err) throw err
                    if (!result) throw "No result...?"
                    res.send(result);
                }
            );
        }
    );
}

export const onPut = (req: Request, res: Response) => {

    MongoClient.connect(
        url,
        (err, client) => {
            if (err) throw err;
            if (!client) throw "No database...?"
            
            const {_id, ...workout} = req.body.workout
            const filter = { _id: new ObjectId(_id)}
            const update = { $set: workout }
            const options = { upsert: true }

            client.db("testdb").collection("testCollection").updateOne(
                filter,
                update,
                options,
                (err, result) => {
                    if (err) throw err;
                    client.close();
                    res.send(result?.acknowledged)
                }
            );
        }
    );
}

export const onDelete = (req: Request, res: Response) => {

    MongoClient.connect(
        url,
        (err, client) => {
            if (err) throw err;
            if (!client) throw "No database...?"
 
            const filter = { _id: new ObjectId(req.params.id)}
            console.log(filter)

            client.db("testdb").collection("testCollection").deleteOne(
                filter,
                (err, result) => {
                    if (err) throw err;
                    client.close();
                    res.send(result?.acknowledged)
                }
            );
        }
    );
}

