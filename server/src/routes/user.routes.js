import express from 'express'
const router = express.Router();

import {registerUser, loginUser, getCurrentUser, logoutUser} from '../controllers/user.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/logout").post(verifyJWT, logoutUser);


export default router;
