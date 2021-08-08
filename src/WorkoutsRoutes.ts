import { Response, Request } from 'express';
import { ObjectId, MongoClient, MongoError, Collection } from 'mongodb'
import { url } from './ConfigStuff'

const getCollection = (client: MongoClient) => client.db("testdb").collection('testCollection')
 
export async function onGet(req: Request, res: Response) {

	const collection = await MongoClient.connect(url).then(client => getCollection(client))
	const filter = {username: req.params.username}
	const documents = await collection.find(filter).toArray()
	res.send(documents)
}

export async function onPut(req: Request, res: Response) {

	const collection = await MongoClient.connect(url).then((client) => getCollection(client))
	const {_id, ...workout} = req.body.workout

	await collection.updateOne(
		{ _id: new ObjectId(_id)},	
		{ $set: workout },
		{ upsert: true }
	)

	const documents = await collection.find({username: req.params.username}).toArray()
	res.send(documents)
}

export async function onDelete(req: Request, res: Response) {

	const collection = await MongoClient.connect(url).then((client) => getCollection(client))
	await collection.deleteOne({ _id: new ObjectId(req.params.id)})
	const documents = await collection.find({username: req.params.username}).toArray()
	res.send(documents)
}

