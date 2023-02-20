import mongoose from 'mongoose'
import Tour from '../models/tourModel.js'



export async function create_Tour(req,res){
    const data = req.body
    const tour = new Tour({
        ...data,
        // We created the userId by decoding our token from the user that is logged in
        //! Our MIDDLEWARE FUNCTION is creating the req.userId
        //* Before we get to our route our middleware is taking the users id from the token and setting in req.userId
        // We then take thhat id and store as creator so we know who created the post
        creator: req.userId
    })

    try{
        await tour.save()
        res.status(200).json(tour)
    }catch(e){
        console.log(e)
        res.status(500).json({msg:e.message})
    }
}

export async function getAllTour_Post(req,res){
    const {page} = req.query
    
    // const tour = await Tour.find({})
    try{
        const limit = 6
        const startIndex = (Number(page) - 1) * limit
        const total = await Tour.countDocuments({})
        const tours = await Tour.find().limit(limit).skip(startIndex)
         res.json({
            data: tours,
            currentPage: Number(page),
            totalTours: total,
            numberOfPages: Math.ceil(total / limit)
        })
    }catch(e){
        console.log(e)
        res.status(500).json({msg:e.message})
    }
}

export async function getOne_Tour(req,res){
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({msg: "invalid id"})
    }
    const user = await Tour.findById(id)
    try{
        if(!user){
            return res.status(404).json({msg:"No tour by that id"})
        }
        res.status(200).json(user)


    }catch(e){
        console.log(e)
        res.status(500).json({msg:e.message})
    }
}

export async function user_Tours(req,res){
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({msg: "invalid id"})
    }
    const userTours = await Tour.find({creator: id})
    try{
        if(userTours){
            res.status(200).json(userTours)
        }else{
            res.json({msg: "No Tours"})
        }

    }catch(e){
        console.log(e)
        res.status(500).json({msg:e.message})
    }
}

export async function delete_Tour(req,res){
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({msg: "invalid id"})
    }


    try{
        const tour = await Tour.findByIdAndDelete(id)
        res.status(200).json(tour)
    }catch(e){
        console.log(e)
        res.status(500).json({msg:e.message})
    }
}

export async function update_Tour(req,res){
    const {id} = req.params
    const {title,desc,creator,imageFile,tags} = req.body
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({msg: "invalid id"})
    }

    try{
        const tour = await Tour.findOneAndUpdate({_id:id},{
            ...req.body}, {new:true})
        res.status(200).json(tour)
    }catch(e){
        console.log(e)
        res.status(500).json({msg:e.message})
    }
}

export async function getTourBySearch(req,res){
    const {searchQuery} = req.query
    console.log(req.query)

    try{
        const title = new RegExp(searchQuery,"i")
        
        const tours = await Tour.find({title})
        
            res.json(tours)
 
    }catch(e){
        res.status(404).json({msg:e.message})
    }
}

export async function getTourByTag(req,res){
    const {tag} = req.params
    

    try{
        const tour = await Tour.find({tags:{$in: tag}})
        if(tour){
            res.status(200).json(tour)
        }else{
            res.status(404).json({msg:"No Tour By That Tag"})
        }
    }catch(e){
        res.status(404).json({msg:e.message})
    }
}

export async function getRelatedTours(req,res){
   const tags = req.body
    
    try{
        const tour = await Tour.find({tags:{$in: tags}})
        res.json(tour)
    }catch(e){
        res.status(404).json({msg:e.message})
    }
}

export async function like_Tour(req,res){
    const {id} = req.params
    // req.userId = new ObjectId("63f1a5d96c4f86d6cb0646ab")
    // So we have to use String
    const userId = String(req.userId) 

    try{
        if(!userId){
            return res.status(404).json({msg:"You need to be logged in to an authroized user"})
        }
    
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({msg: "invalid id"})
        }
    
        const tour = await Tour.findById(id)
        //index is filtering over the likes array... if it doesnt find the match it returns -1
        const index = tour.likes.findIndex((value)=> value === String(req.userId))
        // if index equals -1 that means the user has not already liked the post
        if(index === -1){
            tour.likes.push(userId)
        }else{
            tour.likes = tour.likes.filter(item => item !== userId)
        }
    
        const updatedTour = await Tour.findByIdAndUpdate(id,tour,{new:true})
    
        res.status(200).json(updatedTour)
    }catch(e){
        console.log(e)
        res.status(500).json({msg:e.message})
    }
    
}



