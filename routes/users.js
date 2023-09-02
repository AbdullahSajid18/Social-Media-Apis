import express from 'express'
import bcrypt from 'bcryptjs'
import Users from '../models/Users.js'
const router = express.Router()

// update user 
router.put("/:id", async (req,res) => {
    if(req.body.userId === req.params.id ||   req.body.isAdmin){
      if(req.body.password){
        try{
           const salt = await bcrypt.genSalt(10);
           req.body.password = await bcrypt.hash(req.body.password, salt)
        }catch(err){
           return res.status(500).send(err) 
        }
    }
    try{
        const user = await Users.findByIdAndUpdate(req.params.id, {
            $set:req.body,
        });
        res.status(200).send("Your Account Has Been Updated Successfully")
    } catch(err){
        return res.status(500).send(err) 
    }
    }else {
        return res.status(403).send('You can Only update Your Account')
    }
});
// delete User

router.delete("/:id", async (req,res) => {
    if(req.body.userId === req.params.id ||   req.body.isAdmin){
  
    try{
        const user = await Users.findByIdAndDelete(req.params.id);
        res.status(200).send("Your Account Has Been Deleted Successfully")
    } catch(err){
        return res.status(500).send(err) 
    }
    }else {
        return res.status(403).send('You can Only Delete Your Account')
    }
})

// get a user

router.get("/:id", async (req,res)=> {
    try {
       const user = await Users.findById(req.params.id);
       const{password,updatedAt, ...other} = user._doc
       res.status(200).send(other)
    } catch (err) {
        res.status(500).send(err)
    }
})

// follow a user

router.put('/:id/follow', async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await Users.findById(req.params.id)
            const currentUser = await Users.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{following:req.params.id}})
                res.status(200).json("user has been followed")
            }else{
                res.status(403).json("you already follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }

    } else{
    res.status(403).json("You cant't follow yourself ")
    }
})

// unfollow a user

router.put('/:id/unfollow', async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await Users.findById(req.params.id)
            const currentUser = await Users.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{following:req.params.id}})
                res.status(200).json("user has been unfollowed")
            }else{
                res.status(403).json("you don't follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }

    } else{
    res.status(403).json("You cant't unfollow yourself ")
    }
})


export default router