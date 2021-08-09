import { Response, Request } from 'express';
import { ObjectId, MongoClient, MongoError, Collection } from 'mongodb'
import { url } from './ConfigStuff'

const getCollection = () => MongoClient.connect(url).then(client => client.db("testdb").collection('testCollection'))
 
export async function onGet(req: Request, res: Response) {

	const filter = {username: req.params.username}

	const collection = await getCollection()
	const documents = await collection.find(filter).toArray()

	res.send(documents)
}

export async function onPut(req: Request, res: Response) {

	const {_id, ...workout} = req.body.workout
	const updateFilter = { _id: new ObjectId(_id)}
	const updateData = { $set: workout }
	const updateOptions = { upsert: true }

	const collection = await getCollection()
	await collection.updateOne(updateFilter, updateData, updateOptions)
	const documents = await collection.find({username: req.body.workout.username}).toArray()

	res.send(documents)
}

export async function onDelete(req: Request, res: Response) {

	const deleteFilter = { _id: new ObjectId(req.params.id)}
	const filter = {username: req.params.username}
	
	const collection = await getCollection()
	await collection.deleteOne(deleteFilter)
		
	res.send(await collection.find(filter).toArray())
}

