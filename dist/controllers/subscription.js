"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSubscription = exports.updateSubscription = void 0;
const handleErrors_1 = __importDefault(require("../utils/handleErrors"));
const index_1 = __importDefault(require("../models/index"));
async function updateSubscription(req, res) {
    try {
        const userId = req.body.id;
        const planId = req.body.planId;
        const plan = await index_1.default.plans.findById(planId);
        if (!plan) {
            return (0, handleErrors_1.default)(res, 'Plan not found');
        }
        // TODO: calculating expiration date taking current date as reference and the number of weeks on plans
        const currentDate = new Date();
        const expirationDate = new Date(currentDate);
        const daysToAdd = 7 * plan.durationInWeeks;
        expirationDate.setDate(currentDate.getDate() + daysToAdd);
        await index_1.default.users.findByIdAndUpdate(userId, {
            $set: {
                subscriptionStatus: true,
                subscriptionExpirationDate: expirationDate.toISOString()
            }
        });
        res.send({ message: 'Subscribe Successfully' });
    }
    catch (error) {
        console.log(error);
        (0, handleErrors_1.default)(res, 'Cannot suscribe', 404);
    }
}
exports.updateSubscription = updateSubscription;
async function removeSubscription(req, res) {
    try {
        const id = req.body.id;
        await index_1.default.users.findByIdAndUpdate(id, {
            $set: {
                subscriptionStatus: false,
                subscriptionExpirationDate: null
            }
        });
        res.send({ message: 'Subscribe Removed Successfully' });
    }
    catch (error) {
        (0, handleErrors_1.default)(res, 'Cannot remove suscription');
    }
}
exports.removeSubscription = removeSubscription;
