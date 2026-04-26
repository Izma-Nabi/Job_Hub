const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();


// Support specifying server as either 'HOST' + optional DB_INSTANCE, or 'HOST\\INSTANCE' in DB_SERVER
let server = process.env.DB_SERVER || 'DESKTOP-KFTTOVK';
let instance = process.env.DB_INSTANCE || process.env.DB_SERVER && process.env.DB_SERVER.includes('\\') ? (process.env.DB_SERVER.split('\\')[1]) : undefined;
if (server && server.includes('\\')) {
  // if DB_SERVER was provided as 'HOST\\INSTANCE', split
  const parts = server.split('\\');
  server = parts[0];
  instance = parts[1];
}

const config = {
  user: process.env.DB_USER || 'job_portal',
  password: process.env.DB_PASSWORD || '12345678',
  server: server || 'DESKTOP-KFTTOVK',
  database: process.env.DB_NAME || 'JobPortalDB_F',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: instance
  },
  connectionTimeout: process.env.DB_CONN_TIMEOUT ? Number(process.env.DB_CONN_TIMEOUT) : 30000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

console.log('MSSQL config:', { server: config.server, instance: config.options.instanceName, database: config.database });

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};
