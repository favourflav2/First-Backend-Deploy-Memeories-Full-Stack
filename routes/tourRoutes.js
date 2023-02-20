import {Router} from 'express'
import { create_Tour, delete_Tour, getAllTour_Post, getOne_Tour, getRelatedTours, getTourBySearch, getTourByTag, like_Tour, update_Tour, user_Tours } from '../controller/tourController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
const router = Router()

// Search Query
router.get("/search",getTourBySearch)

// Find Tour by Tag
router.get("/tag/:tag",getTourByTag)
router.post('/relatedTours',getRelatedTours)

// Get
router.get('/',getAllTour_Post)
router.get('/:id',getOne_Tour)

router.get('/dashboard/:id',authMiddleware,user_Tours)

// Post
router.post('/',authMiddleware,create_Tour)

// Delete
router.delete('/:id',authMiddleware,delete_Tour)

// Put
router.put("/:id",authMiddleware,update_Tour)
router.put('/like/:id', authMiddleware,like_Tour)




export default router