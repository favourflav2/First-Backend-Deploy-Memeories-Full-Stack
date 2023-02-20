import bcrypt, { genSalt } from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'


export async function signup(req,res){
    const {email,password, firstName, lastName} = req.body


    try{
        const alreadyUser = await User.findOne({email})

        if(alreadyUser){
            return res.status(404).json({msg: "User Already Exits"})
        }

        const hash = await bcrypt.hash(password,12)
        const user = await new User({email,password:hash,name:`${firstName} ${lastName}`})

        await user.save()

        const token = jwt.sign({email:user.email, id:user._id},process.env.SECRET,{expiresIn: '2h'})

        res.status(200).json({token,user})
    }catch(e){
        console.log(e)
        res.status(404).json({msg:e.message})
    }
}

export async function login(req,res){
    const {email,password} = req.body

    const user = await User.findOne({email})
    

    try{
        if(!user){
            return res.status(404).json({msg:"No such user"})
        }else{
            const token = jwt.sign({email:user.email, id:user._id},process.env.SECRET,{expiresIn: '2h'})
            const isMatch = await bcrypt.compare(password,user.password)

            if(!isMatch){
                return res.status(400).json({msg:"Passwords dont match"})
            }else{
                return res.status(200).json({user,token})
            }
        }

    }catch(e){
        console.log(e)
        res.status(400).json({msg:e.message})
    }
}

export async function googleSign(req,res){
    //sub is the googleId
    const {email, name} = req.body
   const token = req.body.sub
    try{
        const oldUser = await User.findOne({email})
        if(oldUser){
            
            // const user2 = await User.findOneAndUpdate({email},{
            //     _id:oldUser._id.toString(),
            //     email,
            //     name,
            //     googleId:token
            // })
            const user = {_id:oldUser._id.toString(),email,name,googleId:token}
            
             return res.status(200).json({user,token})
        }

        const user = await new User({email,name,googleId:token})
        await user.save()
        res.status(200).json({user,token})
    }catch(e){
        console.log(e)
        res.status(500).json({msg:e.message})
    }
}