const exp=require("express")
const app=exp();
require('dotenv').config();//process.env
const mongoose=require("mongoose");
const userApp=require('./APIs/userApi');
const authorApp=require('./APIs/authorApi');
const adminApp=require('./APIs/adminApi');
const port=process.env.PORT || 4000;
const cors=require('cors')
app.use(cors())

//db connection
mongoose.connect(process.env.DBURL)
.then(()=>
    {
        app.listen(port,()=>
    console.log(`server listening on port ${port}..`))
   console.log("DB Connection Success")
})
.catch(err=>console.log("Error in DB connection",err))

app.use(exp.json())

//connect API routes
app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use("/admin-api",adminApp)

//eror handler
app.use((err,req,res,next)=>{
    console.log("err object in express error handler:",err)

    res.send({message:err.message})
})