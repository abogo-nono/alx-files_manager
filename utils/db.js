#!/usr/bin/node

const { MongoClient } = require('mongodb');
const mongo = require('mongodb');
const { pwdHashed } = require('./utils');

class DBClient {
  /**
   * @constructor
   * @param {string} [host='localhost'] - host to connect to
   * @param {number} [port=27017] - port to connect to
   * @param {string} [database='files_manager'] - database to connect to
   */
  constructor(host = 'localhost', port = 27017, database = 'files_manager') {
    this.url = `mongodb://${host}:${port}`;
    this.database = database;
    this.connected = false;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });

    this.client.connect().then(() => {
      this.connected = true;
    });
  }

  isAlive() {
    return this.connected;
  }

  async countUsers() {
    const usersCollection = this.client.db(this.database).collection('users');
    const count = await usersCollection.countDocuments();
    return count;
  }

  async nbFiles() {
    await this.client.connect();
    const fileCount = await this.client.db(this.database).collection('files').countDocuments();
    return fileCount;
  }

  async createUser(email, password) {
    const hashedPassword = pwdHashed(password);
    const usersCollection = this.client.db(this.database).collection('users');
    const user = await usersCollection.insertOne({ email, password: hashedPassword });
    return user;
  }

  async getUser(email) {
    const usersCollection = this.client.db(this.database).collection('users');
    const user = await usersCollection.findOne({ email });
    return user;
  }

  async getUserById(id) {
    const objectId = new mongo.ObjectId(id);
    const user = await this.client
      .db(this.database)
      .collection('users')
      .findOne({ _id: objectId });

    return user || null;
  }

  async userExists(email) {
    const user = await this.getUser(email);
    return !!user;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
