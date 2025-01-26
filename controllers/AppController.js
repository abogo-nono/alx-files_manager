#!/usr/bin/node

const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
    static async getStatus(req, res) {
        const isRedisAlive = await redisClient.isAlive();
        const isDbAlive = await dbClient.isAlive();

        res.json({ redis: isRedisAlive, db: isDbAlive });
        res.end();
    }

    static async getStats(req, res) {
        try {
            const userCount = await dbClient.nbUsers();
            const fileCount = await dbClient.nbFiles();
            res.json({ userCount, fileCount });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            res.end();
        }
    }
}

module.exports = AppController;
