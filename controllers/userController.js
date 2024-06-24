const users = require('../models/userModel')
const jwt = require('jsonwebtoken')

//register logic. ie;in registration user data (username,email,pass,....)is stored ie; communication b/w controller and model(asynchronous). After that communication with obj of the model and mongoDB for actual updation in mongoDB

exports.registerController = async (req,res)=>{
    console.log("Inside register function");
    const {username,email,password} = req.body
    console.log(username,email,password);

    try{
        const existingUser = await users.findOne({email})   //findOne({email:email})
        if(existingUser){
            //already a user
            res.status(406).json("Account already exist!!!Please login...")
        }else{
            //add / register user : create object for your model so that schema is preserved
            const newUser = new users({username,email,password,github:"",linkedin:"",profilePic:""})
        
            //update mongodb from model
            await newUser.save()
            res.status(200).json(newUser)
        }
    }catch(err){
        res.status(401).json(err)
    }
    // res.status(200).json("Request received!!!")
}

//login
exports.loginController = async (req,res)=>{
    console.log("inside logic fn");
    const{email,password} = req.body
    console.log(email,password);
    try{
        const existingUser = await users.findOne({email,password})
        if(existingUser){

            //token generate
            const token = jwt.sign({userId:existingUser._id},process.env.JWT_PASSWORD)
            res.status(200).json({user:existingUser,token})
            
        }else{
            res.status(404).json("invalid Email / Password...")

        }
    }catch(err){
        res.status(401).json(err)
    }
}

//edit profile
exports.editProfileController = async(req,res)=>{
    console.log("inside editProfileController");
    const {username,email,password,github,linkedin,profilePic} =req.body
    const uploadImg = req.file?req.file.filename:profilePic
    const userId = req.payload
    try{
        const updateUser = await users.findByIdAndUpdate({_id:userId},{username,email,password,github,linkedin,profilePic:uploadImg},{new:true})
        await updateUser.save()
        res.status(200).json(updateUser)
    }catch(err){
        res.status(401).json(err)
    }

}






