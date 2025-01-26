#!/usr/bin/node

const sha1 = require('sha1');

export const pwdHashed = (pwd) => sha1(pwd);
export const getAuthorizationHeader = (request) => request.headers.authorization ?? null;

export const getToken = (authorizationHeader) => {
  const prefix = 'Basic ';
  if (!authorizationHeader.startsWith(prefix)) {
    return null;
  }
  return authorizationHeader.slice(prefix.length);
};

export const decodeBase64Token = (token) => {
  try {
    const decodedToken = Buffer.from(token, 'base64').toString('utf8');
    const [email, password] = decodedToken.split(':');
    if (!email || !password) {
      return null;
    }
    return { email, password };
  } catch (error) {
    return null;
  }
};

export const getCredentials = (decodedToken) => {
  const tokenParts = decodedToken.split(':');
  const email = tokenParts[0];
  const password = tokenParts[1];

  if (!email || !password) {
    return null;
  }

  return { email, password };
};
