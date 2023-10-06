import express, { Application } from 'express';
import Clubs from './clubs';
import Users from './users';
import Auth from './auth';

function routerApi(app: Application) {
  const router = express.Router();
  app.use('/api', router);
  router.use(Clubs);
  router.use(Users);
  router.use(Auth);
}

export default routerApi;
