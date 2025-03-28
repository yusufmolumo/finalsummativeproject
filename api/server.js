// Import required modules
const jsonServer = require('json-server');
const path = require('path');


const server = jsonServer.create();

// Set up router with db.json
const router = jsonServer.router(path.join(__dirname, 'db.json'));

// Default middlewares (logging, static files, CORS, etc.)
const middlewares = jsonServer.defaults({
    static: path.join(__dirname, '../'), // Serve static files (e.g., HTML, CSS, JS) from root
    noCors: false, // Enable CORS for cross-origin requests
});

// Custom middleware for additional functionality
server.use(middlewares);

// Add custom routes or middleware (optional)
server.use(jsonServer.bodyParser); // Parse request bodies for POST/PUT

// Custom route: Simulate delay for realism (500ms)
server.use((req, res, next) => {
    setTimeout(next, 500); // Delay response to mimic real API
});

// Custom route: Validate recipe submission
server.post('/recipes', (req, res, next) => {
    const recipe = req.body;
    if (!recipe.name || !recipe.ingredients || !recipe.steps) {
        return res.status(400).json({
            error: 'Missing required fields: name, ingredients, or steps'
        });
    }
    recipe.id = Date.now(); // Assign unique ID
    recipe.createdAt = new Date().toISOString(); // Timestamp
    next(); // Proceed to default handler
});

// Custom route: Validate rating submission
server.post('/ratings', (req, res, next) => {
    const rating = req.body;
    if (!rating.recipeId || !rating.userId || !rating.rating) {
        return res.status(400).json({
            error: 'Missing required fields: recipeId, userId, or rating'
        });
    }
    if (rating.rating < 1 || rating.rating > 5) {
        return res.status(400).json({
            error: 'Rating must be between 1 and 5'
        });
    }
    rating.id = Date.now();
    rating.createdAt = new Date().toISOString();
    next();
});

// Custom route: Search recipes by name or cuisine
server.get('/recipes/search', (req, res) => {
    const db = router.db; // Access lowdb instance
    const { q } = req.query; // Query parameter (e.g., ?q=falooda)
    if (!q) {
        return res.status(400).json({ error: 'Search query required' });
    }
    const recipes = db.get('recipes')
        .filter(recipe =>
            recipe.name.toLowerCase().includes(q.toLowerCase()) ||
            recipe.cuisine.toLowerCase().includes(q.toLowerCase())
        )
        .value();
    res.json(recipes);
});

// Use the router
server.use(router);

// Set port
const PORT = process.env.PORT || 3000;

// Start server
server.listen(PORT, () => {
    console.log(`JSON Server is running on http://localhost:${PORT}`);
    console.log('Endpoints available:');
    console.log('- GET /recipes');
    console.log('- GET /recipes/:id');
    console.log('- POST /recipes');
    console.log('- GET /users');
    console.log('- GET /ratings');
    console.log('- POST /ratings');
    console.log('- GET /cuisines');
    console.log('- GET /recipes/search?q={query}');
});