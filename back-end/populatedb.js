#! /usr/bin/env node
import mongoose from 'mongoose';
import ProductType from './models/producttype.js';
import ProductSample from './models/productsample.js';

const productTypes = [];
const productSamples = [];

const mongoDB = `mongodb+srv://${MONGODB_GLOBAL_USER}:${MONGODB_GLOBAL_PSWD}@cluster0.htvwoee.mongodb.net/sams-shoes?retryWrites=true&w=majority&appName=Cluster0`;
main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    console.log("hydrating DB...");
    await createProductTypes();
    await createProductSamples();
    console.log("Debug: Closing mongoose");
    console.log(`product types array is ${productTypes.toString()}`)
    mongoose.connection.close();
}

async function productTypeCreate(index, name) {
  const productType = new ProductType({ id: index, name: name });
  await productType.save();
  productTypes[index] = productType;
  console.log(`Added product type: ${productTypes[index]._id}`);
}

async function createProductTypes() {
  console.log("Adding product types");
  await Promise.all([
    productTypeCreate(0, "Custom Shoes"),
  ]);
}

async function productSampleCreate( index, price, prodName, prodType, prodImage ) {
    const sampleObj = {
        id: index,
        price: price,
        name: prodName,
        type: prodType._id,
        image: prodImage
    };
    const sample = new ProductSample(sampleObj);
    await sample.save();
    productSamples[index] = sample;
    console.log(`added sample ${prodName}`);
}

const sampleImages = [
    'salvadore_dali_0.jpg',
    'salvadore_dali_1.jpg',
    'sea_creatures.jpg',
    'stars_and_stripes.jpg',
    'toy_story.jpg'
];

async function createProductSamples() {
    console.log('adding product samples');
    await Promise.all([
        productSampleCreate(
            0,
            50.00,
            'Salvadore Dali Front',
            productTypes[0],
            sampleImages[0]
        ),
        productSampleCreate(
            1,
            50.00,
            'Salvadore Dali Side',
            productTypes[0],
            sampleImages[1]
        ),
        productSampleCreate(
            2,
            65.00,
            'Sea Creatures',
            productTypes[0],
            sampleImages[2]
        ),
        productSampleCreate(
            3,
            25.00,
            'Stars and Stripes',
            productTypes[0],
            sampleImages[3]
        ),
        productSampleCreate(
            4,
            75.00,
            'Toy Story',
            productTypes[0],
            sampleImages[4]
        )
    ]);
}
