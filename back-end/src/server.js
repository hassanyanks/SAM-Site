import {MongoClient} from 'mongodb';
import path from 'path';
import express from 'express';
import 'dotenv/config';

async function start() { 

    let configDirname;
    if( process.env.NODE_ENV == 'dev' ) {
        configDirname = await import('../../config/config.js');
        console.log(`dirname  is ${JSON.stringify(configDirname)}`)
    }

    const username = process.env.MONGODB_GLOBAL_USER || MONGODB_GLOBAL_USER ;
    const pswd = process.env.MONGODB_GLOBAL_PSWD  || MONGODB_GLOBAL_PSWD;
    const __dirname =  process.env.NODE_ENV === 'dev' ? configDirname.default.name : process.env.NODE_DIRNAME;
    const url = `mongodb+srv://${username}:${pswd}@cluster0.htvwoee.mongodb.net/?appName=Cluster0`;
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db('sams-shoes');

    const app = express();
    app.use(express.json());

    app.use('/images', express.static(path.join(__dirname, '../assets' )));

    app.use(express.static(
        path.resolve(__dirname, '../client/dist'), 
        {maxAge:  '1y', etag:  false}
    ));

    app.get( '/api/products', async (req, res) => {
    const products = await db.collection('productsamples').find({}).sort({name: 1}).toArray();
    console.log(`products are ${JSON.stringify(products)}`);
    res.send(products);
    });


    app.get('/api/products/:id', async (req, res) => {
        const productId = req.params.id;
        const product = await db.collection('productsamples').findOne({id:  parseInt(productId)});
        res.json(product);
    });

    /*
    app.get( '/api/:user/cart', async (req, res) => {
    });

    app.get('/*splat', (req,res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
*/

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log('Server is running on port ' + port);
    });

}

start();










