# MySQL backup to AWS S3
A simple Node program that runs `mysqldump` and transmits the "stdout" to S3 as a stream.
Required Node 4.x+.

## Install (Linux)
- `cd /opt && git clone https://github.com/mattlo/mysql-s3-backup && cd $_`
- `npm install`
- `cp .env-sample .env`
- Populate `.env` with the correct values

## Usage
- `npm start`