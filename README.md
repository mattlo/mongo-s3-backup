# MongoDB backup to AWS S3
A simple Node program that runs `mongodump` and transmits the "stdout" to S3 as a stream.
Requires Node 4.x+ and MongoDB 3.2+.

## Install (Linux)
- `cd /opt && git clone https://github.com/mattlo/mongo-s3-backup && cd $_`
- `npm install`
- `cp .env-sample .env`
- Populate `.env` with the correct values

## Usage
- `npm start`