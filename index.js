const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

// MiddleWare

app.use(cors());
app.use(express.json())

app.get('/', (req, res) =>{
    res.send("Find your College")
});



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ml6ryd.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const collegeCollection = client.db("collegeducateDB").collection("colleges");
    const candidateCollection = client.db("collegeducateDB").collection("candidateInfo");
    const userCollection = client.db("collegeducateDB").collection("users");
    const reviewsCollection = client.db("collegeducateDB").collection("reviews");
    const galleryCollection = client.db("collegeducateDB").collection("gallery");
    const researchCollection = client.db("collegeducateDB").collection("research");

    app.get("/colleges", async(req, res) =>{
            const result = await collegeCollection.find().toArray();
            res.send(result)
    });


    app.get("/candidateInfo/:email", async(req, res)=>{
        const email = req.query.email;
        const query = {email : email};
        const result = await candidateCollection.find(query).toArray()
        res.send(result)
    } )

    app.post("/candidateInfo", async(req, res) =>{
            const candidate = req.body;
            const result = await candidateCollection.insertOne(candidate);
            res.send(result)
    });
    app.get("/users", async(req, res) =>{
        const result = await userCollection.find().toArray();
            res.send(result)
    });
    app.patch('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const user = req.body;
        const filter = { _id: new ObjectId(id) }
        const updateUser = {
            $set: {
                name: user.name,
                userMail: user.userMail,
                address: user.address,
                university: user.university
            }
        }
        const result = await userCollection.updateOne(filter, updateUser)
        res.send(result)
    })
    app.post("/users", async(req, res) =>{
        const user = req.body;
        const query = { email: user.email }
        const existingUser = await userCollection.findOne(query)
        if (existingUser) {
            return res.send({ message: "Existing User" })
        }
        const result = await userCollection.insertOne(user);
        res.send(result)
    });


    // Reviews API 
    app.get("/reviews", async(req, res) =>{
        const result = await reviewsCollection.find().toArray();
        res.send(result)
    })
    app.post("/reviews", async(req, res) =>{
        const review = req.body;
        const result = await reviewsCollection.insertOne(review)
        res.send(result)
    })
    // Gallery API 
    app.get("/gallery", async(req, res) =>{
        const result = await galleryCollection.find().toArray();
        res.send(result)
    })
    // Research API 
    app.get("/research", async(req, res) =>{
        const result = await researchCollection.find().toArray();
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () =>{
console.log(`Collegeducate is running on  server:${port}`)
})