
$(document).ready(function() {
    // Theme Toggle Functionality
    function setTheme(theme) {
        if (theme === 'dark') {
            $('body').addClass('dark-theme');
            document.cookie = "theme=dark; path=/; max-age=31536000"; // 1 year expiry
        } else {
            $('body').removeClass('dark-theme');
            document.cookie = "theme=light; path=/; max-age=31536000";
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function applyTheme() {
        const theme = getCookie('theme') || 'light';
        setTheme(theme);
    }

    $('#theme-toggle').on('click', function() {
        const currentTheme = getCookie('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // Apply theme on page load
    applyTheme();

    // Data Structures
    let cuisineData = [];
    let recipeData = [];

    // Fetch Cuisines and Recipes from API
    function fetchCuisines() {
        $.ajax({
            url: 'http://localhost:3000/cuisines',
            type: 'GET',
            success: function(data) {
                cuisineData = data;
                if ($('#cuisines').length) {
                    populateCuisines(data); // For index.html
                }
                if ($('#cuisine-map').length) {
                    populateCuisineMap(data); // For map.html
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching cuisines:', error);
                $('#cuisines .cards, #cuisine-map').html('<p>Error loading cuisines.</p>');
            }
        });
    }

    function fetchRecipes() {
        $.ajax({
            url: 'http://localhost:3000/recipes',
            type: 'GET',
            success: function(data) {
                recipeData = data;
                if ($('#latest_recipes').length) {
                    populateLatestRecipes(data.slice(0, 3)); // For index.html
                }
                populateSearchIndex();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching recipes:', error);
                $('#latest_recipes .cards').html('<p>Error loading latest recipes.</p>');
            }
        });
    }

    // Populate UI
    function populateCuisines(cuisines) {
        const $cuisineSection = $('#cuisines .cards');
        $cuisineSection.empty();
        cuisines.forEach(cuisine => {
            const card = `
                <div class="card" role="article" aria-label="${cuisine.name} cuisine">
                    <img src="${cuisine.image || '../../assets/cusines/default_cuisine.jpg'}" alt="${cuisine.name}">
                    <div class="content">
                        <h3>${cuisine.name}</h3>
                        <p>${cuisine.description.substring(0, 100)}...</p>
                        <a href="${cuisine.link || `${cuisine.name.toLowerCase().replace(/\s+/g, '_')}_map.html`}" class="btn-primary" aria-label="Explore ${cuisine.name} recipes">View Recipes</a>
                    </div>
                </div>`;
            $cuisineSection.append(card);
        });
    }

    function populateLatestRecipes(recipes) {
        const $latestRecipes = $('#latest_recipes .cards');
        $latestRecipes.empty();
        recipes.forEach(recipe => {
            const card = `
                <div class="card" role="article" aria-label="${recipe.recipeName} recipe">
                    <img src="${recipe.image || '../../assets/cusines/default_recipe.jpg'}" alt="${recipe.recipeName}">
                    <div class="content">
                        <h3>${recipe.recipeName}</h3>
                        <p>${recipe.description.substring(0, 100)}...</p>
                        <a href="recipes/drinks/${recipe.recipeName.toLowerCase().replace(/\s+/g, '_')}.html" class="btn-primary" aria-label="View ${recipe.recipeName} recipe">View Recipe</a>
                    </div>
                </div>`;
            $latestRecipes.append(card);
        });
    }

    function populateCuisineMap(cuisines) {
        const $cuisineMap = $('#cuisine-map');
        $cuisineMap.empty();
        cuisines.forEach(cuisine => {
            const card = `
                <div class="card" role="article" aria-label="${cuisine.name} cuisine">
                    <img src="${cuisine.image || '../../assets/cusines/default_cuisine.jpg'}" alt="${cuisine.name}">
                    <div class="content">
                        <h3>${cuisine.name}</h3>
                        <p>${cuisine.description.substring(0, 100)}...</p>
                        <a href="${cuisine.link || `${cuisine.name.toLowerCase().replace(/\s+/g, '_')}_map.html`}" class="btn-primary" aria-label="Explore ${cuisine.name} recipes">View Recipes</a>
                    </div>
                </div>`;
            $cuisineMap.append(card);
        });
        // Track clicks for recent cuisines
        $('#cuisine-map .card a').on('click', function() {
            const cuisineName = $(this).closest('.card').find('h3').text();
            addToRecentCuisines(cuisineName);
        });
    }

    // Search Functionality
    let searchIndex = {};

    function populateSearchIndex() {
        searchIndex = {};
        cuisineData.forEach(cuisine => {
            searchIndex[cuisine.name] = recipeData
                .filter(recipe => recipe.category === cuisine.name)
                .map(recipe => ({
                    name: recipe.recipeName,
                    html: `
                        <div class="recipe-card">
                            <img src="${recipe.image || '../../assets/cusines/default_recipe.jpg'}" alt="${recipe.recipeName}">
                            <h4>${recipe.recipeName}</h4>
                            <p>${recipe.description.substring(0, 100)}...</p>
                            <a href="recipes/drinks/${recipe.recipeName.toLowerCase().replace(/\s+/g, '_')}.html" class="btn-primary">View Recipe</a>
                        </div>`
                }));
        });
    }

    window.searchList = function() {
        const $key = $('input[type="text"]'); // Assumes search input in index.html
        const keyValue = $key.val().trim().toLowerCase();
        const $items = $('.variable_zone');
        const $resultsContainer = $('#search_recipes');

        // Clear previous results
        $('.search_result, .search_result_recipe').remove();

        if (keyValue === '') {
            $items.show();
            return;
        }

        $items.hide();
        let seenCuisines = [];
        let seenRecipes = [];

        if (keyValue === 'all') {
            $items.show();
            return;
        }

        // Search cuisines and recipes
        $.each(searchIndex, function(cuisine, recipes) {
            // Cuisine match
            if (cuisine.toLowerCase().includes(keyValue) && !seenCuisines.includes(cuisine)) {
                const recipeCards = recipes.map(r => r.html).join('');
                $resultsContainer.after(`
                    <div class="search_result" role="region" aria-label="Search results for ${cuisine}">
                        <h2>${cuisine}</h2>
                        <div class="recipe_list">${recipeCards}</div>
                    </div>`);
                seenCuisines.push(cuisine);
            }

            // Recipe match
            recipes.forEach(recipe => {
                if (recipe.name.toLowerCase().includes(keyValue) && !seenRecipes.includes(recipe.name)) {
                    if (seenRecipes.length === 0) {
                        $resultsContainer.after(`
                            <div class="search_result_recipe" role="region" aria-label="Related recipe books">
                                <h2>Related Recipe Books</h2>
                            </div>`);
                    }
                    $('.search_result_recipe').last().append(`
                        <div class="recipe_list">${recipe.html}</div>`);
                    seenRecipes.push(recipe.name);
                }
            });
        });
    };

    // Recent Cuisines Tracking (for map.html)
    function addToRecentCuisines(cuisineName) {
        let recentCuisines = JSON.parse(localStorage.getItem('recentCuisines')) || [];
        recentCuisines = recentCuisines.filter(name => name !== cuisineName);
        recentCuisines.unshift(cuisineName);
        if (recentCuisines.length > 5) recentCuisines.pop();
        localStorage.setItem('recentCuisines', JSON.stringify(recentCuisines));
        updateRecentCuisinesDisplay();
    }

    function updateRecentCuisinesDisplay() {
        const recentCuisines = JSON.parse(localStorage.getItem('recentCuisines')) || [];
        $('#recent-cuisine-list').text(recentCuisines.join(', ') || 'None yet');
    }

    // Bind search event
    $('input[type="text"]').on('keyup', searchList);

    // Initialize page
    fetchCuisines();
    fetchRecipes();
    if ($('#cuisine-map').length) {
        updateRecentCuisinesDisplay();
        $('#cuisine-map area').on('click', function() {
            const cuisineName = $(this).attr('data-cuisine');
            if (cuisineName) addToRecentCuisines(cuisineName);
        });
    }
});