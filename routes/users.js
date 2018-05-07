const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

router.post('/users', (req, res, next) => {
  const newUser = { 
    fullname: req.body.fullname,
    username: req.body.username,
    password: req.body.password,
  };
  
  User.create(newUser)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;