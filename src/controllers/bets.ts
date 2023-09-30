import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import handleHttpError from '../utils/handleErrors';
import models from '../models/index';
import { BetEnum } from '../enum/betEnum';

async function getBets(_req: Request, res: Response) {
  try {
    const bets = await models.bets.find({});
    res.send(bets);
  } catch (error) {
    handleHttpError(res, 'Cannot get bets');
  }
}

async function getBetsPendings(_req: Request, res: Response) {
  try {
    const pendingBets = await models.bets.find({ status: BetEnum.PENDING });
    res.send(pendingBets);
  } catch (error) {
    handleHttpError(res, 'Cannot get Pending bets');
  }
}

async function getBetsFreePending(_req: Request, res: Response) {
  try {
    const freePendingBets = await models.bets.find({
      isFree: true,
      status: BetEnum.PENDING
    });
    res.send(freePendingBets);
  } catch (error) {
    handleHttpError(res, 'Cannot get pending and free bets');
  }
}

async function getBetsPremiumPending(_req: Request, res: Response) {
  try {
    const freePendingBets = await models.bets.find({
      isFree: false,
      status: BetEnum.PENDING
    });
    res.send(freePendingBets);
  } catch (error) {
    handleHttpError(res, 'Cannot get pending and free bets');
  }
}

async function getBetsFree(_req: Request, res: Response) {
  try {
    const freeBets = await models.bets.find({ isFree: true });
    res.send(freeBets);
  } catch (error) {
    handleHttpError(res, 'Cannot get Free bets');
  }
}

async function getBet(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const data = await models.bets.findById({ _id: id });
    res.send({ data });
  } catch (error) {
    handleHttpError(res, 'Cannot get bet');
  }
}

async function createBet(req: Request, res: Response) {
  const { body } = req;
  try {
    const newBet = await models.bets.create(body);
    res.send(newBet);
  } catch (error) {
    handleHttpError(res, 'Cannot create bet');
  }
}

async function updateBet(req: Request, res: Response) {
  try {
    const { id, ...body } = matchedData(req);
    await models.bets.findByIdAndUpdate(id, body);
    res.send({
      message: 'Bet updated'
    });
  } catch (error) {
    handleHttpError(res, 'Cannot update bet');
  }
}

async function updateBetStatus(req: Request, res: Response) {
  try {
    const { id, ...body } = matchedData(req);
    const status = body.status;

    await models.bets.findByIdAndUpdate(id, { $set: { status: status } });

    res.send({
      message: 'Bet Status Updated'
    });
  } catch (error) {
    handleHttpError(res, 'Cannot Update Bet Status');
  }
}

async function deleteBet(req: Request, res: Response) {
  try {
    const { id } = matchedData(req);
    await models.bets.findOneAndDelete({ _id: id });
    res.send({ message: 'Bet deleted successfully' });
  } catch (error) {
    handleHttpError(res, 'Cannot delete bet');
  }
}

export {
  getBets,
  getBetsPendings,
  getBetsFree,
  getBet,
  createBet,
  updateBet,
  deleteBet,
  updateBetStatus,
  getBetsFreePending,
  getBetsPremiumPending
};
