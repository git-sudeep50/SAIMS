import {Router} from 'express';
import { createEmployee, createStudent } from '../controllers/accounts.controllers';

const router = Router();


router.post('/create-student',createStudent);
router.post('/create-advisor',createEmployee("ADVISOR"));
router.post('/create-instructor',createEmployee("INSTRUCTOR"));


export default router;