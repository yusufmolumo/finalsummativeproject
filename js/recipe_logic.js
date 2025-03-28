// Ensure jQuery is loaded
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

    // Fetch Recipe Data
    function fetchRecipeData(recipeName) {
        $.ajax({
            url: `http://localhost:3000/recipes?recipeName=${encodeURIComponent(recipeName)}`,
            type: 'GET',
            success: function(data) {
                if (data.length > 0) {
                    const recipe = data[0];
                    updateRecipeContent(recipe);
                    addToRecentRecipes(recipe.recipeName);
                } else {
                    console.error('Recipe not found');
                    $('#recipe-description').text('Recipe data not available.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching recipe:', error);
                $('#recipe-description').text('Error loading recipe data.');
            }
        });
    }

    function updateRecipeContent(recipe) {
        // Update static fields with fallback
        $('#recipe-title').text(recipe.recipeName || 'Falooda');
        $('#recipe-image').attr('src', recipe.image || '../../assets/cusines/recipes/drinks/drinks_falooda.jpg');
        $('#prep-time').text(recipe.prepTime || '15mins');
        $('#steps-count').text(`${recipe.steps.split('\n').length} steps` || '12 steps');
        $('#difficulty').text(recipe.difficulty || 'Intermediate');
        $('#vnv').text(recipe.vnv || 'Veg').css('background-color', recipe.vnv === 'Non-Veg' ? 'red' : 'green').css('border-color', recipe.vnv === 'Non-Veg' ? 'red' : 'green');
        $('#calories').text(recipe.nutrition?.calories || '407kcal');
        $('#fat').text(recipe.nutrition?.fat || '142g');
        $('#protein').text(recipe.nutrition?.protein || '42g');
        $('#serves').text(recipe.serves || '1 person');

        // Update dynamic fields
        $('#recipe-description').text(recipe.description || 'Not quite fit for a bowl but more than a drink, I call falooda a “dessert drink.” It is just not simply a drink that you can sip away because you have to eat some of the edible layers, too. Enjoy this dessert drink with a spoon!');

        const $ingredientsList = $('#ingredients-list');
        $ingredientsList.empty();
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(ingredient => {
                $ingredientsList.append(`
                    <div class="ingredient-item">
                        <h3>${ingredient.name}</h3>
                        <p>${ingredient.quantity}</p>
                    </div>
                `);
            });
        }

        const $stepsList = $('#steps-list');
        $stepsList.empty();
        if (recipe.steps) {
            recipe.steps.split('\n').forEach(step => {
                if (step.trim()) $stepsList.append(`<li>${step.trim()}</li>`);
            });
        }

        $('#recipe-video').attr('src', recipe.video || 'https://www.youtube.com/embed/rYhwOJaBGbU');
    }

    // Recent Recipes Tracking
    function addToRecentRecipes(recipeName) {
        let recentRecipes = JSON.parse(localStorage.getItem('recentRecipes')) || [];
        recentRecipes = recentRecipes.filter(name => name !== recipeName); // Remove if already exists
        recentRecipes.unshift(recipeName); // Add to start
        if (recentRecipes.length > 5) recentRecipes.pop(); // Limit to 5
        localStorage.setItem('recentRecipes', JSON.stringify(recentRecipes));
    }

    // Add Font Awesome dynamically
    $('head').append(`<!--Font Awesome Icons-->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>`);

    // Review System
    const reviewSystem = `
        <table width="fit-content" style="margin-left: auto; margin-right: auto;">
            <tr>
                <td>
                    <div class="recipe_review" aria-label="Meet our Chef">
                        <h2 style="
                            font-size: 2.25rem;
                            background-image: linear-gradient(315deg, #fffb00 40%, #ff00ff 74%);
                            background-clip: text;
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            text-align: center;"
                        >Meet our Chef</h2>
                        <table style="text-align: center; margin-left: auto; margin-right: auto;">
                            <tr>
                                <td><img src="../../assets/chef/chef.png" height="150" width="120" alt="Chef Gusteau"></td>
                                <td>
                                    <div class="ingredient-item" style="padding: 15px;">
                                        <h3>Chef Gusteau</h3>
                                        <p>Ratatouille [2007 - present]</p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
                <td>
                    <div class="recipe_review" aria-label="Rate this recipe">
                        <h1>Rate Our Recipe</h1>
                        <div class="review">
                            <div class="post" style="display: none;">
                                <div class="text">Thanks for rating the recipe!</div>
                                <div class="edit">EDIT REVIEW</div>
                            </div>
                            <div class="star-widget">
                                <input type="radio" name="rate" id="rate-5" value="5">
                                <label for="rate-5" class="fas fa-star"></label>
                                <input type="radio" name="rate" id="rate-4" value="4">
                                <label for="rate-4" class="fas fa-star"></label>
                                <input type="radio" name="rate" id="rate-3" value="3">
                                <label for="rate-3" class="fas fa-star"></label>
                                <input type="radio" name="rate" id="rate-2" value="2">
                                <label for="rate-2" class="fas fa-star"></label>
                                <input type="radio" name="rate" id="rate-1" value="1">
                                <label for="rate-1" class="fas fa-star"></label>
                                <form action="#" id="review-form">
                                    <header aria-live="polite"></header>
                                    <div class="textarea">
                                        <textarea cols="30" placeholder="Describe your Cooking experience" aria-label="Review text"></textarea>
                                    </div>
                                    <div class="btn">
                                        <button type="submit" aria-label="Share review">Share</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>`;
    $('.contact-us').before(reviewSystem);

    // Review System Interactivity
    $('.star-widget input').on('change', function() {
        const rating = $(this).val();
        $('.star-widget label').each(function() {
            const labelRating = $(this).attr('for').split('-')[1];
            $(this).toggleClass('active', labelRating <= rating);
        });
    });

    $('#review-form').on('submit', function(event) {
        event.preventDefault();
        const rating = $('.star-widget input:checked').val();
        const reviewText = $('.textarea textarea').val().trim();
        const recipeName = $('#recipe-title').text();

        if (!rating) {
            alert('Please select a rating!');
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/ratings',
            type: 'POST',
            data: JSON.stringify({ recipeName, rating, review: reviewText }),
            contentType: 'application/json',
            success: function() {
                $('.star-widget').hide();
                $('.post').show();
                $('.post .text').text(`Thanks for rating ${recipeName} ${rating} stars!`);
            },
            error: function(xhr, status, error) {
                console.error('Error saving review:', error);
                alert('Failed to submit review. Please try again.');
            }
        });
    });

    $('.edit').on('click', function() {
        $('.star-widget').show();
        $('.post').hide();
        $('.star-widget input').prop('checked', false);
        $('.star-widget label').removeClass('active');
        $('.textarea textarea').val('');
    });

    // Dynamic Ingredients Personalization
    $('.recipe_about p:contains("person")').after(`
        <h2 style="width: 500px; padding-left: 5px; padding-right: 5px;">Personalize Ingredients</h2>
        <input id="n" min="1" type="number" placeholder="Enter No of Serves" style="height: 100%; width: fit-content; text-align: center; font-size: large; font-family: 'Poppins'; color: white; background-color: black; border: none; padding: 5px; border-radius: 25px;" aria-label="Number of servings">
    `);

    const $ingredientItems = $('.ingredient-item');
    let originalList = [];
    $ingredientItems.each(function() {
        originalList.push($(this).find('p').text());
    });
    const baseServes = parseInt($('.recipe_about p:contains("person")').text()) || 1;

    function updateIngredients() {
        const n = parseInt($('#n').val()) || baseServes;
        const factor = n / baseServes;

        $ingredientItems.each(function(index) {
            const $p = $(this).find('p');
            $p.text(originalList[index]);
            const temp = $p.text().split(' ');
            for (let i = 0; i < temp.length; i++) {
                const num = parseFloat(temp[i]);
                if (!isNaN(num) && n) {
                    temp[i] = (num * factor).toPrecision(2);
                    if (parseInt(temp[i]) === parseFloat(temp[i])) temp[i] = parseInt(temp[i]);
                }
            }
            $p.text(temp.join(' '));
        });
    }

    $('#n').on('keyup change', updateIngredients);

    // Print Button
    $('.recipe_card_outline a').after(`
        <button class="btn-primary" type="button" style="margin: 3px;" aria-label="Print recipe">Print Recipe</button>
    `);

    $('.recipe_card_outline button').on('click', function() {
        window.print();
    });

    // Initialize page with recipe data
    const recipeName = $('.recipe_card_outline h1').text();
    fetchRecipeData(recipeName);
});