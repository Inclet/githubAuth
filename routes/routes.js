import express from "express";
import Authentication from '../controllers/authentication';

const router = express.Router();

router.get('/user', Authentication.githubAuthentication);

export default router;