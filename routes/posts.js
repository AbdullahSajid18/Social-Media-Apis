import express from "express"
import Post from '../models/Posts.js'
import Users from "../models/Users.js"

const router = express.Router()


// create a post

router.post("/", async (req,res)=> {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).send(savedPost)
    } catch (err) {
        res.status(500).send(err)
    }
})

// update a post

router.put('/:id',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
    if(post.userId === req.body.userId){
        await post.updateOne({$set:req.body})
        res.status(200).json("the post has been updated")
    }else{
        res.status(403).json("You can update only your post" )
    }
    } catch (error) {
        res.status(500).json(error)   
    }
});

// delete a post

router.delete('/:id',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
    if(post.userId === req.body.userId){
        await post.deleteOne({$set:req.body})
        res.status(200).json("the post has been deleted")
    }else{
        res.status(403).json("You can delete only your post" )
    }
    } catch (error) {
        res.status(500).json(error)   
    }
});
// like and dislike a post

router.put("/:id/like", async (req,res)=> {
    try {
        const post = await Post.findById(req.params.id);
       if (!post.likes.includes(req.body.userId)) {
          await post.updateOne({$push: {likes: req.body.userId}});
          res.status(200).send("You Liked a Post!")
       } else {
          await post.updateOne({$pull: {likes: req.body.userId}});
          res.status(200).send('You Dislike a Post')
       }
    } catch (err) {
        res.status(500).send(err)
    }
})

// get a post

router.get("/:id", async (req,res)=> {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).send(post)
    } catch (err) {
        res.status(500).send(err)
    }
});

// get timeline posts 

router.get('/timeline/all', async(req,res)=>{
    try {
        const currentUser = await Users.findById(req.body.userId)
        const userPost = await Post.find({userId:currentUser._id})
        const FriendPost = await Promise.all(
            currentUser.following.map(friendId=>{
              return Post.find({userId: friendId})
            })
        )
        res.json(userPost.concat(...FriendPost))
    } catch (error) {
        res.status(500).send(error)   
        
    }
})

export default router