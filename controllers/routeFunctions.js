const users = require('../models/users');

module.exports = {
  idGenerator: function() {
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    const randFunc = () => possibleChars[Math.floor(Math.random() * 62)]; 
    const idString = [];
    let idStringCount = 0;
    while (idStringCount < 9) {
      idString.push(randFunc());
      idStringCount++;
    }
    return idString.join('');
  },
  filter_delete:function(query) {
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
          getLog = getLog.filter(item => new Date(item.date) >= new Date(query.from));
        }
        if (query.to !== undefined) {
          getLog = getLog.filter(item => new Date(item.date) <= new Date(query.to));
        }
        if (query.limit !== undefined) {
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
  },
};
