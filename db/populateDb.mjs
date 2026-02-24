#! /usr/bin/env node
//import mongoose from 'mongoose';
import {MongoClient} from 'mongodb';
import ProductType from '../server/models/producttype.js';
import ProductSample from '../server/models/productsample.js';
import User from '../server/models/user.js';

const productTypes = [];
const productSamples = [];
const users = [];

console.log(`user ${process.env.MONGODB_GLOBAL_USER}, pswd ${process.env.MONGODB_GLOBAL_PSWD}`)
const mongoDB = `mongodb+srv://${process.env.MONGODB_GLOBAL_USER}:${process.env.MONGODB_GLOBAL_PSWD}@cluster0.htvwoee.mongodb.net/sams-shoes?retryWrites=true&w=majority&appName=Cluster0`;
main().catch((err) => console.log(err));

async function main() {
    const client = new MongoClient(mongoDB);
    await client.connect(mongoDB);
    console.log("Debug: Should be connected?");
    console.log("hydrating DB...");
    const db = client.db('sams-shoes');
    const typesCollection = db.collection('producttypes');
    const samplesCollection = db.collection('productsamples');
    const usersCollection = db.collection('users');
    await createProductTypes( typesCollection);
    await createProductSamples(samplesCollection);
    await createUsers(usersCollection);
    console.log("Debug: Closing mongoose");
    console.log(`product types array is ${productTypes.toString()}`)
    console.log(`product samples array is ${productSamples.toString()}`)
    client.close();
}

async function createProductTypes(collection) {
  console.log("Adding product types");
  await Promise.all([
    productTypeCreate(collection, 0, "shoes"),
    productTypeCreate(collection, 1, "floral"),
    productTypeCreate(collection, 2, "events"),
  ]);
}

async function productTypeCreate(collection, index, name) {
  const productType = new ProductType({ id: index, name: name });
  //await productType.save();
    const updatedType = await collection.findOneAndUpdate(
        {id: index},
        { $setOnInsert: {name: name}},
        { upsert: true, returnNewDocument: true }
    );
  productTypes[index] = updatedType;
}

const sampleImages = [
    'salvadore_dali_0.jpg',
    'salvadore_dali_1.jpg',
    'sea_creatures.jpg',
    'stars_and_stripes.jpg',
    'toy_story.jpg',
    'place_setting_floral.png',
    'bouqet_stand_floral.png',
    'weddings.png',
    'birthday_party.png',
    'wedding_table.png',
];

async function createProductSamples(collection) {
    console.log('adding product samples');
    await Promise.all([
        productSampleCreate(
            collection,
            0,
            50.00,
            'Salvadore Dali',
            productTypes[0],
            sampleImages[0]
        ),
        productSampleCreate(
            collection,
            1,
            50.00,
            'Salvadore Dali',
            productTypes[0],
            sampleImages[1]
        ),
        productSampleCreate(
            collection,
            2,
            65.00,
            'Sea Creatures',
            productTypes[0],
            sampleImages[2]
        ),
        productSampleCreate(
            collection,
            3,
            25.00,
            'Stars and Stripes',
            productTypes[0],
            sampleImages[3]
        ),
        productSampleCreate(
            collection,
            4,
            75.00,
            'Toy Story',
            productTypes[0],
            sampleImages[4]
        ),
        productSampleCreate(
            collection,
            5,
            75.00,
            'Wedding Place Setting',
            productTypes[1],
            sampleImages[5]
        ),
        productSampleCreate(
            collection,
            6,
            75.00,
            'Bouquet on Stand',
            productTypes[1],
            sampleImages[6]
        ),
        productSampleCreate(
            collection,
            7,
            75.00,
            'Weddings',
            productTypes[2],
            sampleImages[7]
        ),
        productSampleCreate(
            collection,
            8,
            75.00,
            'Birthday Parties',
            productTypes[2],
            sampleImages[8]
        ),
        productSampleCreate(
            collection,
            9,
            75.00,
            'Wedding Table Floral',
            productTypes[1],
            sampleImages[9]
        )
    ]);
}

async function productSampleCreate( collection, index, price, prodName, prodType, prodImage ) {
    const sampleObj = {
        id: index,
        price: price,
        name: prodName,
        type: prodType._id,
        image: prodImage
    };
    const sample = new ProductSample(sampleObj);
    const updatedSample = await collection.updateOne(
        {id: index},
        { $setOnInsert: 
            {
                price: price,
                name: prodName,
                type: prodType._id,
                image: prodImage
            }
         },
        { upsert: true, returnNewDocument: true }
    );
    console.log(`***************sample ${updatedSample.name} created/updated using product type ${updatedSample.type}//${prodType._id}**********************`)
    productSamples[index] = updatedSample;
}


async function createUsers(collection) {
  console.log("Adding users");
  await Promise.all([
    userCreate(collection, 0, "fakeUser@gmail.com", 'tbd', 'tbd', 'tbd', 'tbd'),
  ]);
}

async function userCreate(collection, index, email, passwordHash, salt, provider, providerId ) {
  const user = new User({ id: index, email: email, passwordHash: passwordHash, salt: salt, provider: provider, providerId: providerId });
  //await productType.save();
    const updatedUser = await collection.findOneAndUpdate(
        {id: index},
        { $setOnInsert: 
            {
             email: email, passwordHash: passwordHash, salt: salt, provider: provider, providerId: providerId   
            }
         },
        { upsert: true, returnNewDocument: true }
    );
  users[index] = updatedUser;
}


