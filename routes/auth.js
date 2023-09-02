import express from 'express'
import Users from '../models/Users.js'
import bcrypt from 'bcryptjs'




const router = express.Router()


// Registeration Api
router.post('/register', async (req,res)=>{
    try {

        //generate new pass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =  await bcrypt.hash(req.body.password , salt);
        // create new user
      const newUser = new Users({
           username: req.body.username,
           email: req.body.email,
           password: hashedPassword,
      }); 
      // save user and response
     const users = await newUser.save()
     res.status(200).json(users)
    } catch (error){
     throw error
    }
 
 });

// LOGIN

router.post("/login", async (req,res)=> {
    try{
        const user = await Users.findOne({email:req.body.email});
    !user && res.status(404).send("user not found")
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).send("wrong password")
    
    res.status(200).send(user)
    }catch(err){
        res.status(500).send(err)
    }
})
export default router