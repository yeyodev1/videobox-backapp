import express, { Application } from 'express';
import Clubs from './clubs';
import Users from './users';
import Auth from './auth';
import Videos from './videos';

function routerApi(app: Application) {
  const router = express.Router();
  app.use('/api', router);
  router.use(Clubs);
  router.use(Users);
  router.use(Auth);
  router.use(Videos);
}

export default routerApi;
