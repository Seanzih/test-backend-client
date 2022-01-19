var express = require('express');
const { uuid } = require('uuidv4');
var router = express.Router();


// Generate User Key
router.get('/generateUserkey', (req, res) => {
  const userkey = uuid();
  return res.status(201).json({userkey});
});



module.exports = router;
