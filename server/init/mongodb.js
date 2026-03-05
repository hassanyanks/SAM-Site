import mongoose from 'mongoose';


export async function initMongoDB() {
    try {
        return new Promise( async (resolve, reject) => {
            const username = process.env.MONGODB_GLOBAL_USER; 
            const pswd = process.env.MONGODB_GLOBAL_PSWD;
            const url = `mongodb+srv://${username}:${pswd}${process.env.SAMS_MONGODB_STR}`;
            const dbInstance = await mongoose.connect(url);
            if( dbInstance.connection.name === 'sams-db' ) {
                mongoose.connection.on('disconnected', () => { console.log('Mongo db disconnected') });
                resolve(dbInstance.connection.name);
            } else {
                reject(new Error('Could not connect to Mongo DB instance'));
            }
        });
    } catch(err) {
        console.error(`error connecting to Mongo db:  ${err}`);
    }
} 


/*
export async function initMongoDB() {
    let dbInstance;
    try {
        const username = process.env.MONGODB_GLOBAL_USER; 
        const pswd = process.env.MONGODB_GLOBAL_PSWD;
        const url = `mongodb+srv://${username}:${pswd}${process.env.SAMS_MONGODB_STR}`;
        dbInstance = await mongoose.connect(url)
        console.log(`mongoose connect result: ${dbInstance.connection.name}`)
    } catch(err) {
        console.error(`error connecting to Mongo db:  ${err}`);
    } finally {
        return dbInstance;
    };


    .then(() => {
        console.log('successfully connected to Mongo db');
    })
    .catch(err => {
        console.error(`error connecting to Mongo db:  ${err}`);
        connected = false;
    })
    .finally(() => {
        mongoose.connection.on('disconnected', () => { console.log('Mongo db disconnected') });
        return connected;
    });
*/    

