const express = require('express'); // Import express
const bodyParser = require('body-parser'); //Import body-parser
const app = express(); // create app

app.use(bodyParser.json()); // parse incoming json
app.set('view engine', 'hbs');

// app.post('/inbound', function (req, res) {
//     res.json(req.body.cd1);
//   });

// app.post('/music', (req,res) => res.render('music', req.body.cd1))

// app.get('/', function(req, res) { // Define route to listen for GET request to path /
//     res.send('Hello World!'); // When request is received send response containing 'Hello World!'
// });

// app.post('/my-post-route', function(req, res) {
//   res.send('something was posted');
// });

// app.get('/city/:location', function(req, res){
//     res.send(req.params.location)
// })

// app.get('/user/:username/photo-id/:photoid', function(req, res){
//     res.send(req.params.username + ' ' + req.params.photoid);
// })

// app.get('/whatever', function(req, res){
//     res.send(req.query.colour + " " + req.query.size)
// })

const fetch = require('node-fetch');

// const filmname = app.get('/movie/:movie', (req, res) => res.send(req.params.movie))

app.get('/movie/:movie/:page', function (req, res) {
    fetch(`http://www.omdbapi.com/?apikey=b749b385&s=${req.params.movie}&page=${req.params.page}`)
      .then(function(response){
        return response.json();
      })
      .then(function(json){
        res.json(json.Search);
      })
      .catch(function(error){
        res.status(500).json({ error: 'We failed to fetch the movie' });
      });
  
  });

  app.get('/movie/:movie/:page/average', function (req, res) {
    fetch(`http://www.omdbapi.com/?apikey=b749b385&s=${req.params.movie}&page=${req.params.page}`)
      .then(function(response){
        return response.json();
      })
      .then(function(json){
        const results = json.Search
            .map(movie=> Number(movie.Year))
            .filter(year => !isNaN(year));
        const arrLength = results.length;
        const average = [results.reduce((a,b)=>(a+b))/arrLength];
        res.json(json.Search.concat(average));
      })
      .catch(function(error){
        res.status(500).json({ error: 'We failed to fetch the movie' });
      });
  
  });


  app.get('/moviedetails/:movie', function (req, res) {
    fetch(`http://www.omdbapi.com/?apikey=b749b385&t=${req.params.movie}`)
      .then(function(response){
        return response.json();
      })
      .then(function(json){
        res.render('movieinfo', json);
      })
      .catch(function(error){
        res.status(500).json({ error: 'We failed to fetch the movie' });
      });
  
  });

  app.get('/sort-by-year/:movie', (req,res)=>{
    fetch(`http://www.omdbapi.com/?apikey=b749b385&s=${req.params.movie}`)
    .then(function(response){
        return response.json();
      })
      .then(function(json){
        const sorted = json.Search.sort((a,b)=>b.Year.slice(0,4) - a.Year.slice(0,4));
        res.json(sorted);
      })
      .catch(function(error){
        res.status(500).json({ error: 'We failed to fetch the movie' });
      });
  })


app.listen(8080, function(){ // Set app to listen for requests on port 3000
    console.log('Listening on port 8080!'); // Output message to indicate server is listening
});
