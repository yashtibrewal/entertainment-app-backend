require('dotenv').config();
const tvSeriesRouter = require('express').Router();
const passport = require('passport');



tvSeriesRouter.get("/trending/list", passport.authenticate('jwt', { session: false }), async (req, res) => {

  const url = `${process.env.TMDB_URL}/trending/tv/day?language=en-US`;
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

module.exports = tvSeriesRouter;
