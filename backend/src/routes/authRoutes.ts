import express, { RequestHandler } from "express";
import { CreateUser, LoginUser } from "../controllers/authController";


const router = express.Router();

router.post("/api/register",CreateUser as unknown as RequestHandler);
router.post("/api/login",LoginUser as unknown as RequestHandler);


export default router;