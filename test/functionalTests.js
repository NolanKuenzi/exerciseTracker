const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../index');
const mongoose = require('mongoose');

chai.use(chaiHttp);

describe('Tests', function() {
  before(function (done) {
    this.timeout(100000);
    done();
  });
  after(async function () {
    await mongoose.connection.db.dropDatabase();
  });
  let userId;
  describe('/api/exercise/new-user', function () {
    it('username field is filled in', function() {
      return chai.request(server)
        .post('/api/exercise/new-user')
        .send({
          userName: 'testUser',
        })
        .then(function(res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.username, 'testUser');
          userId = res.body.userId; // for subsequent tests
        })
    });
    it('username field length exceeded', function() {
      return chai.request(server)
        .post('/api/exercise/new-user')
        .send({
          userName: 'testUser',
        })
        .then(function(res) {
          assert.equal(res.status, 400);
          assert.equal(res.body, 'Username already exists. Please choose another username.'); 
        })
    });
    it('username field character length exceeded', function() {
      return chai.request(server)
        .post('/api/exercise/new-user')
        .send({
          userName: 'Eärendur_son_of_Tar_Amandil',
        })
        .then(function(res) {
          assert.equal(res.status, 400);
          assert.equal(res.body, 'Username length of 25 characters has been exceeded'); 
        })
    });
  });
  describe('/api/exercise/add', function() {
    it('Every field is filled in',  function() {
      return chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: userId,
          description: 'Jumping Jacks',
          duration: 33,
          date: '2019-10-22',
        })
        .then(function(res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.userId, userId);
          assert.equal(res.body.username, 'testUser');
          assert.equal(res.body.description, 'Jumping Jacks');
          assert.equal(res.body.duration, 33);
          assert.equal(res.body.date, 'Tue Oct 22 2019');
        })
    });
    it('Every field is NOT filled in', function() { 
      return chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: '',
        description: 'Jumping Jacks',
        duration: 33,
        date: '2019-10-22',
      })
      .then(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Please complete required input fields');
      })
    });
    it('description field character limited exceeded', function() { 
      return chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: 'some userId',
        description: 'In ancient Germanic and mythology, the universe was believed to consist of multiple interconnected physical worlds (in Nordic mythology 9....',
        duration: 33,
        date: '2019-10-22',
      })
      .then(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Description character limit of 140 has been exceeded');
      })
    });
    it('duration field is not a whole number', function() { 
      return chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: 'some userId',
        description: 'pull-ups',
        duration: 'Did pull-ups for 15 minutes',
        date: '2019-10-22',
      })
      .then(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Duration field must be a whole number and not exceed ten characters');
      })
    });
    it('duration field exceeds character length of 10', function() { 
      return chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: 'some userId',
        description: 'pull-ups',
        duration: '59105717940',
        date: '2019-10-22',
      })
      .then(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Duration field must be a whole number and not exceed ten characters');
      })
    });
    it('date field is invalid', function() { 
      return chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: 'some userId',
        description: 'running',
        duration: '45',
        date: '2019-20-22',
      })
      .then(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Invalid date');
      })
    });
    it('userId field is unrecognizable', function() { 
      return chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: 'dog945jf4',
        description: 'running',
        duration: '45',
        date: '2019-11-22',
      })
      .then(function(res) {
        assert.equal(res.status, 404);
        assert.equal(res.body, 'userId not recognized');
      })
    });
  });
  describe('/api/exercise/log?', function() {
    // Note - both /api/exercise/log? and /api/exercise/delete routes use the filter_delete controller function 
    // to filter data with the 'from', 'to' and 'limit' filteres (/api/exercise/delete route additionally uses this function to delete items)
    it('Returns exercise log data', function() {
        return chai.request(server)
        .get(`/api/exercise/log?userId=${userId}`)
        .then(function(res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.userId, userId);
          assert.equal(res.body.log[0].description, 'Jumping Jacks')
          assert.equal(res.body.log[0].duration, '33');
          assert.equal(res.body.log[0].date, 'Tue Oct 22 2019');
        })
    });
    it ('Add more entries to test filters', function() {
      return chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: userId,
          description: 'Yoga',
          duration: 65,
          date: '2019-12-25',
        })
        .then(function(res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.description, 'Yoga');
          return chai.request(server)
          .post('/api/exercise/add')
          .send({
            userId: userId,
            description: 'Running',
            duration: 75,
            date: '2019-11-15',
          })
          .then(function(res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.description, 'Running');
          })
        })
    });
    it('Returns filtered exercise log data - ("for" and "to" fields)', function() {
      return chai.request(server)
      .get(`/api/exercise/log?userId=${userId}&from=2019-11-02&to=2019-11-20`)
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.log.length, 1); // other to entries are filtered out
        assert.equal(res.body.log[0].description, 'Running');
        assert.equal(res.body.log[0].duration, '75');
        assert.equal(res.body.log[0].date, 'Thu Nov 14 2019');
      })
    }); 
    it ('Returns filtered exercise log data - ("limit" field)', function() {
      return chai.request(server)
      .get(`/api/exercise/log?userId=${userId}&limit=2`)
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.log.length, 2); // last entry is filered out
        assert.equal(res.body.log[0].description, 'Jumping Jacks');
        assert.equal(res.body.log[0].duration, '33');
        assert.equal(res.body.log[0].date, 'Tue Oct 22 2019');
        assert.equal(res.body.log[1].description, 'Running');
        assert.equal(res.body.log[1].duration, '75');
        assert.equal(res.body.log[1].date, 'Thu Nov 14 2019');
      })
    });
    it('userId is undefined', function() {
      return chai.request(server)
      .get(`/api/exercise/log?userId=`)
      .then(function(res) {
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Please complete required input field');
      })
    });
    it('userId is not recognized', function() {
      return chai.request(server)
      .get(`/api/exercise/log?userId=8dhd837os`)
      .then(function(res) {
        assert.equal(res.status, 404);
        assert.equal(res.body, 'userId not recognized');
      })
    });
  });
  describe('/api/exercise/delete', function() {
    let logId;
    it ('Get logId of entry to be subsequently deleted', function() {
      return chai.request(server)
      .get(`/api/exercise/log?userId=${userId}`)
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.log.length, 3);
        assert.equal(res.body.log[0].description, 'Jumping Jacks');
        assert.equal(res.body.log[1].description, 'Running');
        assert.equal(res.body.log[2].description, 'Yoga');
        logId = res.body.log[0].logId;
      })
    });
    it('Deletes item', function() {
      return chai.request(server)
      .delete(`/api/exercise/delete`)
      .send({
        userId: userId,
        logId: logId,
        from: undefined,
        to: undefined,
        limit: undefined,
      })
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.log.length, 2);
        assert.notEqual(res.body.log[0].description, 'Jumping Jacks');
        assert.equal(res.body.log[0].description, 'Running');
        assert.equal(res.body.log[1].description, 'Yoga');
      })
    });
    it ('Add more entries to work with', function() {
      return chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: userId,
          description: 'Biking',
          duration: 80,
          date: '2020-03-14',
        })
        .then(function(res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.description, 'Biking');
          return chai.request(server)
          .post('/api/exercise/add')
          .send({
            userId: userId,
            description: 'Swimming',
            duration: 95,
            date: '2020-04-21',
          })
          .then(function(res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.description, 'Swimming');
            return chai.request(server)
            .post('/api/exercise/add')
            .send({
              userId: userId,
              description: 'Weight Lifting',
              duration: 102,
              date: '2020-05-12',
            })
            .then(function(res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.description, 'Weight Lifting');
            })
          })
        })
    });
    let logId2;
    it ('Get logId of entry to be subsequently deleted', function() {
      return chai.request(server)
      .get(`/api/exercise/log?userId=${userId}`)
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.log.length, 5);
        assert.equal(res.body.log[0].description, 'Running');
        assert.equal(res.body.log[1].description, 'Yoga');
        assert.equal(res.body.log[2].description, 'Biking');
        assert.equal(res.body.log[3].description, 'Swimming');
        assert.equal(res.body.log[4].description, 'Weight Lifting');
        logId2 = res.body.log[0].logId;
      })
    });
    it('Deletes entry and applies filters to return log', function() {
      return chai.request(server)
      .delete(`/api/exercise/delete`)
      .send({
        userId: userId,
        logId: logId2,
        from: '2020-03-02',
        to: '2020-04-24',
        limit: 1,
      })
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.log.length, 1); // 1 item deleted & 3 filtered out
        assert.equal(res.body.log[0].description, 'Biking');
      })
    });
  });
  describe('Error handling for filters in the /api/exercise/log? & /api/exercise/delete route(s)', function() {
    // Reminder: both routes utilize the filter_delete controller function to filter data
    let logId3;
    it('get a logId to use to test /api/exercise/delete route(s)', function() {
      return chai.request(server)
      .get(`/api/exercise/log?userId=${userId}`)
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.log.length, 4);
        logId3 = res.body.log[0].logId;
      })
    });
    it('userId not recognized', function() {
      return chai.request(server)
      .get(`/api/exercise/log?userId=d39dk3ndi`)
      .then(function(res) {
        assert.equal(res.status, 404);
        assert.equal(res.body, 'userId not recognized');
      })
    });
    it('Invalid "from" filter - /api/exercise/log? route', function() {      
      return chai.request(server)
      .get(`/api/exercise/log?userId=${userId}&from=2020-07-50`)
      .then(function(res) {
        assert.equal(res.status, 400); 
        assert.equal(res.body, 'Invalid date');
      })
    });
    it('Invalid "from" filter - /api/exercise/delete route', function() {
      return chai.request(server)
      .delete(`/api/exercise/delete`)
      .send({
        userId: userId,
        logId: logId3,
        from: '2020-03-50',
        to: undefined,
        limit: undefined,
      })
      .then(function(res) {
        assert.equal(res.status, 400); 
        assert.equal(res.body, 'Invalid date');
      })
    });
    it('Invalid "to" filter - /api/exercise/log? route', function() {      
      return chai.request(server)
      .get(`/api/exercise/log?userId=${userId}&to=2020-70-05`)
      .then(function(res) {
        assert.equal(res.status, 400); 
        assert.equal(res.body, 'Invalid date');
      })
    });
    it('Invalid "to" filter - /api/exercise/delete route', function() {
      return chai.request(server)
      .delete(`/api/exercise/delete`)
      .send({
        userId: userId,
        logId: logId3,
        from: undefined,
        to: '2020-70-05',
        limit: undefined,
      })
      .then(function(res) {
        assert.equal(res.status, 400); 
        assert.equal(res.body, 'Invalid date');
      })
    });
    it('Invalid "limit" filter - /api/exercise/log? route', function() {      
      return chai.request(server)
      .get(`/api/exercise/log?userId=${userId}&limit=not a number`)
      .then(function(res) {
        assert.equal(res.status, 400); 
        assert.equal(res.body, 'Limit must be a number');
      })
    });
    it('Invalid "limit" filter - /api/exercise/delete route', function() {
      return chai.request(server)
      .delete(`/api/exercise/delete`)
      .send({
        userId: userId,
        logId: logId3,
        from: undefined,
        to: undefined,
        limit: 'some letters',
      })
      .then(function(res) {
        assert.equal(res.status, 400); 
        assert.equal(res.body, 'Limit must be a number');
      })
    });
    it('The previous filter errors on the delete routes prevented the entry from being deleted', function() {
      return chai.request(server)
      .get(`/api/exercise/log?userId=${userId}`)
      .then(function(res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.log.length, 4);
        assert.equal(res.body.log[0].logId, logId3);
      })
    });
  }); 
});
