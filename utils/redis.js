#!/usr/bin/node

const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.redisClient = createClient();
    this.isConnected = false;
    
    this.redisClient.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });
    
    this.redisClient.on('connect', () => {
      this.isConnected = true;
    });
  }

  isAlive() {
    return this.connected;
  }

  async getValue(key) {
    const getValueAsync = promisify(this.redisClient.get).bind(this.redisClient);
    return getValueAsync(key);
  }

  async setValue(key, value, expiration) {
    const setValueAsync = promisify(this.redisClient.set).bind(this.redisClient);
    await setValueAsync(key, value, 'EX', expiration);
  }

  async deleteKey(key) {
    const deleteAsync = promisify(this.redisClient.del).bind(this.redisClient);
    await deleteAsync(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
