const router = require('express').Router();
const users = require('../models/users');

function idGenerator() {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
  const randFunc = () => possibleChars[Math.floor(Math.random() * 62)]; 
  const idString = [];
  let idStringCount = 0;
  while (idStringCount < 9) {
    idString.push(randFunc());
    idStringCount++;
  }
  return idString.join('');
}
function filter_delete(query) {
  return new Promise(function(resolve, reject) {
    users.find({userId: query.userId}, {__v: 0})
    .exec(function(err, data) {
      if (err) {
        reject('unable to access database');
        return;
      }
      if (data.length === 0) {
        reject('userId not recognized');
        return;
      }
      if (query.logId !== undefined) {
        let newLog = data[0].log.slice(0);
        newLog = newLog.filter(item => item.logId !== query.logId);
        newLog.sort((a, b) => new Date(a.date) - new Date(b.date));
        data[0].log = newLog.slice(0);
        const newCount = (parseInt(data[0].count, 10)) - 1;
        data[0].count  = newCount;
        data[0].save();
        resolve(data);
      } else {
        resolve(data);
      }
    });
  }).then(function(data) {
      let getLog = data[0].log.slice(0);
      getLog.sort((a, b) => new Date(a.date) - new Date(b.date));
      if (query.from !== undefined) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(query.from) === false) {
          throw 'Invalid date';
        }
      getLog = getLog.filter(item => new Date(item.date) >= new Date(query.from));
      }
      if (query.to !== undefined) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(query.to) === false) {
          throw 'Invalid date';
        }
        getLog = getLog.filter(item => new Date(item.date) <= new Date(query.to));
      }
      if (query.limit !== undefined) {
        if (/[\D]/.test(query.limit) === true) {
          throw 'Limit must be a number';
        }
        if (query.limit < getLog.length) {
          getLog = getLog.slice(0, query.limit);
        }
      }
      data[0].log = getLog;
      return data[0];
  }).catch(function(error) {
      console.log(error);
      return error;
  });
}
router.post('/api/exercise/new-user', function(req, res) {
  if (/\S/.test(req.body.userId) === false) {
    res.send('Invalid username');
    return;
  }
  users.find({}, {_id: 0, count: 0, log: 0, __v: 0})
   .exec(function(err, data) {
    if (err) {
      res.send("Error: Unable to access data");
      return;
    }
    const findUser = data.filter(item => item.username === req.body.userId);
    if (findUser.length === 1) {
      res.send('Cannot create duplicate usernames');
      return;
    } else {
      const addNewUser = new users({userId: idGenerator(), username: req.body.userId, count: '0', log: []});
      addNewUser.save();
      res.json({userId: addNewUser.userId, username: addNewUser.username});
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
  users.find({userId: req.body.userId}, {__v: 0})
    .exec(function(err, data) {
      if (err) {
        res.send('Error: Unable to access data');
        return;
      }
      if (data.length < 1) {
        res.send('userId not recognized');
        return;
      } else {
          const newCount = (parseInt(data[0].count, 10)) + 1;
          const newEntry = {logId: idGenerator(), description: req.body.description, duration: req.body.duration, date: req.body.date};
          data[0].count = newCount;
          data[0].log.push(newEntry);
          data[0].save();
          res.json({userId: req.body.userId, username: data[0].username, description: newEntry.description, duration: newEntry.duration, date: newEntry.date, count: newCount});
        }
    });
});
router.get('/api/exercise/log?', function(req, res) {
  if (req.query.userId === undefined) {
    res.send('Please complete all required input fields');
    return;
  };
  try {
    const getData = async input => {
      const rtrnData = await filter_delete(input);
      res.send(rtrnData);
    };
    getData(req.query);
  } catch(error) {
    console.log(error);
    res.send('Error: Unable to access data');
  }
});
router.delete('/api/exercise/delete', function(req, res) {
  try {
    const getData = async input => {
      const rtrnData = await filter_delete(input);
      res.send(rtrnData);
    };
    getData(req.body);
  } catch(error) {
    console.log(error);
    res.send('Error: Unable to access data');
  }
}); 
module.exports = router;