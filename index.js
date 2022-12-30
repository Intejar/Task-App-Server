const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xk69pxb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const taskCollection = client.db('TaskApp').collection('MyTask')
        const addTaskCollection = client.db('TaskApp').collection('AddTask')


        app.get('/task', async (req, res) => {
            let query = {}
            if(req.query.email){
                query = {email: req.query.email, status:'incomplete'}
            }
            // const filter = {status:'incomplete'}
            const data = await taskCollection.find(query).toArray();
            console.log(data)
            res.send(data)
        })

        app.get('/task/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await taskCollection.findOne(query)
            res.send(result)
        })

        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task)
            console.log(result)
            res.send(result)
        })

        app.patch('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            let updatedDoc = {
                $set: {

                }
            }
            if(req.body.status){
                updatedDoc = {
                    $set: {
                        status: req.body.status
                    }
                }
            }
            if(req.body.todo){
                let todo = req.body.todo.todo;
                let checkBox = req.body.todo.check;
                updatedDoc = {
                    $set: {
                        todo: todo,
                        check : checkBox
                    }
                }
            }
            
            const result = await taskCollection.updateOne(query, updatedDoc, options)
            res.send(result)
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/completedTask', async (req, res) => {
            let query = {}
            if(req.query.email){
                query = {email: req.query.email, status:'completed'}
            }
            // const filter = {status:'incomplete'}
            const data = await taskCollection.find(query).toArray();
            console.log(data)
            res.send(data)
        })

        app.patch('/completedTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    comment: req.body.comment
                }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        app.get('/addTask', async (req, res) => {
            let query = {}
            if(req.query.email){
                query = {email: req.query.email}
            }
            
            const data = await addTaskCollection.find(query).toArray();
            console.log(data)
            res.send(data)
        })

        app.post('/addTask', async (req, res) => {
            const task = req.body;
            const result = await addTaskCollection.insertOne(task)
            console.log(result)
            res.send(result)
        })
        
        app.delete('/addTask/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await addTaskCollection.deleteOne(query)
            res.send(result)
        })




        

    }

    finally {

    }

}
run().catch(console.log)



app.get('/', async (req, res) => {
    res.send('task app server is running')
})

app.listen(port, () => console.log(`task server is running on ${port}`))