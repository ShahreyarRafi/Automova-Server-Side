const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n8c8sym.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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


    const productCollection = client.db('automovaDB').collection('product');

    const cartItemCollection = client.db('automovaDB').collection('cart')

    // for cart

    app.get('/cartItems', async (req, res) => {
      const cursor = cartItemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/cartItems', async (req, res) => {
      const newCartItem = req.body;
      console.log(newCartItem);
      const result = await cartItemCollection.insertOne(newCartItem);
      console.log(result);
      res.send(result);
    })

    app.get('/cartItems/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await cartItemCollection.findOne(query);
      console.log(result);
      res.send(result);
    });


    app.delete('/cartItems/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cartItemCollection.deleteOne(query);
      res.send(result);
    })

    // for products

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedProducts = req.body;

      const products = {
        $set: {
          name: updatedProducts.name,
          brand: updatedProducts.brand,
          type: updatedProducts.type,
          price: updatedProducts.price,
          description: updatedProducts.description,
          rating: updatedProducts.rating,
          photo: updatedProducts.photo,
          featured: updatedProducts.featured,
          engine_type: updatedProducts.engine_type,
          transmission: updatedProducts.transmission,
          fuel_type: updatedProducts.fuel_type,
          drive_system: updatedProducts.drive_system,
          infotainment: updatedProducts.infotainment,
          seats: updatedProducts.seats
        }
      }
      console.log(products);

      const result = await productCollection.updateOne(filter, products, options);
      
      res.send(result);
    })

    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.deleteOne(query);
      res.send(result);
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


app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
})