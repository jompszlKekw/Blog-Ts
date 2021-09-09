import mongoose from 'mongoose';

const URI = process.env.MONGODB_URL;
const DBNAME = process.env.DBNAME;

mongoose.connect(
  `${URI}`,
  {
    dbName: DBNAME,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log('MongoDb Connection');
  }
);
