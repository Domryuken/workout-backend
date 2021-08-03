import { NextFunction, Application, Response, Request } from 'express';
import { ObjectId, MongoClient, MongoError, Collection } from 'mongodb'
import { url } from './ConfigStuff'

// test thing
const connect: (operation: (collection: Collection<Document>) => any) => void = (operation) => {

    MongoClient.connect(
        url,
        (err, client) => {
            if (err) throw err
            if (!client) throw "No database...?"
            const collection: Collection<Document> = client.db("testdb").collection('testCollection')
            operation(collection)
       }
    );
}

const findAll: (req: Request, res: Response, collection: Collection<Document>) => void =
    (req, res, collection) => {
        const filter = { username: req.params.username}
        console.log(filter)
        collection.find(filter).toArray().then(
            (documents) => res.send(documents)
        );
    }

const upsertOne: (req: Request, res: Response, collection: Collection<Document>) => void =
    (req, res, collection) => {
    
        const {_id, ...workout} = req.body.workout
        const filter = { _id: new ObjectId(_id)}
        const update = { $set: workout }
        const options = { upsert: true }

        collection.updateOne(
            filter,
            update,
            options,
        ).then(() => findAll(req, res, collection));

    } 

const deleteOne: (req: Request, res: Response, collection: Collection<Document>) => void =
    (req, res, collection) => {

        const filter = { _id: new ObjectId(req.params.id)}
        console.log(filter)

        collection.deleteOne(
            filter,
            (err, result) => {
                if (err) throw err;
                res.send(result?.acknowledged)
            }
        );
    } 



export const onGet = (req: Request, res: Response) => {
    connect( (collection: Collection<Document>) => {
        findAll(req, res, collection)
    });
}

export const onPut = (req: Request, res: Response) => {
    connect( (collection: Collection<Document>) => {
        upsertOne(req, res, collection)           
    });
}

export const onDelete = (req: Request, res: Response) => {
    connect( (collection: Collection<Document>) => {
        deleteOne(req, res, collection)
    });
}

