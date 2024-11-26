require('dotenv').config();
const movieRouter = require('express').Router();
const passport = require('passport');

movieRouter.get("/trending/list", passport.authenticate('jwt', { session: false }), async (req, res) => {

  const url = `${process.env.TMDB_URL}/trending/movie/day?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }

});

movieRouter.get("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {

  const url = `${process.env.TMDB_URL}/movie/${req.params.id}?language=en-US`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }

});

module.exports = movieRouter;
