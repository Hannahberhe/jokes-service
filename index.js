const express = require('express');
const { Op } = require('sequelize');
const app = express();
const { Joke } = require('./db');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//-----------------------------------------------------
app.get('/jokes', async (req, res, next) => {
try {
// TODO - filter the jokes by tags and content
const where = {}
if (req.query.tags){
where.tags={
[Op.like] : `%${req.query.tags}%`
}
}
if (req.query.content){
where.joke = {
[Op.like]: `%${req.query.content}%`,
};
}
const jokes = await Joke.findAll({ where });
// const jokes = [];
res.send(jokes);
} catch (error) {
console.error(error);
next(error)
}
});
//-----------------------------------------------------
app.post('/jokes', async (req, res, next) => {
try{
const {joke, tag}= req.body; //UI form
const jokes = await Joke.create({joke,tag})
res.json({message: 'success', jokes})
}catch (error){
console.log(error.message);
next(error);
}

});
//-----------------------------------------------------
app.delete('/jokes/:id', async (req, res, next) => {
try{
const id = req.params.id;
const jokes = await Joke.findByPk(id);
if(!jokes){
res.status(404).json({message: `Joke not found ${id}.`});
await Joke.destroy({where:{id}});
res.status(200).json({message: 'Jokes Successful ', jokes});
}
} catch(error){
console.log(error.message);
next(error);
}

});

app.put('/jokes/:id', async (req, res, next) => {
  try{
  const id = req.params.id;
  const jokes = await Joke.findAll();
  
  
  if(!jokes){
  res.status(404).json({message: `Joke could not be updated ${id}.`});
  await Joke.update({where:{id}});
  res.status(200).json({message: 'Jokes Successful update ', jokes});
  }
  } catch(error){
  console.log(error.message);
  next(error);
  }
  
  });
  
  //-----------------------------------------------------
  // we export the app, not listening in here, so that we can run tests
  module.exports = app;