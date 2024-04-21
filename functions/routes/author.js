const express = require('express');
const AuthorModel= require('../models/author');
const router = express.Router();

//get
router.get('/', async (req,res)=>{
  try{
    const authors = await AuthorModel.find();
    res.json(authors);
  }catch(err){
    res.status(500).json({message:err.message});
  }
});

router.get('/:id', getAuthor,(req,res)=>{
  res.json(res.authors);
})

//create
router.post('/', async (req,res)=>{
  try{

    //validate request body
    if(!req.body.name || !req.body.age){
      return res.status(400).json({message:'Name and age are required'})
    }

    //check if the author's name already exists
    const existingAuthor = await AuthorModel.findOne({name: req.body.name});
    if(existingAuthor){
      return res.status(400).json({message:'Author is already exists'})
    }

    const author = new AuthorModel(req.body);
    const newAuthor = await author.save();

    res
      .status(200)
      .json({message: 'Author created successfully', author:newAuthor});
  }catch(err){
    res.status(400).json({message: err.message});
  }
})

//update
router.patch('/:id', getAuthor, async (req,res)=>{
  try{
    if(req.body.name != null){
      res.author.name = req.body.name;

      const updateAuthor = await author.save();
      res.json(updateAuthor);
    }
  }catch(err){
    res.status(400).json({message: err.message});
  }
});

router.put('/:id',getAuthor, async (req, res)=>{
  try{
    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );

    res.json(updatedAuthor);
  }catch(err){
    res.status(400).json({message: err.message});
  }
});

router.delete('/:id', getAuthor, async (req,res)=>{
  try{
    await AuthorModel.findByIdAndDelete(req.params.id);
    res.json({message: 'Author deleted'});
  }catch(err){
    res.status(500).json({message:err.message});
  }
});

//middleware function to get a single author by id
async function getAuthor(req,res,next){
  try{
    const author = await AuthorModel.findById(req.params.id);
    if(!author){
      return res.status(404).json({message:'Author not found'});
    }
    res.author = author;
    next();
  }catch(err){
    res.status(500).json({message:err.message});
  }
}

module.exports = router;