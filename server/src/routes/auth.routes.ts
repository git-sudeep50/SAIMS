import {Router} from 'express';
import {checkUserAccount, registerUser, loginUser, logoutUser} from "../controllers/auth/user.auth";

const router = Router();

router.post('/register',checkUserAccount)
router.post('/verify',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);



export default router;