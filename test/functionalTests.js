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
  describe('/api/exercise/new-user', function () {
    it('username field is filled in', function(done) {
      chai.request(server)
        .post('/api/exercise/new-user')
        .send({
          userName: 'testUser',
        })
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 200);
          assert.equal(res.body.username, 'testUser');
          done();  
        });
    }); 
    it('username field length exceeded', function(done) {
        chai.request(server)
          .post('/api/exercise/new-user')
          .send({
            userName: 'testUser',
          })
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 400);
            assert.equal(res.body, 'Cannot create duplicate usernames');
            done();  
          });
      });
      it('username field character length exceeded', function(done) {
        chai.request(server)
          .post('/api/exercise/new-user')
          .send({
            userName: 'Eärendur_son_of_Tar_Amandil',
          })
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 400);
            assert.equal(res.body, 'Username length of 25 characters has been exceeded');
            done();  
          });
      });
  });
  describe('/api/exercise/add', function() {
    it('Every field is filled in', async function() {
      const addUser = await chai.request(server)
      .post('/api/exercise/new-user')
      .send({userName: 'testUser_2'});
      assert.equal(addUser.status, 200);
      
      const addExercise = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Jumping Jacks',
          duration: 33,
          date: '2019-10-22',
        })
          assert.equal(addExercise.status, 200);
          assert.equal(typeof addExercise.body.userId, 'string');
          assert.equal(addExercise.body.username, 'testUser_2');
          assert.equal(addExercise.body.description, 'Jumping Jacks');
          assert.equal(addExercise.body.duration, 33);
          assert.equal(addExercise.body.date, 'Tue Oct 22 2019');
    });
    it('Every field is NOT filled in', function(done) { 
      chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: '',
        description: 'Jumping Jacks',
        duration: 33,
        date: '2019-10-22',
      })
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Please complete required input fields');
        done();
      });
    });
    it('description field character limited exceeded', function(done) { 
      chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: 'some userId',
        description: 'In ancient Germanic and mythology, the universe was believed to consist of multiple interconnected physical worlds (in Nordic mythology 9....',
        duration: 33,
        date: '2019-10-22',
      })
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Description character limit of 140 has been exceeded');
        done();
      });
    });
    it('duration field is not a whole number', function(done) { 
      chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: 'some userId',
        description: 'pull-ups',
        duration: 'Did pull-ups for 15 minutes',
        date: '2019-10-22',
      })
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Duration field must be a whole number and not exceed ten characters');
        done();
      });
    });
    it('duration field exceeds character length of 10', function(done) { 
      chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: 'some userId',
        description: 'pull-ups',
        duration: '59105717940',
        date: '2019-10-22',
      })
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Duration field must be a whole number and not exceed ten characters');
        done();
      });
    });
    it('date field is invalid', function(done) { 
      chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: 'some userId',
        description: 'running',
        duration: '45',
        date: '2019-20-22',
      })
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Invalid date');
        done();
      });
    });
    it('userId field is unrecognizable', function(done) { 
      chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: 'dog945jf4',
        description: 'running',
        duration: '45',
        date: '2019-11-22',
      })
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 404);
        assert.equal(res.body, 'userId not recognized');
        done();
      });
    });
  });
  describe('/api/exercise/log?', function() {
    /* Note - both /api/exercise/log? and /api/exercise/delete routes use the filter_delete controller function 
    to filter data with the 'from', 'to' and 'limit' filteres (/api/exercise/delete route additionally uses this function to delete items) */

    it('Returns exercise log data', async function() {
      /* Add data to database */
      const addUser = await chai.request(server)
      .post('/api/exercise/new-user')
      .send({userName: 'testUser_3'});
      const addExercise = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Running',
          duration: 40,
          date: '2019-10-22',
        });
       const addExercise2 = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Jump Rope',
          duration: 20,
          date: '2019-12-23',
        });
        /* Request log information */
        const getLog = await chai.request(server)
        .get(`/api/exercise/log?userId=${addUser.body.userId}`);
        assert.equal(getLog.status, 200);
        assert.equal(typeof getLog.body.log[0].logId, 'string');
        assert.equal(getLog.body.log[0].description, 'Running');
        assert.equal(getLog.body.log[0].duration, 40);
        assert.equal(getLog.body.log[0].date, 'Tue Oct 22 2019');
          
        assert.equal(typeof getLog.body.log[1].logId, 'string');
        assert.equal(getLog.body.log[1].description, 'Jump Rope');
        assert.equal(getLog.body.log[1].duration, 20);
        assert.equal(getLog.body.log[1].date, 'Sun Dec 22 2019');
    });
    it('Returns filtered exercise log data ("for" and "to" fields)', async function() {
      /* Add data to database */
      const addUser = await chai.request(server)
      .post('/api/exercise/new-user')
      .send({userName: 'testUser_4'});
      const addExercise = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Push-Ups',
          duration: 25,
          date: '2019-10-22',
        });
      const addExercise2 = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Yoga',
          duration: 65,
          date: '2019-12-25',
        });
      /* ^^^ Only entry to be displayed after filters are applied */
      const addExercise3 = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Kickboxing',
          duration: 60,
          date: '2020-01-26',
        });
        /* Request filtered log information */ 
        const getFilteredLog = await chai.request(server)
        .get(`/api/exercise/log?userId=${addUser.body.userId}&from=2019-12-20&to=2020-01-05`);
        assert.equal(getFilteredLog.status, 200);
        assert.equal(typeof getFilteredLog.body.log[0].logId, 'string');
        assert.equal(getFilteredLog.body.log[0].description, 'Yoga');
        assert.equal(getFilteredLog.body.log[0].duration, 65);
        assert.equal(getFilteredLog.body.log[0].date, 'Tue Dec 24 2019');

        assert.isUndefined(getFilteredLog.body.log[1]);        
    });
    it ('Returns filtered exercise log data ("limit" field)', async function() {
      /* Add data to database */
      const addUser = await chai.request(server)
      .post('/api/exercise/new-user')
      .send({userName: 'testUser_5'});
      const addExercise = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Pull-Ups',
          duration: 15,
          date: '2020-02-20',
        });
      const addExercise2 = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Martial Arts',
          duration: 55,
          date: '2020-03-05',
        });
      /* ^^^ Only first two entries will be displayed after filter is applied */
      const addExercise3 = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Yoga',
          duration: 120,
          date: '2020-03-15',
        });
        const getFilteredLog = await chai.request(server)
        .get(`/api/exercise/log?userId=${addUser.body.userId}&limit=2`);
        assert.equal(getFilteredLog.status, 200);
        assert.equal(typeof getFilteredLog.body.log[0].logId, 'string');
        assert.equal(getFilteredLog.body.log[0].description, 'Pull-Ups');
        assert.equal(getFilteredLog.body.log[0].duration, 15);
        assert.equal(getFilteredLog.body.log[0].date, 'Wed Feb 19 2020');
          
        assert.equal(typeof getFilteredLog.body.log[1].logId, 'string');
        assert.equal(getFilteredLog.body.log[1].description, 'Martial Arts');
        assert.equal(getFilteredLog.body.log[1].duration, 55);
        assert.equal(getFilteredLog.body.log[1].date, 'Wed Mar 04 2020');

        assert.isUndefined(getFilteredLog.body.log[2]);
    });
    it('userId is undefined', async function() {
      const getFilteredLog = await chai.request(server)
      .get(`/api/exercise/log?userId=`);
      assert.equal(getFilteredLog.status, 400);
      assert.equal(getFilteredLog.body, 'Please complete required input field');
    });
  });
  describe('/api/exercise/delete', function() {
    it('Deletes item', async function() {
      /* Add data to database */
      const addUser = await chai.request(server)
      .post('/api/exercise/new-user')
      .send({userName: 'testUser_6'});
      const addExercise = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Bench Press',
          duration: 30,
          date: '2020-03-19',
        });
      /* ^^^ Item to be deleted */
      const addExercise2 = await chai.request(server)
        .post('/api/exercise/add')
        .send({
          userId: addUser.body.userId,
          description: 'Pilates',
          duration: 38,
          date: '2020-03-25',
        });
        /* Get Log */
        const getLog = await chai.request(server)
        .get(`/api/exercise/log?userId=${addUser.body.userId}`);
        /* Delete Item */
        const delRtrnLog = await chai.request(server)
        .delete('/api/exercise/delete')
        .send({
          userId: addUser.body.userId,
          logId: getLog.body.log[0].logId,
        });
        assert.equal(delRtrnLog.status, 200);
        assert.equal(delRtrnLog.body.log[0].logId, getLog.body.log[1].logId);
        assert.equal(delRtrnLog.body.log[0].description, 'Pilates');
        assert.equal(delRtrnLog.body.log[0].duration, 38);
        assert.equal(delRtrnLog.body.log[0].date, 'Wed Mar 25 2020');

        assert.isUndefined(delRtrnLog.body.log[1]);
    });
    it('Deletes item and applies filters to return log', async function() {
       /* Add data to database */
       const addUser = await chai.request(server)
       .post('/api/exercise/new-user')
       .send({userName: 'testUser_7'});
       const addExercise = await chai.request(server)
         .post('/api/exercise/add')
         .send({
           userId: addUser.body.userId,
           description: 'Squats',
           duration: 20,
           date: '2020-04-03',
         });
         /* ^^ Filter out with 'from' filter */
       const addExercise2 = await chai.request(server)
         .post('/api/exercise/add')
         .send({
           userId: addUser.body.userId,
           description: 'Pilates',
           duration: 48,
           date: '2020-04-15',
         });
         const addExercise3 = await chai.request(server)
         .post('/api/exercise/add')
         .send({
           userId: addUser.body.userId,
           description: 'Kettlebells',
           duration: 22,
           date: '2020-04-24',
         });
         /* ^^ Item to be deleted */
         const addExercise4 = await chai.request(server)
         .post('/api/exercise/add')
         .send({
           userId: addUser.body.userId,
           description: 'Sprints',
           duration: 15,
           date: '2020-05-13',
         });
         const addExercise5 = await chai.request(server)
         .post('/api/exercise/add')
         .send({
           userId: addUser.body.userId,
           description: 'Sprints',
           duration: 15,
           date: '2020-05-19',
         });
         /* ^^ Filter out with 'to' filter */
         
         /* Get Log */
         const getLog = await chai.request(server)
         .get(`/api/exercise/log?userId=${addUser.body.userId}`);
         
         /* Delete item & apply filters - only exercises 2 & 4 will remain */
         const delFiltered_Rtrn = await chai.request(server)
         .delete('/api/exercise/delete')
         .send({
           userId: addUser.body.userId,
           logId: getLog.body.log[2].logId,
           from: '2020-04-12',
           to: '2020-05-16',
           limit: 3,
         });    
         assert.equal(delFiltered_Rtrn.status, 200);     
         assert.equal(delFiltered_Rtrn.body.log[0].logId, getLog.body.log[1].logId);
         assert.equal(delFiltered_Rtrn.body.log[0].description, 'Pilates');
         assert.equal(delFiltered_Rtrn.body.log[0].duration, 48);
         assert.equal(delFiltered_Rtrn.body.log[0].date, 'Wed Apr 15 2020');

         assert.equal(delFiltered_Rtrn.body.log[1].logId, getLog.body.log[3].logId);
         assert.equal(delFiltered_Rtrn.body.log[1].description, 'Sprints');
         assert.equal(delFiltered_Rtrn.body.log[1].duration, 15);
         assert.equal(delFiltered_Rtrn.body.log[1].date, 'Wed May 13 2020');
 
         assert.isUndefined(delFiltered_Rtrn.body.log[2]);
         assert.isUndefined(delFiltered_Rtrn.body.log[3]);
         assert.isUndefined(delFiltered_Rtrn.body.log[4]);
    });
  });
  describe('Error handling in the /api/exercise/log? & /api/exercise/delete route(s)', function() {
    /* Reminder: both routes utilize the filter_delete controller function to filter data */
    it('userId not recognized', async function() {
      const getLog = await chai.request(server)
      .get(`/api/exercise/log?userId=d39dk3ndi`);
      assert.equal(getLog.status, 404);
      assert.equal(getLog.body, 'userId not recognized');
    });
    it('Invalid "for" filter', async function() {
      const addUser = await chai.request(server)
      .post('/api/exercise/new-user')
      .send({userName: 'testUser_8'});
      
      const addExercise = await chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: addUser.body.userId,
        description: 'Deadlifts',
        duration: 25,
        date: '2020-07-13',
      });
      const addExercise2 = await chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: addUser.body.userId,
        description: 'Bowling',
        duration: 70,
        date: '2020-07-29',
      });
      
      const getLog = await chai.request(server)
      .get(`/api/exercise/log?userId=${addUser.body.userId}`);
      
      const deleteReq = await chai.request(server)
      .delete('/api/exercise/delete')
      .send({
        userId: addUser.body.userId,
        logId: getLog.body.log[0].logId,
        from: '2020-07-50',
      });
      assert.equal(deleteReq.status, 400); 
      assert.equal(deleteReq.body, 'Invalid date');
    });
    it('Invalid "to" filter', async function() {
      const addUser = await chai.request(server)
      .post('/api/exercise/new-user')
      .send({userName: 'testUser_9'});
      
      const addExercise = await chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: addUser.body.userId,
        description: 'Swimming',
        duration: 50,
        date: '2020-07-28',
      });
      const addExercise2 = await chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: addUser.body.userId,
        description: 'Boxing',
        duration: 35,
        date: '2020-08-16',
      });
      const getLog = await chai.request(server)
      .get(`/api/exercise/log?userId=${addUser.body.userId}&to=2020-80-16`);
      assert.equal(getLog.status, 400);
      assert.equal(getLog.body, 'Invalid date');
    });
    it('Invalid "limit" filter', async function() {
      const addUser = await chai.request(server)
      .post('/api/exercise/new-user')
      .send({userName: 'testUser_10'});

      const addExercise = await chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: addUser.body.userId,
        description: 'Baseball',
        duration: 190,
        date: '2020-07-29',
      });
      const addExercise2 = await chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: addUser.body.userId,
        description: 'Football',
        duration: 85,
        date: '2020-08-15',
      });
      const addExercise3 = await chai.request(server)
      .post('/api/exercise/add')
      .send({
        userId: addUser.body.userId,
        description: 'Basketball',
        duration: 140,
        date: '2020-09-10',
      });
      
      const getLog = await chai.request(server)
      .get(`/api/exercise/log?userId=${addUser.body.userId}`);

      const deleteReq = await chai.request(server)
      .delete('/api/exercise/delete')
      .send({
        userId: addUser.body.userId,
        logId: getLog.body.log[0].logId,
        limit: 'One',
      });
      assert.equal(deleteReq.status, 400);
      assert.equal(deleteReq.body, 'Limit must be a number');
    });
  });
});
