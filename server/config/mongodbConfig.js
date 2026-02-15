import mongoose from 'mongoose';

export async function initMongoDB() {
    const username = process.env.MONGODB_GLOBAL_USER; 
    const pswd = process.env.MONGODB_GLOBAL_PSWD;
    const db = 'sams-shoes'; 
    const url = `mongodb+srv://${username}:${pswd}@cluster0.htvwoee.mongodb.net/${db}?appName=Cluster0`;
    await mongoose.connect(url)
    .then(mongoose.connection.on('connected', () => { console.log('Connected to db') }));
}

