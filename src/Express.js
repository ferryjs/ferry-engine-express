'use strict';

import express from 'express';
import bodyParser from 'body-parser';

import {Router} from 'ferry';

class ExpressAdapter extends Router {

  constructor(config = {}) {
    super(config);
    this.name = 'Express';
    this.app = express();
  }

  route(action, resourceType) {

    switch (action) {

      case 'index':
        return (req, res) => {
          this.ferry.storage.find(resourceType, req.query, function (resources) {
            res.json(resources);
          });
        };
        break;

      case 'find':
        return (req, res) => {
          this.ferry.storage.findById(resourceType, req.params.id, function (resource) {
            res.json(resource);
          });
        };
        break;

      case 'create':
        return (req, res) => {
          this.ferry.storage.create(resourceType, req.body, function (resource) {
            res.json(resource);
          });
        };
        break;

      case 'update':
        return (req, res) => {
          this.ferry.storage.update(resourceType, req.params.id, req.body, function (resource) {
            res.json(resource);
          });
        };
        break;

      case 'delete':
        return (req, res) => {
          this.ferry.storage.destroy(resourceType, req.params.id, function () {
            //res.json(resource);
            res.json({ status: 'ok' });
          });
        };
        break;

    }

  }

  initialize(basePath, routes, callback) {

    let expressRouter = express.Router();

    for (let path in routes) {

      for (let method in routes[path]) {

        let action = routes[path][method].operationId.split(':')[1].toLowerCase();
        let resourceType = routes[path][method].operationId.split(':')[0].toLowerCase();

        expressRouter[method](path, this.route(action, resourceType));

      }

    }

    // @todo Allow configuration with spec.
    this.app.use(bodyParser.json());

    this.app.use(basePath, expressRouter);

    if (typeof callback === 'function') {
      callback();
    }

  }

  start(port = 3000, callback) {
    this.app.listen(port, callback);
  }

}

export default ExpressAdapter;
