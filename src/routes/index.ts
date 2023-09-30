import express, { Application } from 'express';
import Plans from './plans';
import Sports from './sports';
import Leagues from './leagues';
import Bets from './bets';
import Users from './users';
import Auth from './auth';
import Suscription from './subscription';

function routerApi(app: Application) {
  const router = express.Router();
  app.use('/api', router);
  router.use(Plans);
  router.use(Sports);
  router.use(Leagues);
  router.use(Bets);
  router.use(Users);
  router.use(Auth);
  router.use(Suscription);
}

export default routerApi;
