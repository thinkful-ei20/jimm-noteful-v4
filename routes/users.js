const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', (req, res, next) => {
  User.find({})
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const newUser = { 
    fullname: req.body.fullname.trim(),
    username: req.body.username,
    password: req.body.password,
  };

  if (!newUser.username || typeof newUser.username !== 'string') {
    const err = new Error('Missing or incorrect `username` in request body');
    err.status = 400;
    return next(err);
  }
  if (!req.body.password || typeof req.body.password !== 'string'){
    const err = new Error('Missing or incorrect `password` in request body');
    err.status = 400;
    return next(err);
  }
  if(req.body.password !== req.body.password.trim() || newUser.username !== newUser.username.trim()){
    const err = new Error('Remove whitespace around `username` or `password`');
    err.status = 422;
    return next(err);
  }
  if(req.body.password.length > 72 ){
    const err = new Error('`password` must be no more than 72 characters');
    err.status = 400;
    return next(err);
  }
  if(req.body.password.length < 8 ){
    const err = new Error('`password` must be no less than 8 characters');
    err.status = 400;
    return next(err);
  }

  return User.hashPassword(newUser.password)
    .then(digest => {
      newUser.password = digest;
      return User.create(newUser);
    })
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('That username already exists');
        err.status = 400;
      }
      next(err);
    });
});


module.exports = router;