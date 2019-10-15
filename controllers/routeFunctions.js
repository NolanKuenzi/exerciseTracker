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
  filter_delete: function(query) {
    function filterFunc(data) {
      let getLog = data.log.slice(0);
      getLog.sort((a, b) => new Date(a.date) - new Date(b.date));
      if (query.from !== '') {
        getLog = getLog.filter(item => new Date(item.date) >= new Date(query.from));
      }
      if (query.to !== '') {
        getLog = getLog.filter(item => new Date(item.date) <= new Date(query.to));
      }
      if (query.limit !== '') {
        if (query.limit < getLog.length) {
          getLog = getLog.slice(0, query.limit);
        }
      };
      return getLog.slice(0);
    };
    return users.find({userId: query.userId}, {__v: 0}).then(function(data) {
      if (data.length === 0) {
        return 'userId not recognized';
      }
      if (query.logId !== undefined) {
        let newLog = data[0].log.slice(0);
        newLog = newLog.filter(item => item.logId !== query.logId);
        newLog.sort((a, b) => new Date(a.date) - new Date(b.date));
        data[0].log = newLog.slice(0);
        const newCount = (parseInt(data[0].count, 10)) - 1;
        data[0].count  = newCount;
        return data[0].save().then(function(rtrnData) {
          rtrnData.log = filterFunc(rtrnData).slice(0);
          return rtrnData;
        }).catch(function(error) {
          return error;
        })
      } else {
        data[0].log = filterFunc(data[0]).slice(0);
        return data[0];
      }
    }).catch(function(error) {
      return error;
    })
  },
};
