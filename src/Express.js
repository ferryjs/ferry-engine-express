'use strict';

import express from 'express';

class Express {
  constructor(specification, database) {
    this.name = 'Express';
    this.specification = specification;
    this.app = express();

    this.initialize();
  }

  route(type, model) {

    switch (type) {

      case 'index':
        return (req, res)=> {
          res.send('Index');
        };
        break;

      case 'find':
        return (req, res)=> {
          res.send('Find');
        };
        break;

      case 'create':
        return (req, res)=> {
          res.send('Create');
        };
        break;

      case 'update':
        return (req, res)=> {
          res.send('Update');
        };
        break;

      case 'delete':
        return (req, res)=> {
          res.send('Delete');
        };
        break;
    }

  }

  initialize() {
    let Router = express.Router();

    for(let path in this.specification.routes) {

      for(let method in this.specification.routes[path]) {

        let action = this.specification.routes[path][method].operationId.split(':')[1].toLowerCase();

        Router[method](path, this.route(action));
      }
    };

    this.app.use(
      this.specification.basePath,
      Router
    );
  }

  start(port = 3000) {
    this.app.listen(port);
  }
}

export default Express;
