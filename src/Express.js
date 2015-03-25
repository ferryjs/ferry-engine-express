'use strict';

import express from 'express';

import {Router} from 'ferry';

class ExpressAdapter extends Router {

  constructor(config = {}) {
    super(config);
    this.name = 'Express';
    this.app = express();
  }

  route(action, resource) {

    switch (action) {

      case 'index':
        return (req, res)=> {
          res.send(action);
        };
        break;

      case 'find':
        return (req, res)=> {
          res.send(action);
        };
        break;

      case 'create':
        return (req, res)=> {
          res.send(action);
        };
        break;

      case 'update':
        return (req, res)=> {
          res.send(action);
        };
        break;

      case 'delete':
        return (req, res)=> {
          res.send(action);
        };
        break;

    }

  }

  initialize(basePath, routes, callback) {

    let expressRouter = express.Router();

    for (let path in routes) {

      for (let method in routes[path]) {

        let action = routes[path][method].operationId.split(':')[1].toLowerCase();

        expressRouter[method](path, this.route(action));

      }
    };

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
