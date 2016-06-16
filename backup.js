'use strict';

const spawn = require('child_process').spawn;
const aws = require('aws-sdk');

aws.config.region = process.env.AWS_BUCKET_REGION;

let backup;
module.exports = backup = {
  /**
   * @param {String} user
   * @param {String} password
   * @param {String} name
   * @returns {Buffer} stdOut buffer
   */
  mongoDump: (user, password, name) => {
    const args = [
      '-u', user,
      '--authenticationDatabase', 'admin',
      '-d', name,
      '--archive' // outputs to stdout
    ];

    if (password && password.length > 0) {
      args.push('-p' + password);
    }

    return spawn('mongodump', args)
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
