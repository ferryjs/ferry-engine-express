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

  /**
   * Route handler middleware creator.
   *
   * @param {String} action
   * @returns {Function} Middleware handler.
   */
  route(action) {

    switch (action) {

      case 'index':
        return (req, res) => {
          this.ferry.storage.find(req.resource.type, req.query, function (resources) {
            res.json(resources);
          });
        };
        break;

      case 'find':
        return (req, res) => {
          this.ferry.storage.findById(req.resource.type, req.params.id, function (resource) {
            res.json(resource);
          });
        };
        break;

      case 'create':
        return (req, res) => {
          this.ferry.storage.create(req.resource.type, req.body, (resource) => {
            res.json(resource);
          });
        };
        break;

      case 'update':
        return (req, res) => {
          this.ferry.storage.update(req.resource.type, req.params.id, req.body, function (resource) {
            res.json(resource);
          });
        };
        break;

      case 'delete':
        return (req, res) => {
          this.ferry.storage.destroy(req.resource.type, req.params.id, function () {
            //res.json(resource);
            res.json({ status: 'ok' });
          });
        };
        break;

    }

  }

  /**
   * Route configuration middleware creator.
   *
   * @param {String} resourceType
   * @param {String} operation
   * @returns {Function} Middleware handler.
   */
  configureRoute(resourceType, operation) {
    return (req, res, next) => {
      req.resource = req.resource || {};
      req.resource.type = resourceType;
      req.resource.operation = operation;
      req.resource.properties = {};
      return next();
    };
  }

  /**
   * Validation middleware creator.
   *
   * @returns {Function} Middleware handler.
   */
  validator() {
    return (req, res, next) => {
      if (! req.body || Object.keys(req.body).length > 0) {
        this.ferry.specification.validateResource(req.resource.type, req.body, req.resource.operation, (result) => {
          if (result === true) {
            req.resource.properties = req.body;
            return next();
          }
          return res.status(422).json(result);
        });
      } else {
        return next();
      }
    }
  }

  initialize(basePath, routes, callback) {

    let expressRouter = express.Router();

    let validator = this.validator();

    for (let path in routes) {

      for (let method in routes[path]) {

        // @todo Generalize operationId as it's a Swagger concept.
        let operation = routes[path][method].operationId;
        let action = routes[path][method].operationId.split(':')[1].toLowerCase();
        let resourceType = routes[path][method].operationId.split(':')[0].toLowerCase();

        expressRouter[method](path, this.configureRoute(resourceType, operation), validator, this.route(action));

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
