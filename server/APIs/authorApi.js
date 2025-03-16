const exp=require('express');
const expressAsyncHandler = require('express-async-handler');
const createUserOrAuthor = require('./createUserOrAuthor');
const authorApp=exp.Router();
const Article = require("../models/articleModel")
const {requireAuth,clerkMiddleware}=require('@clerk/express')
require('dotenv').config()
//API

authorApp.use(clerkMiddleware())
//create new author
authorApp.post("/author",expressAsyncHandler(createUserOrAuthor))

//create new article
authorApp.post("/article",expressAsyncHandler(async(req,res)=>{
   //get new article obj from req
   const newArticleObj=req.body;
   const newArticle=new Article(newArticleObj);
   const articleObj= await newArticle.save();
   res.status(201).send({message:"article published",payload:articleObj})
}))






// Get articles (with optional category filter)
authorApp.get("/articles", expressAsyncHandler(async (req, res) => {
   try {
       let { category } = req.query; // Get category from query params
       let filter = {};

       if (category && category !== "all") {
         filter.category = { $regex: new RegExp(category, "i") };  // Case-insensitive

       }

       let articles = await Article.find(filter); // Fetch filtered articles

       res.status(200).send({ message: "articles", payload: articles });
   } catch (error) {
       res.status(500).send({ message: "Error fetching articles", error });
   }
}));

authorApp.get('/unauthorized',(req,res)=>{
  res.send({message:'Unauthorized request ...'})
})
//modify an article by article id
authorApp.put('/article/:articleId',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
   //get modified article
   const modifiedArticle=req.body;
   //update article by article id
   const latestArticle=await Article.findByIdAndUpdate(modifiedArticle._id,{...modifiedArticle},{returnOriginal:false})
   //send res
   res.status(200).send({message:"article modified",payload:latestArticle})

}))

//delete (soft delete) article by article id
authorApp.put('/articles/:articleId',expressAsyncHandler(async(req,res)=>{
    //get modified article
    const modifiedArticle=req.body;
    //update article by article id
    const latestArticle=await Article.findByIdAndUpdate(modifiedArticle._id,
      {...modifiedArticle},
      {returnOriginal:false})
    //send res
    res.status(200).send({message:"article deleted or restored",payload:latestArticle})
 
 }))


 
module.exports=authorApp;