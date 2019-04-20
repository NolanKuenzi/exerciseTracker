const path = require('path');
const router = require('express').Router();

router.get('*', (req, res) => {
  res.json('egg');
});

module.exports = router;