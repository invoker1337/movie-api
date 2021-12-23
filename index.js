const express = require('express');

bodyParser = require('body-parser');

uuid = require('uuid');
morgan = require('morgan');

//integrating mongoose with REST API
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//CORS integration to extend HTTP requests by giving them new headers that include their domain
// const cors = require('cors');
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
//
// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));


// allow Mongoose to connect to MongoDB database so it can perform CRUD operations
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });



const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import "auth.js" file
let auth = require('./auth')(app);

//server side validation
const { check, validationResult } = require('express-validator');



//require passport module and import "passport.js" file
const passport = require('passport');
require('./passport');

//middleware functions
app.use (morgan('common'));  //log all request on terminal
app.use(express.static('public')); // serve all static file in public folder

app.use((err, req, res, next) => {  //error handling: This code would execute every time an error occurs in your code (that hasn’t already been handled elsewhere)
  console.error(err.stack);
  res.status(500).send('Something broke!');
});






//Return a list of ALL movies to the user
app.get('/movies', passport.authenticate('jwt', { session: false }), (req,res) => {
    Movies.find()
      .then(function (movies) {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
      });


//Return a list of ALL genres to the user ***** GENRES not defined yet!
app.get('/genres', passport.authenticate('jwt', { session: false }), (req,res) => {
  Genres.find().then(genres => res.json(genres));
});


//Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by movieTitle to the user
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req,res) => {
  Movies.findOne ( {Title: req.params.title} )
  .then((movie) => {
     res.status(201).json(movie);

})
.catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
});
});



//Return data about a genre (description) by name/title (e.g., “Thriller”)

app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req,res) => {
  Movies.find ( {'Genre.Name': req.params.Name} )
  .then((genreName) => res.json(genreName));

});





//Return data about a director (bio, birth year, death year) by name

app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req,res) => {
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

app.post('/registration',
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Password', 'Password must be at least 8 characters long').isLength({min: 8}),
    check('email', 'Email does not appear to be valid').isEmail()
],
(req,res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }


let hashedPassword = Users.hashPassword(req.body.Password);


  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: hashedPassword,
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
app.get('/users', passport.authenticate('jwt', { session: false }), (req,res) => {
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
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res) => {
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

app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
[
  check('Username', 'Username is required, minimum of 5 characters').isLength({min: 5}).optional(),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric().optional(),
  check('Password', 'Password is required').not().isEmpty().optional(),
  check('Password', 'Password must be 8 characters long').isLength({min: 8}).optional(),
  check('Email', 'Email does not appear to be valid').isEmail()
],

(req,res) => {

  // check validation result
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
    return res.status(422).json({errors: validationErrors.array()});
    }
      // hash the updated password
    let hashedPassword = Users.hashPassword(req.body.Password);

  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
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

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req,res) => {
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


app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req,res) => {
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



app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res) => {
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


    const port = process.env.PORT || 8080;
    app.listen(port, '0.0.0.0',() => {
     console.log('Listening on Port ' + port);
    });
