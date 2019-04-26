const router = require('express').Router();
const newUser = require('../models/newUser');

router.post('/api/exercise/new-user', function(req, res) {
  if (/\S/.test(req.body.inputUrl) === false) {
    res.send('invalid username');
    return;
  }
  newUser.find({}, {_id: 0, count: 0, log: 0, __v: 0})
   .exec(function(err, data) {
    if (err) {
      res.send("unable to access database");
      return;
    }
    const findUser = data.filter(item => item.username === req.body.inputUrl);
    if (findUser.length === 1) {
      res.send('cannot create duplicate usernames');
      return;
    } else {
      const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
      const randFunc = () => possibleChars[Math.floor(Math.random() * 62)]; 
      const idString = [];
      let idStringCount = 0;
      while (idStringCount < 9) {
        idString.push(randFunc());
        idStringCount++;
      }
      const addNewUser = new newUser({_id: idString.join(''), username: req.body.inputUrl, count: '0', log: []});
      addNewUser.save();
      res.json({username: addNewUser.username, id: addNewUser._id}); 
    }
  }); 
});

router.post('/api/exercise/add', function(req, res) {
  const emptyTest = /\S/;
  if (emptyTest.test(req.body.userId) === false || emptyTest.test(req.body.description) === false || emptyTest.test(req.body.duration) === false || emptyTest.test(req.body.date) === false) {
   res.send('Please complete all input fields');
   return;
  }
  if (/[\D]/.test(req.body.duration) === true) {
    res.send('Duration field must contain a whole number');
    return;
  } 
  if (/^\d{4}-\d{2}-\d{2}$/.test(req.body.date) === false) {
   res.send('Invalid date');
   return;
  }
  req.body.date = new Date(req.body.date + "UTC-7").toDateString();
  newUser.findById(req.body.userId, {__v: 0})
    .exec(function(err, data) {
      if (err) {
        res.status(400).send('unable to access database');
      }
      if (data === null) {
        res.send('username not found');
        return;
      } else {
          const newCount = (parseInt(data.count, 10)) + 1;
          const newEntry = {description: req.body.description, duration: req.body.duration, date: req.body.date};
          data.count = newCount;
          data.log.push(newEntry);
          data.save();
          res.json({username: data.username, description: newEntry.description, duration: newEntry.duration, _id: data._id, date: newEntry.date});
        }
    });
});
router.get('/api/exercise/log?', function(req, res) {
  if (req.query.userId === undefined) {
    res.send('userId not recognized');
    return;
  }
  newUser.findById(req.query.userId, {__v: 0})
  .exec(function(err, data) {
    if (err) {
      res.send('unable to access database');
      return;
    }
    if (data === null || data === undefined) {
      res.send('userId not recognized');
      return;
    }
    let getLog = data.log.slice(0);
    getLog.sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    if (req.query.from !== undefined) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(req.query.from) === false) {
        res.send('Invalid date');
        return;
      }
      getLog = getLog.filter(item => new Date(item.date) >= new Date(req.query.from));
    }
    if (req.query.to !== undefined) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(req.query.to) === false) {
        res.send('Invalid date');
        return;
      }
      getLog = getLog.filter(item => new Date(item.date) <= new Date(req.query.to));
    }
    if (req.query.limit !== undefined && req.query.limit < getLog.length) {
      if (/[\D]/.test(req.query.limit) === true) {
        res.send('Limit must be a number');
        return;
      }
      getLog = getLog.slice(0, req.query.limit);
    }
    data.log = getLog;
    res.send(data);
  });
});
module.exports = router;