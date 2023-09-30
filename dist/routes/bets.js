"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bets_1 = require("../validators/bets");
const bets_2 = require("../controllers/bets");
const router = express_1.default.Router();
router.get('/bets', bets_2.getBets);
// TODO: get status bets
router.get('/bets/pendings', bets_2.getBetsPendings);
//TODO: get free bets
router.get('/bets/is-free', bets_2.getBetsFree);
router.get('/bets/is-free/pendings', bets_2.getBetsFreePending);
router.get('/bets/premium/pendings', bets_2.getBetsPremiumPending);
router.get('/bets/:id', bets_2.getBet);
router.post('/bets', bets_1.betValidatorCreate, bets_2.createBet);
router.put('/bets/:id', bets_1.betValidatorUpdate, bets_2.updateBet);
// TODO: update the bet status
router.patch('/bets/:id', bets_1.betStatusUpdateValidator, bets_2.updateBetStatus);
router.delete('/bets/:id', bets_1.betValidatorDelete, bets_2.deleteBet);
exports.default = router;
