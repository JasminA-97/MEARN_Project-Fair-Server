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
    const searchKey = req.query.search

    const query = {
        language : {
            $regex:searchKey,$options:"i"
        }
    }

    try{
        const allProjects = await projects.find(query)
        res.status(200).json(allProjects)
    }catch(err){
        res.status(401).json(err) 
    }

}

// user projects
exports.getUserProjectsController = async(req,res)=>{
    console.log('inside getUserProjectsController');
    const userId = req.payload;
    try{
        const userProjects = await projects.find({userId})
        res.status(200).json(userProjects)
    }catch(err){
        res.status(401).json(err) 
    }

}

//edit project
exports.editProjectController = async(req,res)=>{
    console.log("Inside edit Project Controller");
    const {pid} = req.params
    const {title,language,github,website,overview,projectImg}=req.body
    const uploadImg = req.file?req.file.filename:projectImg
    const userId = req.payload
    try{ 
        const updatedProject = await projects.findByIdAndUpdate({_id:pid},{title,language,github,website,overview,projectImg:uploadImg,userId},{new:true})  
        await updatedProject.save()
        res.status(200).json(updatedProject)
    }catch(err){
        res.status(401).json(err)
    }
}

//remove project
exports.removeProjectController = async(req,res)=>{
    console.log("inside removeProjectController");
    const {pid} = req.params
    try{
        const removedProject = await projects.findByIdAndDelete({_id:pid})
        res.status(200).json(removedProject)
    }catch(err){
        res.status(401).json(err)
    }
}