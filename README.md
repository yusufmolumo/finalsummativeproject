# Dish-A-Day-Recipe-Website

**Dish a Day** is a web application designed to explore global cuisines, discover recipes, and share your own culinary creations. Learn Cook Share. Cooking Made Easy. Say good bye to long and frustrating food blogs and recipe videos.<br>Access our recipe cards to prepare any dish in minutes. This app integrates backend data, interactive features, user personalization, accessibility, and responsive design to provide a seamless user experience.

---

## Table of Contents
- [Features](#features)
- [Project Phases](#project-phases)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Contact](#contact)

---

## Features
- **Cuisine Exploration**: Browse cuisines by region using an interactive map (`map.html`).
- **Recipe Discovery**: Search and view detailed recipes (e.g., `falooda.html`) with ingredients, steps, and ratings.
- **Recipe Creation**: Submit your own recipes via a form (`create_recipe.html`) with dynamic ingredient fields.
- **User Personalization**: Toggle between light and dark themes for a customized experience.
- **Interactive Elements**: Hover effects, star ratings, and a responsive search bar enhance usability.
- **Accessibility**: Keyboard navigation, high-contrast colors, and ARIA attributes ensure inclusivity.
- **Responsive Design**: Adapts seamlessly to desktop, tablet, and mobile screens.

---

## Project Phases
The app was developed in five phases, aligning with the project requirements:

1. **Backend Data Integration**:
   - Integrated a mock API (`api/db.json`) to fetch cuisines and recipes dynamically.
   - Used `index_logic.js` and `recipe_logic.js` to populate content.

2. **Interactive Features**:
   - Implemented hover animations, star ratings (`.star-widget`), and a collapsible search bar.
   - Added dynamic ingredient fields in `form_logic.js`.

3. **User Personalization**:
   - Added theme toggling (light/dark) with `.dark-theme` class in SCSS and JS logic.

4. **Accessibility and Responsiveness**:
   - Enhanced with focus states (`@include accessible-focus`), high-contrast colors (e.g., `$error-color`), and media queries.
   - Tested across screen sizes (desktop, tablet, mobile).

5. **Code Optimization**:
   - Refactored SCSS into modular files (`_variables.scss`, `_mixins.scss`, etc.) for maintainability.
   - Documented code with this README and inline comments.

---

## Installation
To run "Dish a Day" locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/dish-a-day.git
   cd dish-a-day

2. **Install Dependencies**:
    Ensure Node.js and npm are installed.
    Install Sass for SCSS compilation:
    ```bash
    npm install -g sass

3. **Compile SCSS**:
    Compile main.scss to CSS:
    ```bash
    sass css/main.scss css/main.css

4. **Serve the App**:
    Use a local server (e.g., Live Server in VS Code or python -m http.server) to view the app in a browser:
    ```bash
    python -m http.server 8000

## Usage

**Home Page (index.html)**: Search for recipes and browse recent cuisines.
**Map Page (map.html)**: Explore cuisines by region on an interactive map.
**Recipe Page**: View recipe details, rate, and leave reviews.
**Create Recipe (create_recipe.html)**: Submit a new recipe with ingredients and steps.
**Submission Feedback (on_submit.html)**: Confirmation page after recipe submission.

## Technologies Used

**HTML5**: Structure and semantics.
**SCSS**: Modular, maintainable styling with variables and mixins.
**JavaScript**: Dynamic functionality (search, ratings, form handling).
**jQuery**: DOM manipulation (assumed from .hide()/.show() in original styling).

## License

This project is licensed under the MIT License. See the  file for details.

## Contact

**Developers**: Yusuf Molumo, Belinda Larose
**Email**: y.molumo@alustudent.com

## The Team

- `Belinda Larose`
- `Yusuf Molumo`

