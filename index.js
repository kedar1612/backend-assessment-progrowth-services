
// . Require necessary modules
const express = require('express');
const mongoose = require('mongoose');

// . Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moviesDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// . Define data schema
const movieSchema = new mongoose.Schema({
  name: String,
  img: String,
  summary: String
});

const Movie = mongoose.model('Movie', movieSchema);

// . Create Express app
const app = express();
app.use(express.json());

// . Create routes for CRUD operations
// Create a new movie
app.post('/movies', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a movie
app.put('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// . Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));