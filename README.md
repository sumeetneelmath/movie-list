# Movie List App

A simple CRUD web application for managing your movie collection, built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features
- ✅ Add new movies with details (Title, Director, Year, Genre, Rating)
- 📋 View all movies in a responsive grid layout
- ✏️ Edit existing movie information
- ⭐ Rate movies (0-10 scale)
- 🗑️ Delete movies from your collection

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)

## Installation

1. Make sure MongoDB is running locally on `mongodb://localhost:27017`

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at: http://localhost:3000

## Project Structure
```
movie-list/
├── models/
│   └── Movie.js          # MongoDB schema for movies
├── public/
│   ├── index.html        # Frontend HTML
│   ├── app.js           # Frontend JavaScript
│   └── style.css        # Styling
├── server.js            # Express server & API routes
└── package.json
```

## API Endpoints

- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get a single movie
- `POST /api/movies` - Create a new movie
- `PUT /api/movies/:id` - Update a movie
- `DELETE /api/movies/:id` - Delete a movie

## Usage

1. **Add a Movie**: Fill out the form at the top with movie details and click "Add Movie"
2. **View Movies**: All movies are displayed in cards below the form
3. **Edit a Movie**: Click the "Edit" button on any movie card to load it into the form
4. **Delete a Movie**: Click the "Delete" button and confirm to remove a movie

## Technologies Used
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful API with JSON
