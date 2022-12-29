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
        const profileCollection = client.db('socialMedia').collection('profiles');


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

        // post user profile to the database
        app.post('/profiles', async (req, res) => {
            const user = req.body;
            // console.log(user);
            const result = await profileCollection.insertOne(user);
            res.send(result);

        });

        // get user profile data from database
        app.get('/profiles/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const profile = await profileCollection.findOne(query);
            res.send(profile);
        });


        // update profile
        app.put('/profiles/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const filter = { _id: ObjectId(id) };
            const profile = req.body;
            // console.log(profile);
            const option = { upsert: true };
            const updatedProfile = {
                $set: {
                    name: profile.name,
                    email: profile.email,
                    university: profile.university,
                    address: profile.address
                }
            }
            const result = await profileCollection.updateOne(filter, updatedProfile, option);
            res.send(result);

        });

        app.get('/posts', async (req, res) => {
            const query = {};
            const posts = await postCollection.find(query).toArray();
            res.send(posts);
        });




        app.get('/comments', async (req, res) => {
            let query = {};
            if (req.query.showDetailsId) {
                query = {
                    showDetailsId: req.query.showDetailsId
                }
            }
            const cursor = commentCollection.find(query).sort({ "_id": -1 })
            const comments = await cursor.toArray();
            res.send(comments)
        })

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