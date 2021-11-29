const express = require('express');

bodyParser = require('body-parser')

uuid = require('uuid');
morgan = require('morgan');



const app = express();


app.use(morgan('common'));

app.use(bodyParser.json());



let movies = [
  {
    movieTitle: 'Movie 1',
    year: '1994'
  },
  {
    movieTitle: 'Movie 2',
    year: '1994'
  },
  {
    movieTitle: 'Movie 3',
    year: '1994'
  },
  {
    movieTitle: 'Movie 4',
    year: '1994'
  },
  {
    movieTitle: 'Movie 5',
    year: '1994'
  },
  {
    movieTitle: 'Movie 6',
    year: '1994'
  },
  {
    movieTitle: 'Movie 7',
    year: '1994'
  }
];

let genres = [
  {
    genreName: 'Thriller',
    description:'blabla'
  },
  {
    genreName: 'Action',
    description:'blabla'
  },
  {
    genreName: 'Comedy',
    description:'blabla'
  },
  {
    genreName: 'Drama',
    description:'blabla'
  },
  {
    genreName: 'Horror',
    description:'blabla'
  },
];

let directors = [
  {
    directorName: 'name 1',
    description:'blabla'
  },
  {
    directorName: 'name 2',
    description:'blabla'
  },
  {
    directorName: 'name 3',
    description:'blabla'
  },
  {
    directorName: 'name 4',
    description:'blabla'
  },
  {
    directorName: 'name 5',
    description:'blabla'
  },
];



//middleware functions
app.use (morgan('common'));  //log all request on terminal
app.use(express.static('public')); // serve all static file in public folder

app.use((err, req, res, next) => {  //error handling: This code would execute every time an error occurs in your code (that hasn’t already been handled elsewhere)
  console.error(err.stack);
  res.status(500).send('Something broke!');
});






//Return a list of ALL movies to the user

app.get('/movies', (req, res) => {
  res.json(movies);
});


//Return a list of ALL genres to the user

app.get('/genres', (req, res) => {
  res.json(genres);
});

//Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by movieTitle to the user

app.get('/movies/:movieTitle', (req, res) => {
  res.json(movies.find ((movie) =>
  {return movie.movieTitle === req.params.movieTitle}));

});



//Return data about a genre (description) by name/title (e.g., “Thriller”)

app.get('/genres/:genreName', (req, res) => {
  res.json(genres.find ((genre) =>
  {return genre.genreName === req.params.genreName}));

});


//Return data about a director (bio, birth year, death year) by name

app.get('/directors/:directorName', (req, res) => {
  res.json(directors.find ((director) =>
  {return director.directorName === req.params.directorName}));

});


//Allow new users to register

app.post('/user/register', (req, res) => {
res.send('user succesfully registered');
});

//   let newAccount = req.body;
//
//   if(!newAccount.name) {
//     const message = 'Missing "name" in request body';
//     res.status(400).send(message);
//   } else {
//     newAccount.id = uuid.v4();
//     register.push(newAccount);
//     res.status(201).send(newAccount);
//   }
// });





//Allow users to update their user info (username)



app.put('/user/:username', (req, res) => {
  res.send('user info succesfully updated');
  });

//   let user = students.find((student) => { return student.name === req.params.name });
//
//   if (student) {
//     student.classes[req.params.class] = parseInt(req.params.grade);
//     res.status(201).send('Student ' + req.params.name + ' was assigned a grade of ' + req.params.grade + ' in ' + req.params.class);
//   } else {
//     res.status(404).send('Student with the name ' + req.params.name + ' was not found.');
//   }
// });




//Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)



app.post('/user/favorites/:movieTitle', (req, res) => {
  res.send('favorite added to list');
  });


//   let newFavorite = req.body;
//
//   if (!newFavorite.movieTitle) {
//     const message = 'Missing title in request body';
//     res.status(400).send(message);
//   } else {
//     newFavorite.movieTitle = uuid.v4();
//     favorites.push(newFavorite);
//     res.status(201).send(newFavorite);
//   }
// });




//Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)


app.delete('/users/favorites/:movieTitle', (req, res) => {
  res.send('favorite succesfully removed from list');
  });

//   let favorite = favorites.find((favorite) => { return favorite.movieTitle === req.params.movieTitle });
//
//     if (favorite) {
//       favorites = favorites.filter((obj) => { return obj.movieTitle !== req.params.movieTitle })
//       res.status(201).send('Favorite ' + req.params.movieTitle + 'has been removed from favorites.');
//     }
// });





//Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)


app.delete('/users/:Username', (req, res) => {
  res.send('account deleted succefully');
  });



//   let username = users.find((username) => { return username.name === req.params.name});
//
//     if (username) {
//       users = users.filter((obj) => { return obj.name !== req.params.id })
//       res.status(201).send('Account ' + req.params.name + 'was deleted.');
//     }
// });



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
