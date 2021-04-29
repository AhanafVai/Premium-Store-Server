const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const objectId = require("mongodb").ObjectID;
const { ObjectId } = require("bson");
const cors = require("cors")
const bodyParser = require("body-parser")
require('dotenv').config()


const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apoqz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const productCollection = client.db("premium-store").collection("products");
  const orderCollection = client.db("premium-store").collection("orders");

  //? from addProduct
  app.post('/addProduct',(req,res)=>{
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result => {
    res.send(result.insertedCount > 0)
    })
  })

  //? from checkOut
  app.post('/addOrder',(req,res)=>{
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result => {
    res.send(result.insertedCount > 0)
    })
  })

 //? To home
  app.get('/products',(req,res)=>{
    productCollection.find({})
    .toArray((err,products)=>{
      res.send(products)
    })
  })

  //? To order 
  app.get('/orders',(req,res)=>{
    orderCollection.find({email:req.query.email})
    .toArray((err,orders)=>{
      res.send(orders)
    })
  })

  //? Delete from ProductManager
   app.delete("/delete/:id", (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });


//? test 
app.get('/', (req, res) => {
  res.send('Hello world 3!')
})

});



app.listen(process.env.PORT || port)