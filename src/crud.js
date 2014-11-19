'use strict';

/**
 * crud oprations for models
 * @link http://guides.rubyonrails.org/routing.html#crud-verbs-and-actions
 */
var info = {},
    pool = {};

var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    format = require('util').format;

/**
 * @function url
 * @param {String} connection identifier
 * @return {String} connection url
 */
function url(connection) {
    var conn = info[ connection ];
    return format('mongodb://%s:%s/%s', conn.host, conn.port, conn.db);
}

/**
 * generate a connection identifier
 * @function identifier
 * @param {String} host
 * @param {String} port
 * @param {String} db
 * @return {String} identifier
 */
function identifier(host, port, db) {
    return [ host, port, db ].join('=+=+=');
}

/**
 * register a new connction
 * @function connection
 * @param {String} host
 * @param {String} port
 * @param {String} db
 * @return {String} identifier
 */
function connection(host, port, db) {
    var id = identifier(host, port, db);
    info[ id ] = { host: host, port: port, db: db };
    return id;
}

/**
 * connects to a mongo db. pools connections
 * @function connect
 * @param {String} connection identifier
 * @param {String} collection name
 * @param {Function} cb
 */
function connect(connection, collection, cb) {
    if (connection in pool) {
        cb(
            null,
            pool[ connection ].collection(collection),
            pool[ collection ]
        );
    } else if (connection in info) {
        MongoClient.connect(url(connection), function (err, db) {
            if (err) {
                cb(err);
                return;
            }

            pool[ connection ] = db;
            connect(connection, collection, cb);
        });
    } else {
        cb(new Error('invalid connection'));
    }
}

/**
 * @function index
 * @param {express} app
 * @param {String} connection identifier
 * @param {String} collection name
 * @param {String} base url
 */
function index(app, connection, collection, base_url) {
    app.get(base_url, function (req, res, next) {
        connect(connection, collection, function (err, coll) {
            if (err) {
                next(err);
                return;
            }

            coll.find({}).toArray(function (err, docs) {
                return err ? next(err) : res.json(docs);
            });
        });
    });
}

/**
 * @function create
 * @param {express} app
 * @param {String} connection identifier
 * @param {String} collection name
 * @param {String} base url
 */
function create(app, connection, collection, base_url) {
    app.post(base_url, function (req, res, next) {
        connect(connection, collection, function (err, coll) {
            if (err) {
                next(err);
                return;
            }

            coll.insert(req.query, function (err, docs) {
                return err ? next(err) : res.json(docs);
            });
        });
    });
}

module.exports = {
    connection: connection,
    create: create,
    index: index,
};
