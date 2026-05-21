const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const express = require('express')
const cors = require('cors')
require("dotenv").config();
const app = express()

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const db = client.db("docappoinment")
        const doctorsCollection = db.collection("doctors")
        const bookingCollection = db.collection("booking")

        app.get('/doctors', async (req, res) => {
            const result = await doctorsCollection.find().sort({ rating: -1 }).toArray()
            res.json(result)
        })
        app.get('/doctors/:id', async (req, res) => {
            const { id } = req.params
            const result = await doctorsCollection.findOne({ _id: new ObjectId(id) })
            res.json(result)
        })
        app.get('/booking/:userId', async (req, res) => {
            const { userId } = req.params
            const result = await bookingCollection.find({ userId: userId }).toArray()
            res.json(result)
        })
        app.patch('/booking/:userId', async (req, res) => {
            const { userId } = req.params
            const updatedAppointment = req.body
            const result = await bookingCollection.updateOne(
                { userId: userId },
                { $set: updatedAppointment }
            ).
                res.json(result)
        })

        app.post('/booking', async (req, res) => {
            const bookingData = req.body;
            const result = await bookingCollection.insertOne(bookingData)
            res.json(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
