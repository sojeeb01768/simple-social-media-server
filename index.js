const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kvqywrf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postCollection = client.db('socialMedia').collection('posts');
        const commentCollection = client.db('socialMedia').collection('comments');


        app.post('/posts', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);

        });
        app.post('/comments', async (req, res) => {
            const comments = req.body;
            const result = await commentCollection.insertOne(comments);
            res.send(result);

        });

        app.get('/posts', async (req, res) => {
            const query = {};
            const posts = await postCollection.find(query).toArray();
            res.send(posts);
        });
        app.get('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const comment = await commentCollection.findOne(query);
            res.send(comment);
        });

        app.get('/showdetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const postResult = await postCollection.findOne(query);
            res.send(postResult);
        })
    }
    finally {

    }

}

run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('socisal media server is running')
})

app.listen(port, () => {
    console.log(`docial media server is running on port ${port}`);
})