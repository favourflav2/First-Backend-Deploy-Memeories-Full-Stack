import {Router} from 'express'
import {  googleSign, login, signup } from '../controller/userController.js'
const router = Router()

//Post
router.post('/signup',signup)
router.post('/login',login)
router.post('/googleSignup',googleSign)


export default router