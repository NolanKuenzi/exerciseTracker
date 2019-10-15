const router = require('express').Router();
const users = require('../models/users');
const routeFunctions = require('../controllers/routeFunctions');
const { body, sanitizeBody, query, sanitizeQuery, validationResult } = require('express-validator');

router.post('/api/exercise/new-user', [
  body('userName')
    .not().isEmpty().withMessage('Invalid username')
    .trim()
    .isLength({max: 25}).withMessage('Username length of 25 characters has been exceeded'),
  sanitizeBody('userName')
    .escape()
],
function(req, res) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array()[0].msg);
      return;
    } 
  users.find({}, {_id: 0, count: 0, log: 0, __v: 0}).then(function(data) {
    const findUser = data.filter(item => item.username === req.body.userName);
      if (findUser.length === 1) {
        res.status(400).json('Username already exists. Please choose another username.');
        return;
      } else {
        const addNewUser = new users({userId: routeFunctions.idGenerator(), username: req.body.userName, count: '0', log: []});
        addNewUser.save().then(function(newUsr) {
          res.status(200).json({userId: newUsr.userId, username: newUsr.username});
          }).catch(function(error) {
            res.status(500).json(error.toString());
          })
        }
    }).catch(function(error) {
      res.status(500).json(error.toString());
    })
});
router.post('/api/exercise/add', [
  body('userId')
    .not().isEmpty().withMessage('Please complete required input fields')
    .trim(),
  sanitizeBody('userId')
    .escape(),
  body('description')
    .not().isEmpty().withMessage('Please complete required input fields')
    .trim()
    .isLength({max: 140}).withMessage('Description character limit of 140 has been exceeded'),
  sanitizeBody('description')
    .escape(),
  body('duration')
    .not().isEmpty().withMessage('Please complete required input fields')
    .trim()
    .matches(/^\d+$/).withMessage('Duration field must be a whole number and not exceed ten characters')
    .isLength({max: 10}).withMessage('Duration field must be a whole number and not exceed ten characters'),
  sanitizeBody('duration')
    .escape(),
  body('date')
    .trim()
    .custom(function(date, bodyObj) {
      if (date === '') {
          bodyObj.req.body.date = new Date().toISOString().slice(0,10);
          return true;
      } else {
        if (/^\d{4}-\d{2}-\d{2}$/.test(bodyObj.req.body.date) === false) {
          throw new Error('Invalid date')
        }
        return true;
      }
    })
    .custom(function(date, bodyObj) {
      if (new Date(bodyObj.req.body.date).toString() === 'Invalid Date') {
        throw new Error('Invalid date')
      }
      return true;
    }),
  sanitizeBody('date')
    .escape(),
],
function(req, res) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array()[0].msg);
      return;
    } 
  req.body.date = new Date(req.body.date + "UTC-7").toDateString();
  users.find({userId: req.body.userId}, {__v: 0}).then(function(data) {
    if (data.length < 1) {
      res.status(404).json('userId not recognized');
      return;
    } else {
      const newCount = (parseInt(data[0].count, 10)) + 1;
      const newEntry = {logId: routeFunctions.idGenerator(), description: req.body.description, duration: req.body.duration, date: req.body.date};
      data[0].count = newCount;
      data[0].log.push(newEntry);
      data[0].save().then(function(data) {
        const input = {newCount: newCount, newEntry: newEntry};
        res.status(200).json({userId: req.body.userId, username: data.username, description: input.newEntry.description, duration: input.newEntry.duration, date: input.newEntry.date, count: input.newCount});
      }).catch(function(error) {
        res.status(500).json(error.toString());
      })
    }
  }).catch(function(error) {
    res.status(500).json(error.toString());
  })
});
router.get('/api/exercise/log?', [
  query('userId')
    .not().isEmpty().withMessage('Please complete required input field')
    .trim(),
  sanitizeQuery('userId')
    .escape(),
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
  sanitizeQuery('from')
    .escape(),
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
  sanitizeQuery('to')
    .escape(),
  query('limit')
    .optional()
    .trim()
    .matches(/^\d+$/).withMessage('Limit must be a number'),
  sanitizeQuery('limit')
    .escape(),
],
function(req, res) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array()[0].msg);
      return;
    } 
    const getData = (function() {
      return new Promise(function(resolve, reject) {
        resolve(routeFunctions.filter_delete(req.query));
      }).then(function(rtrnData) {
        if (rtrnData === 'userId not recognized') {
          res.status(404).json(rtrnData);
          return;
        }
        res.status(200).json(rtrnData);
      }).catch(function(error) {
        res.status(500).json(error.toString());
      })
    }());
});
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
  sanitizeBody('from')
    .escape(),
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
  sanitizeBody('to')
    .escape(),
  body('limit')
    .optional()
    .trim()
    .matches(/^\d+$/).withMessage('Limit must be a number'),
  sanitizeBody('limit')
    .escape(),
],
function(req, res) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array()[0].msg);
      return;
    } 
    const getData = (function() {
      return new Promise(function(resolve, reject) {
        resolve(routeFunctions.filter_delete(req.body));
      }).then(function(rtrnData) {
        res.status(200).json(rtrnData);
      }).catch(function(error) {
        res.status(500).json(error.toString());
      });
    })();
});
module.exports = router;