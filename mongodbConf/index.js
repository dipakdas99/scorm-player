require("custom-env").env();

const mongodb = require("mongodb");
const { getGcpSecret } = require("../api/common");

const MongoClient = mongodb.MongoClient;

const user = process.env.DB_USER;
const cluster = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const port = process.env.PORT;
const env = process.env.NODE_ENV;
// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.
var URI = undefined;
let _db = undefined; // Singleton for the DB connection.

const initDb = async(callback) => {
  const pass = await getGcpSecret(process.env.GSECRET_DB_PASSWORD, process.env.DB_PASSWORD);
  if (env == "development") {
    URI = `mongodb://${user}:${encodeURIComponent(pass)}@${cluster}:${port}/${dbName}?retryWrites=true&w=majority`;
  } else {
    URI = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`;
  }
  if (_db) {
    console.log("Database is already initialized!");
    return callback(null, _db);
  }
  MongoClient.connect(URI, { useUnifiedTopology: true })
    .then((client) => {
      _db = client;

      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error("Database not initialzed");
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};
