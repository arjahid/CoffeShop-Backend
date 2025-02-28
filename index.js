const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// ⁡⁢⁢⁢middleware⁡
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lsdr1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
        const coffeCollection=client.db("coffe").collection("coffe");


        app.get('/coffe',async(req,res)=>{
            const cursor=coffeCollection.find();
            const result=await cursor.toArray();
            res.send(result);

        })
        app.get('/coffe/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:new ObjectId(id)}
            const  result=await coffeCollection.findOne(query)
            res.send(result);
        })  
        

        app.post('/coffe',async(req,res)=>{
            const newCoffe=req.body;
            console.log('hit the api',newCoffe);
            const result=await coffeCollection.insertOne(newCoffe);
            res.send(result);

        })
        app.put('/coffe/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id:new ObjectId(id)}
            const options={upsert:true}
            const updatedCoffe=req.body
            const coffe={
                $set:{
                    name:updatedCoffe.name,
                     chef:updatedCoffe.chef,
                      supplier:updatedCoffe.supplier,
                       taste:updatedCoffe.taste,
                        category:updatedCoffe.category,
                         details:updatedCoffe.details,
                          photoUrl:updatedCoffe.photoUrl,
                           

                }
            }
            const result=await coffeCollection.updateOne(filter,coffe,options);
            res.send(result);
        })

        app.delete('/coffe/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:new ObjectId(id)}
            const result=await coffeCollection.deleteOne(query);
            res.send(result);
        })
        
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // ⁡⁢⁣⁢await client.close();⁡
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('coffe server is running');
});


app.listen(port, () => {
    console.log(`coffeeshop server is running on http://localhost:${port}`);
});