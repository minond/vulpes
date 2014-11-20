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
    return [host, port, db].join('=+=+=');
}

/**
 * makes a query an id friendly query
 * @function id_query
 * @param {Object} query
 */
function id_query(query) {
    if (query.id) {
        query._id = new ObjectID(query.id);
        delete query.id;
    }
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

/**
 * @function update
 * @param {express} app
 * @param {String} connection identifier
 * @param {String} collection name
 * @param {String} base url
 */
function update(app, connection, collection, base_url) {
    app.put(base_url + '/:id', function (req, res, next) {
        connect(connection, collection, function (err, coll) {
            if (err) {
                next(err);
                return;
            }

            id_query(req.params);
            coll.update(req.params, req.query, function (err, count) {
                return err ? next(err) : res.json({ ok: true, n: count });
            });
        });
    });
}

/**
 * @function destroy
 * @param {express} app
 * @param {String} connection identifier
 * @param {String} collection name
 * @param {String} base url
 */
function destroy(app, connection, collection, base_url) {
    app.delete(base_url + '/:id', function (req, res, next) {
        connect(connection, collection, function (err, coll) {
            if (err) {
                next(err);
                return;
            }

            id_query(req.params);
            coll.remove(req.params, function (err, count) {
                return err ? next(err) : res.json({ ok: true, n: count });
            });
        });
    });
}

/**
 * @function show
 * @param {express} app
 * @param {String} connection identifier
 * @param {String} collection name
 * @param {String} base url
 */
function show(app, connection, collection, base_url) {
    app.get(base_url + '/:id', function (req, res, next) {
        connect(connection, collection, function (err, coll) {
            if (err) {
                next(err);
                return;
            }

            id_query(req.params);
            coll.findOne(req.params, function (err, doc) {
                return err ? next(err) : res.render(collection + '/show', { resource: doc });
            });
        });
    });
}

/**
 * @function edit
 * @param {express} app
 * @param {String} connection identifier
 * @param {String} collection name
 * @param {String} base url
 */
function edit(app, connection, collection, base_url) {
    app.get(base_url + '/:id/edit', function (req, res, next) {
        connect(connection, collection, function (err, coll) {
            if (err) {
                next(err);
                return;
            }

            id_query(req.params);
            coll.findOne(req.params, function (err, doc) {
                return err ? next(err) : res.render(collection + '/edit', { resource: doc });
            });
        });
    });
}

/**
 * @function newnew
 * @param {express} app
 * @param {String} connection identifier
 * @param {String} collection name
 * @param {String} base url
 */
function newnew(app, connection, collection, base_url) {
    app.get(base_url + '/new', function (req, res) {
        res.render(collection + '/new');
    });
}

module.exports = {
    connection: connection,
    create: create,
    destroy: destroy,
    edit: edit,
    index: index,
    newnew: newnew,
    new: newnew,
    show: show,
    update: update
};
