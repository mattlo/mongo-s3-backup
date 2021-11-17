'use strict';

const spawnSync = require('child_process').spawnSync;
const aws = require('aws-sdk');

aws.config.region = process.env.AWS_BUCKET_REGION;

let backup;
module.exports = backup = {
  /**
   * @param {String} user
   * @param {String} password
   * @param {String} name
   * @param {String} host
   * @param {String} filename
   * @returns {Buffer} stdOut buffer
   */
  mongoDump: (user, password, name, host, filename) => {
    const args = [
      '-u', user,
      '--authenticationDatabase', 'admin',
      '-d', name,
      // archive filename
      '--archive=' + filename
    ];

    if (password && password.length > 0) {
      args.push('-p' + password);
    }
    
    if (host && host.length > 0) {
      args.push('--host ' + host); 
    }

    return spawnSync('mongodump', args)
  },
  /**
   * @param {Object} props
   * @param {Buffer} file
   * @returns {Buffer}
   */
  uploadToAws: (props, file) => {
    const obj = new aws.S3({
      params: props
    });

    return obj.upload({Body: file});
  }
};
