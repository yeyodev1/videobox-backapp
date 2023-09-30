"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handleImage_1 = __importDefault(require("../middlewares/handleImage"));
const plans_1 = require("../validators/plans");
const plans_2 = require("../controllers/plans");
const router = express_1.default.Router();
router.get('/plans', plans_2.getPlans);
// TODO: endpoint to upload image to GCP before createPlan on POST METHOD
router.post('/planImage', handleImage_1.default.single('planImage'), plans_2.uploadPlanImage);
router.post('/plans', plans_1.planValidatorCreate, plans_2.createPlan);
router.put('/plans/:id', plans_1.planValidatorUpdate, plans_2.updatePlan);
router.delete('/plans/:id', plans_1.planValidatorDelete, plans_2.deletePlan);
exports.default = router;
