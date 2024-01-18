// Retrieve ID from homepage.html
const urlParams = new URLSearchParams(window.location.search);
const queryId = urlParams.get('selectedRecipe');

// GET for query id (name)
fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${queryId}&apiKey=19a1a36ee25a40f58a81525e4812cde9`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    console.log(queryId);
    const id = data.id;

    // Assigning variable to container element
    const ingredientsWidgetContainer = document.getElementById('ingredients-widget');

    // Make a GET for the ingredients list widget
    fetch(`https://api.spoonacular.com/recipes/${queryId}/ingredientWidget?apiKey=19a1a36ee25a40f58a81525e4812cde9`)
      .then(response => response.text())
      .then(widgetHtml => {
        ingredientsWidgetContainer.innerHTML = widgetHtml;
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Make a GET for recipe name, cooking steps
    fetch(`https://api.spoonacular.com/recipes/${queryId}/analyzedInstructions?apiKey=19a1a36ee25a40f58a81525e4812cde9`)
      .then(response => response.json())
      .then(data => {
        const recipeNameElement = document.querySelector('.selected-recipe');
        recipeNameElement.textContent = data.name;
        console.log(data);

        // Display the cooking steps
        const stepsList = document.getElementById('cooking-steps-container');
        data.steps.forEach(step => {
          const listItem = document.createElement('li');
          listItem.textContent = step.step;
          stepsList.appendChild(listItem);
        });

        // Display the ingredients
        const ingredientsList = document.getElementById('ingredients-list');
        data.ingredients.forEach(ingredient => {
          const listItem = document.createElement('li');
          listItem.textContent = ingredient.name;
          ingredientsList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });

    const addToFavoritesButton = document.getElementById('addToFavorites');
    addToFavoritesButton.addEventListener('click', function() {
      addToFavorites(id, data.name);
    });
  });

function addToFavorites(id, name) {
  // Get the existing favorites from local storage
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Check if the recipe is already in favorites
  const isAlreadyFavorite = favorites.some(favorite => favorite.id === id);

  if (isAlreadyFavorite) {
    console.log(`Recipe ${name} is already in favorites.`);
    return;
  }

  // Add the recipe to favorites
  favorites.push({ id, name });

  // Save the updated favorites to local storage
  localStorage.setItem('favorites', JSON.stringify(favorites));

  console.log(`Recipe ${name} with ID ${id} added to favorites!`);
}

// Event listener for Recipe Guide heading
document.querySelector('.recipe-guide a').addEventListener('click', function(event) {
  event.preventDefault();
  window.location.href = 'index.html';
});

// Event listener for Favorite Recipes heading
document.querySelector('.mr-3 a').addEventListener('click', function(event) {
  event.preventDefault();
  window.location.href = 'index.html';
});