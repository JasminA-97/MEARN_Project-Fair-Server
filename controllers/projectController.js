const projects = require('../models/projectModel')

//add project
exports.addProjectController = async(req,res)=>{
    console.log('inside addProject function');
    const {title,language,github,website,overview} = req.body
    const userId = req.payload
    const projectImg = req.file.filename
    console.log(title,language,github,website,overview,userId,projectImg);
  try{
    const existingProject = await projects.findOne({github})
    if(existingProject){
        res.status(406).json('Project is already in our database...Add another one!!!')
    }else{
        const newProject = new projects({
            title,language,github,website,overview,userId,projectImg
        })
        await newProject.save()
        res.status(200).json('newProject')
    }
  }catch(err){
    res.status(401).json(err)
  }
} 

// home project
exports.getHomeProjects = async(req,res)=>{
    console.log('inside homeProjects');
    try{
        const homeProjects = await projects.find().limit(3)
        res.status(200).json(homeProjects)
    }catch(err){
        res.status(401).json(err) 
    }

}

// All projects
exports.allProjectsController = async(req,res)=>{
    console.log('inside allProjects');
    try{
        const allProjects = await projects.find()
        res.status(200).json(allProjects)
    }catch(err){
        res.status(401).json(err) 
    }

}

// user projects
exports.getUserProjectsController = async(req,res)=>{
    console.log('inside getUserProjectsController');
    try{
        const userProjects = await projects.find({userId})
        res.status(200).json(userProjects)
    }catch(err){
        res.status(401).json(err) 
    }

}