const express = require('express');
morgan = require('morgan');
const app = express();


app.use(morgan('common'));





let top10Movies = [
  {
    title: 'Movie 1 The Shawshank Redemption ',
    year: '1994'
  },
  {
    title: 'Movie 2The Shawshank Redemption ',
    year: '1994'
  },
  {
    title: 'Movie 3 The Shawshank Redemption ',
    year: '1994'
  },
  {
    title: 'Movie 4 The Shawshank Redemption ',
    year: '1994'
  },
  {
    title: 'Movie 5 The Shawshank Redemption ',
    year: '1994'
  },
  {
    title: 'Movie 6 The Shawshank Redemption ',
    year: '1994'
  },
  {
    title: 'Movie 7 The Shawshank Redemption ',
    year: '1994'
  }
];

//middleware functions
app.use (morgan('common'));  //log all request on terminal
app.use(express.static('public')); // serve all static file in public folder

app.use((err, req, res, next) => {  //error handling: This code would execute every time an error occurs in your code (that hasn’t already been handled elsewhere)
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// GET requests
app.get('/', (req, res) => {
  res.send('This is a default textual response of my choosing hehe');
});


app.get('/movies', (req, res) => {
  res.json(top10Movies);
});

app.get('/documentation', (req, res) => {
  res.sendFile ('public/documentation.html', {root: __dirname }); //respond through express.static
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
