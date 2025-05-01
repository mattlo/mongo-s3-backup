'use strict';

const spawnSync = require('child_process').spawnSync;
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const os = require('os');
const execSync = require('child_process').execSync;

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
    // 1. Create a temporary output directory
    const dumpDir = path.join(__dirname, `mongo-dump-${Date.now()}`);
    fs.mkdirSync(dumpDir, { recursive: true });

    const args = [
      '-u', user,
      '--authenticationDatabase', 'admin',
      '-d', name,
      '--out=' + dumpDir
    ];

    if (password && password.length > 0) {
      args.push('-p' + password);
    }

    if (host && host.length > 0) {
      args.push('--host=' + host);
    }

    // 2. Perform the dump
    const result = spawnSync('mongodump', args);

    if (result.status !== 0) {
      throw new Error(`mongodump failed: ${result.stderr.toString()}`);
    }

    // 3. Zip the dump directory
    const zipPath = path.resolve(filename);
    execSync(`zip -r ${zipPath} .`, { cwd: dumpDir });

    // 4. Cleanup dump directory (optional – delete after zipping)
    fs.rmSync(dumpDir, { recursive: true, force: true });

    // 5. Return read stream of the zip file
    return fs.createReadStream(zipPath);
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
