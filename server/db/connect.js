import mongoose from 'mongoose'

const connectToMongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log('connected to mongodb.')
    } catch (error) {
        console.log('mongodb connection failed...\n', error.message)
    }
}

export default connectToMongoDb
