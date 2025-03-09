import {Router} from 'express';
import {checkAdmin, registerAdmin, loginAdmin} from "../controllers/auth/admin.auth";
const router = Router();

router.post('/verify',checkAdmin)
router.post('/register',registerAdmin);
router.post('/login',loginAdmin);


export default router;