import {Router} from 'express';
import {checkUserAccount, registerUser, loginUser, logoutUser, getAuthUser} from "../controllers/auth/user.auth";
import { verifyToken } from '../middlewares/auth.middlewares';

const router = Router();

router.post('/register',checkUserAccount)
router.post('/verify',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/get-auth-user',verifyToken,getAuthUser)



export default router;