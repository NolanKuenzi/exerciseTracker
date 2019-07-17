const router = require('express').Router();
const users = require('../models/users');
const routeFunctions = require('../controllers/routeFunctions');
const { body, query, validationResult} = require('express-validator/check');
const { sanitizeBody, sanitizeQuery } = require('express-validator/filter');

router.post('/api/exercise/new-user', [
  body('userName')
    .not().isEmpty().withMessage('Invalid username')
    .isLength({max: 25}).withMessage('Username length of 25 characters has been exceeded'),
  sanitizeBody('userName')
    .escape()
    .trim()
], 
function(req, res) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors.array()[0].msg);
      return;
    } 
  users.find({}, {_id: 0, count: 0, log: 0, __v: 0})
    .exec(function(err, data) {
      if (err) {
        res.json("Error: Unable to access data");
        return;
      }
    const findUser = data.filter(item => item.username === req.body.userName);
      if (findUser.length === 1) {
        res.json('Cannot create duplicate usernames');
        return;
      } else {
          return new Promise(function(resolve) {
          const addNewUser = new users({userId: routeFunctions.idGenerator(), username: req.body.userName, count: '0', log: []});
          addNewUser.save();
          resolve(addNewUser)
        }).then(function(addNewUser) {
          res.json({userId: addNewUser.userId, username: addNewUser.username});
        }).catch(function(error) {
          console.log(error);
          res.json('Error: Unable to access data');
        });
      }
    });
});
router.post('/api/exercise/add', [
  body('userId')
    .not().isEmpty().withMessage('Please complete all input fields'),
  body('description')
    .not().isEmpty().withMessage('Please complete all input fields')
    .isLength({max: 140}).withMessage('Description character limit of 140 has been exceeded'),
  sanitizeBody('description')
    .escape()
    .trim(),
  body('duration')
    .not().isEmpty().withMessage('Please complete all input fields')
    .trim()
    .matches(/^\d+$/).withMessage('Duration field must be a whole number and not exceed ten characters')
    .isLength({max: 10}).withMessage('Duration field must be a whole number and not exceed ten characters'),
  body('date')
    .not().isEmpty().withMessage('Please complete all input fields')
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Invalid date')
    .custom(function(date) {
      if (new Date(date).toString() === 'Invalid Date') {
        throw new Error('Invalid date')
      }
      return true;
    }),
],
function(req, res) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors.array()[0].msg);
      return;
    } 
  req.body.date = new Date(req.body.date + "UTC-7").toDateString();
  users.find({userId: req.body.userId}, {__v: 0})
    .exec(function(err, data) {
      if (err) {
        res.json('Error: Unable to access data');
        return;
      }
      if (data.length < 1) {
        res.json('userId not recognized');
        return;
      } else {
          return new Promise(function(resolve) {
            const newCount = (parseInt(data[0].count, 10)) + 1;
            const newEntry = {logId: routeFunctions.idGenerator(), description: req.body.description, duration: req.body.duration, date: req.body.date};
            data[0].count = newCount;
            data[0].log.push(newEntry);
            data[0].save();
            const input = {newCount: newCount, newEntry: newEntry};
            resolve(input);
          }).then(function(input) {
            res.json({userId: req.body.userId, username: data[0].username, description: input.newEntry.description, duration: input.newEntry.duration, date: input.newEntry.date, count: input.newCount});
          }).catch(function(error) {
            console.log(error);
            res.json('Error: Unable to access data');
          });
        }
    });
});
router.get('/api/exercise/log?', [
  query('userId')
    .not().isEmpty().withMessage('Please complete required input field'),
  query('from')
    .optional()
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Invalid date')
    .custom(function(date) {
      if (new Date(date).toString() === 'Invalid Date') {
        throw new Error('Invalid date')
      }
      return true;
    }),
  query('to')
    .optional()
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Invalid date')
    .custom(function(date) {
      if (new Date(date).toString() === 'Invalid Date') {
        throw new Error('Invalid date')
      }
      return true;
    }),
  query('limit')
    .optional()
    .trim()
    .matches(/^\d+$/).withMessage('Limit must be a number')
],
function(req, res) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors.array()[0].msg);
      return;
    } 
  try {
    const getData = async input => {
      const rtrnData = await routeFunctions.filter_delete(input);
      res.json(rtrnData);
    };
    getData(req.query);
  } catch(error) {
    console.log(error);
    res.json('Error: Unable to access data');
  }
});
// body query
router.delete('/api/exercise/delete', [
  body('from')
    .optional()
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Invalid date')
    .custom(function(date) {
      if (new Date(date).toString() === 'Invalid Date') {
        throw new Error('Invalid date')
      }
      return true;
    }),
  body('to')
    .optional()
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Invalid date')
    .custom(function(date) {
      if (new Date(date).toString() === 'Invalid Date') {
        throw new Error('Invalid date')
      }
      return true;
    }),
  body('limit')
    .optional()
    .trim()
    .matches(/^\d+$/).withMessage('Limit must be a number')
], 
function(req, res) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors.array()[0].msg);
      return;
    } 
  try {
    const getData = async input => {
      const rtrnData = await routeFunctions.filter_delete(input);
      res.json(rtrnData);
    };
    getData(req.body);
  } catch(error) {
    console.log(error);
    res.json('Error: Unable to access data');
  }
});
module.exports = router;