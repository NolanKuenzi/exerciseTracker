const chai = require('chai');
const assert = chai.assert;
const routeFunctions = require('../controllers/routeFunctions');

describe('unitTests', function() {
  it('idGenerator() function returns a 9 digit string', function(done) {
    assert.equal(typeof routeFunctions.idGenerator(), 'string');
    assert.equal(routeFunctions.idGenerator().length, 9);
    done();
  });
});


