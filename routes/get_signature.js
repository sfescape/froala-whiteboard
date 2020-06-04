var express = require('express');
var router = express.Router();
require('dotenv').config();

// var app = express();
// var bodyParser = require('body-parser')
// var path = require('path');
// var fs = require('fs');
// var gm = require('gm').subClass({imageMagick: true});
var FroalaEditor = require('wysiwyg-editor-node-sdk');

// app.use(express.static(__dirname + '/'));
// app.use('/bower_components',  express.static(path.join(__dirname, '../bower_components')));
// app.use(bodyParser.urlencoded({ extended: false }));

var moment = require('moment');
var crypto = require('crypto');

router.get('/', function (req, res, next) {
  var s3Config = {
      bucket: process.env.AWS_S3_BUCKET,
      region: 's3-eu-west-2',
      keyStart: '',
      acl: 'public-read-write',
      accessKeyId: process.env.AWS_ACCESS_KEY
  };

  s3Config.policy = {
      expiration: moment().add(1, 'days').toISOString(),
      conditions: [
          { bucket: s3Config.bucket },
          { acl: s3Config.acl },
          { success_action_status: '201' },
          { 'x-requested-with': 'xhr' },
          [ 'starts-with', '$key', s3Config.keyStart ],
          [ 'starts-with', '$Content-Type', '' ]
      ]
  };
  s3Config.policy = new Buffer.from(JSON.stringify(s3Config.policy)).toString('base64');

  var hash = crypto.createHmac('sha1', process.env.AWS_SECRET_KEY);
  s3Config.signature = new Buffer.from(hash.update(s3Config.policy).digest()).toString('base64');

  // var s3Hash = FroalaEditor.S3.getHash(configs);
  res.json(s3Config);
  // res.json([
  //   {id:1, username: "peep"}
  // ])
});

module.exports = router;