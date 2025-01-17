import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export const getConnect = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;

    console.log('header verification');
    if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    const encodedCredentials = authorizationHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      'base64',
    ).toString();
    const [email] = decodedCredentials.split(':');

    const user = await dbClient.findUser({ email });
    if (!user) return res.status(401).json({ error: 'Unauthorized access' });

    const token = uuidv4();
    const key = `auth_${token}`;

    await redisClient.set(key, user._id.toString(), 60 * 60 * 24);

    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal error', status: 500 });
  }
};

export const getDisconnect = async (req, res) => {
  try {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    const key = `auth_${token}`;
    const user = await redisClient.get(key);
    if (!user) return res.status(401).json({ error: 'Unauthorized access' });

    await redisClient.del(key);
    return res.status(204).json();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal error', status: 500 });
  }
};
