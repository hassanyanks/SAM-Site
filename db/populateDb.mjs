#! /usr/bin/env node
//import mongoose from 'mongoose';
import {MongoClient} from 'mongodb';
import ProductType from '../server/models/producttype.js';
import Product from '../server/models/product.js';
import User from '../server/models/user.js';
import Cart from '../server/models/cart.js';

const productTypes = [];
const products = [];
const users = [];

console.log(`user ${process.env.MONGODB_GLOBAL_USER}, pswd ${process.env.MONGODB_GLOBAL_PSWD}`)
const mongoDB = `mongodb+srv://${process.env.MONGODB_GLOBAL_USER}:${process.env.MONGODB_GLOBAL_PSWD}${process.env.SAMS_MONGODB_STR}`;
console.log(`mongodb url:  ${mongoDB}`)
main().catch((err) => console.log(err));

async function main() {
    const client = new MongoClient(mongoDB);
    await client.connect(mongoDB);
    console.log("Debug: Should be connected?");
    console.log("hydrating DB...");
    const db = client.db('sams-db');
    const typesCollection = db.collection('producttypes');
    const productsCollection = db.collection('products');
    const usersCollection = db.collection('users');
    const cartsCollection = db.collection('carts');
    await createProductTypes( typesCollection);
    await createProducts(productsCollection);
    await createUsers(usersCollection);
    await createCarts(cartsCollection);
    console.log("Debug: Closing mongoose");
    client.close();
}

async function createCarts(collection) {
    const userObj = {
        email: 'fakeUser@gmail.com',
    };
    const user = new User(userObj);
  console.log(`Adding carts using user: ${userObj}`);
  await Promise.all([
    cartCreate(collection, null, null, [{}]),
  ]);
}

async function cartCreate( collection, userId, sessionId, items ) {
    const updatedCart = await collection.findOneAndUpdate(
        {userId, sessionId, items},
        { $setOnInsert: 
            {
                userId,
                sessionId,
                items,
            }
         },
        { upsert: true, returnNewDocument: true }
    );
}
async function createProductTypes(collection) {
  console.log("Adding product types");
  await Promise.all([
    productTypeCreate(collection, 0, "shoes"),
    productTypeCreate(collection, 1, "floral"),
    productTypeCreate(collection, 2, "events"),
  ]);
    console.log(`product types array is ${productTypes.toString()}`)
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

const productImages = [
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

async function createProducts(collection) {
    console.log('adding products');
    await Promise.all([
        productCreate(
            collection,
            0,
            50.00,
            'Salvadore Dali',
            productTypes[0],
            productImages[0]
        ),
        productCreate(
            collection,
            1,
            50.00,
            'Salvadore Dali',
            productTypes[0],
            productImages[1]
        ),
        productCreate(
            collection,
            2,
            65.00,
            'Sea Creatures',
            productTypes[0],
            productImages[2]
        ),
        productCreate(
            collection,
            3,
            25.00,
            'Stars and Stripes',
            productTypes[0],
            productImages[3]
        ),
        productCreate(
            collection,
            4,
            75.00,
            'Toy Story',
            productTypes[0],
            productImages[4]
        ),
        productCreate(
            collection,
            5,
            75.00,
            'Wedding Place Setting',
            productTypes[1],
            productImages[5]
        ),
        productCreate(
            collection,
            6,
            75.00,
            'Bouquet on Stand',
            productTypes[1],
            productImages[6]
        ),
        productCreate(
            collection,
            7,
            75.00,
            'Weddings',
            productTypes[2],
            productImages[7]
        ),
        productCreate(
            collection,
            8,
            75.00,
            'Birthday Parties',
            productTypes[2],
            productImages[8]
        ),
        productCreate(
            collection,
            9,
            75.00,
            'Wedding Table Floral',
            productTypes[1],
            productImages[9]
        )
    ]);
    console.log(`products array is ${products.toString()}`)
}

async function productCreate( collection, index, price, prodName, prodType, prodImage ) {
    const productObj = {
        id: index,
        price: price,
        name: prodName,
        type: prodType._id,
        image: prodImage
    };
    const product = new Product(productObj);
    const updatedProduct = await collection.findOneAndUpdate(
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
    //console.log(`***************sample ${updatedProduct.name} created/updated using product type ${updatedProduct.type}//${prodType._id}**********************`)
    products[index] = updatedProduct;
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


