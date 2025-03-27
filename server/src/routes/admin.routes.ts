import {Router} from 'express';
import {checkAdmin, registerAdmin, loginAdmin} from "../controllers/auth/admin.auth";
import { createStudent } from '../controllers/admin.controllers';
const router = Router();

router.post('/verify',checkAdmin)
router.post('/register',registerAdmin);
router.post('/login',loginAdmin);
router.post('/create-student',createStudent);


export default router;