#!/usr/bin/node

const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', AuthController.getMe);
router.get('/users/:id/files', FilesController.getIndex);
router.post('/users/:id/files', FilesController.postUpload);
router.get('/users/:id/files/:fileId', FilesController.getShow);
router.put('/users/:id/files/:fileId/publish', FilesController.putPublish);
router.put('/users/:id/files/:fileId/unpublish', FilesController.putUnpublish);

module.exports = router;
