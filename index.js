const express = require('express');

bodyParser = require('body-parser');

uuid = require('uuid');
morgan = require('morgan');

//integrating mongoose with REST API
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;


// allow Mongoose to connect to MongoDB database so it can perform CRUD operations
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });




const app = express();


app.use(morgan('common'));

app.use(bodyParser.json());




//middleware functions
app.use (morgan('common'));  //log all request on terminal
app.use(express.static('public')); // serve all static file in public folder

app.use((err, req, res, next) => {  //error handling: This code would execute every time an error occurs in your code (that hasn’t already been handled elsewhere)
  console.error(err.stack);
  res.status(500).send('Something broke!');
});






//Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  Movies.find().then(movies => res.json(movies));
});


//Return a list of ALL genres to the user ***** GENRES not defined yet!
app.get('/genres', (req, res) => {
  Genres.find().then(genres => res.json(genres));
});


//Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by movieTitle to the user
app.get('/movies/:title', (req, res) => {
  Movies.findOne ( {Title: req.params.title} )
  .then((movie) => res.json(movie));

});



//Return data about a genre (description) by name/title (e.g., “Thriller”)

app.get('/genres/:Name', (req, res) => {
  Movies.find ( {'Genre.Name': req.params.Name} )
  .then((genreName) => res.json(genreName));

});





//Return data about a director (bio, birth year, death year) by name

app.get('/directors/:Name', (req, res) => {
  Movies.find ( {'Director.Name': req.params.Name} )
  .then((Directors) => {
    res.status(201).json(Directors);

})
.catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
});
});






//Allow new users to register

app.post('/registration', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) =>{res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});


// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});







// Update a user's info, by username

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});




//Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)

app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});




//Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)


app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, removeFavorite) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(removeFavorite);
    }
  });
});





//Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)



app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});





// GET requests
app.get('/', (req, res) => {
  res.send('This is a default textual response of my choosing hehe');
});


app.get('/documentation', (req, res) => {
  res.sendFile ('public/documentation.html', {root: __dirname }); //respond through express.static
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
