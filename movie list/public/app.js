const API_URL = '/api/movies';

// DOM Elements
const movieForm = document.getElementById('movie-form');
const moviesList = document.getElementById('movies-list');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const emptyState = document.getElementById('empty-state');

// Form input elements
const movieIdInput = document.getElementById('movie-id');
const titleInput = document.getElementById('title');
const directorInput = document.getElementById('director');
const yearInput = document.getElementById('year');
const genreInput = document.getElementById('genre');
const ratingInput = document.getElementById('rating');

// State
let isEditMode = false;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    movieForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
});

// Load all movies
async function loadMovies() {
    try {
        showLoading(true);
        hideError();
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch movies');
        
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        showError('Failed to load movies. Please try again.');
        console.error('Error loading movies:', error);
    } finally {
        showLoading(false);
    }
}

// Display movies in grid
function displayMovies(movies) {
    if (movies.length === 0) {
        moviesList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    moviesList.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
}

// Create movie card HTML
function createMovieCard(movie) {
    const ratingStars = '⭐'.repeat(Math.round(movie.rating / 2));
    return `
        <div class="movie-card">
            <div class="movie-header">
                <h3 class="movie-title">${escapeHtml(movie.title)}</h3>
                <div class="movie-rating">${movie.rating}/10 ${ratingStars}</div>
            </div>
            <div class="movie-info">
                <p><strong>Director:</strong> ${escapeHtml(movie.director)}</p>
                <p><strong>Year:</strong> ${movie.year}</p>
                <p><strong>Genre:</strong> ${escapeHtml(movie.genre)}</p>
            </div>
            <div class="movie-actions">
                <button class="btn btn-edit" onclick="editMovie('${movie._id}')">Edit</button>
                <button class="btn btn-delete" onclick="deleteMovie('${movie._id}')">Delete</button>
            </div>
        </div>
    `;
}

// Handle form submission (Add or Update)
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const movieData = {
        title: titleInput.value.trim(),
        director: directorInput.value.trim(),
        year: parseInt(yearInput.value),
        genre: genreInput.value.trim(),
        rating: parseFloat(ratingInput.value) || 0
    };

    try {
        if (isEditMode) {
            await updateMovie(movieIdInput.value, movieData);
        } else {
            await addMovie(movieData);
        }
        resetForm();
        loadMovies();
    } catch (error) {
        showError(isEditMode ? 'Failed to update movie' : 'Failed to add movie');
        console.error('Error submitting form:', error);
    }
}

// Add new movie
async function addMovie(movieData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
    });
    
    if (!response.ok) throw new Error('Failed to add movie');
    return response.json();
}

// Update existing movie
async function updateMovie(id, movieData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
    });
    
    if (!response.ok) throw new Error('Failed to update movie');
    return response.json();
}

// Edit movie - load data into form
async function editMovie(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch movie');
        
        const movie = await response.json();
        
        movieIdInput.value = movie._id;
        titleInput.value = movie.title;
        directorInput.value = movie.director;
        yearInput.value = movie.year;
        genreInput.value = movie.genre;
        ratingInput.value = movie.rating;
        
        isEditMode = true;
        formTitle.textContent = 'Edit Movie';
        submitBtn.textContent = 'Update Movie';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll to form
        movieForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        showError('Failed to load movie for editing');
        console.error('Error editing movie:', error);
    }
}

// Delete movie
async function deleteMovie(id) {
    if (!confirm('Are you sure you want to delete this movie?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete movie');
        
        loadMovies();
    } catch (error) {
        showError('Failed to delete movie');
        console.error('Error deleting movie:', error);
    }
}

// Reset form to add mode
function resetForm() {
    movieForm.reset();
    movieIdInput.value = '';
    isEditMode = false;
    formTitle.textContent = 'Add New Movie';
    submitBtn.textContent = 'Add Movie';
    cancelBtn.style.display = 'none';
    hideError();
}

// Utility functions
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
