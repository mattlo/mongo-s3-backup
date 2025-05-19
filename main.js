'use strict';
require('dotenv').config();
const backup = require('./backup');
const moment = require('moment');
const fs = require('fs');

const today = moment.utc();

const prefix = process.env.PREFIX ? process.env.PREFIX + '-' : '';
const fileName = prefix +
  'db-' +
  process.env.DB_NAME +
  '-' +
  today.format('YYYY-MM-DD-HH-mm-ss') +
  '.bson';

backup.uploadToAws({
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: `${today.format('YYYY')}/${today.format('MM')}/${today.format('DD')}/${fileName}`
}, backup.mongoDump(
  process.env.DB_USER,
  process.env.DB_PASS,
  process.env.DB_NAME,
  process.env.DB_HOST,
  fileName
))
  .send(function(err) {
    if (err) {
      fs.unlinkSync(fileName);
      return console.error('failed to upload', err);
    }
  
    fs.unlinkSync(fileName);

    console.log('Uploaded ' + fileName + ' successfully');
  });
