import MongoClient from 'mongodb';

const host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
const port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
const database = process.env.DB_DATABASE
  ? process.env.DB_DATABASE
  : 'files_manager';
const url = `mongodb://${host}:${port}/${database}`;

class DBClient {
  constructor() {
    this.db = null;
    this.connect();
  }

  async connect() {
    try {
      const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.db = client.db(database);
    } catch (error) {
      console.error('Database connection error', error);
    }
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }

  async findUser(user) {
    return this.db.collection('users').findOne(user);
  }

  async insertUser(user) {
    return this.db.collection('users').insertOne(user);
  }
}

const dbClient = new DBClient();

export default dbClient;
