// Ensure jQuery is loaded
$(document).ready(function() {
    let count = 1; // Track number of ingredients

    // Function to toggle theme between light and dark mode
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

    // Dynamic Ingredient Management
    window.addIngredient = function() {
        count += 1;
        const html = `
            <div class="ingredient-group new_ingredient_${count}" data-index="${count}">
                <input type="text" id="ingredient_${count}" name="ingredients[]" style="margin-top: 10px;" placeholder="Enter Ingredient ${count}" required aria-required="true" aria-label="Ingredient ${count}">
                <button type="button" class="remove-ingredient btn-primary" aria-label="Remove ingredient"><i class="material-icons">delete</i></button>
            </div>`;
        $('#ingredients').append(html);
        updateRemoveButtons();
    };

    window.removeIngredient = function() {
        if (count > 1) {
            $(`.new_ingredient_${count}`).remove();
            count -= 1;
            updateRemoveButtons();
        }
    };

    function updateRemoveButtons() {
        const $removeButtons = $('.remove-ingredient');
        $removeButtons.prop('disabled', count <= 1);
        $removeButtons.off('click').on('click', function() {
            const $group = $(this).closest('.ingredient-group');
            $group.remove();
            count--;
            updateRemoveButtons();
        });
    }

    // Form Validation and Submission
    window.validateAndSubmit = function() {
        const $form = $('#create_recipe_form');
        const $errors = $('#form-errors');
        $errors.empty();
        let flag = 1;

        // Validate all inputs
        const $inputs = $form.find('input, textarea, select');
        $inputs.each(function() {
            const $input = $(this);
            if ($input.prop('required') && !$input.val().trim()) {
                $input[0].setCustomValidity('Please Fill Out this Field!!');
                $errors.append(`<p>${$input.prev('label').text()} is required.</p>`);
                flag = 0;
            } else {
                $input[0].setCustomValidity('');
            }
        });

        // Validate email format
        const email = $form.find('#email').val().trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $form.find('#email')[0].setCustomValidity('Please enter a valid email!');
            $errors.append('<p>Please enter a valid email address.</p>');
            flag = 0;
        }

        // Validate file upload (optional)
        const fileInput = $form.find('#food_image')[0];
        const file = fileInput.files[0];
        if (file && !file.type.startsWith('image/')) {
            fileInput.setCustomValidity('Please upload a valid image file!');
            $errors.append('<p>Please upload a valid image file.</p>');
            flag = 0;
        } else if (file) {
            fileInput.setCustomValidity('');
        }

        if (flag === 0) {
            alert('Please Fill All Fields!');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('userName', $form.find('#name').val().trim());
        formData.append('email', email);
        formData.append('recipeName', $form.find('#recipe_name').val().trim());
        formData.append('description', $form.find('#description').val().trim());
        formData.append('steps', $form.find('#steps').val().trim());
        formData.append('category', $form.find('#category').val());
        formData.append('vnv', $form.find('#vnv').val());
        const ingredients = $form.find('input[name="ingredients[]"]').map(function() {
            return $(this).val().trim();
        }).get();
        ingredients.forEach((ingredient, index) => {
            if (ingredient) formData.append(`ingredients[${index}]`, ingredient);
        });
        if (file) formData.append('foodImage', file);

        // AJAX submission
        $.ajax({
            url: 'http://localhost:3000/recipes',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $form.hide();
                $('#submission-feedback').show();
                window.location.href = 'on_submit.html'; // Redirect instead of window.open
            },
            error: function(xhr, status, error) {
                $errors.append(`<p>Error submitting recipe: ${xhr.responseText || error}</p>`);
                alert('Submission failed! Please try again.');
            }
        });
    };

    // Initial setup
    updateRemoveButtons();

    // Ensure form submission triggers validation
    $('#create_recipe_form').on('submit', function(event) {
        event.preventDefault();
        validateAndSubmit();
    });
});