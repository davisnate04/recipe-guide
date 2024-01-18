// Retrieve ID from homepage.html
const urlParams = new URLSearchParams(window.location.search);
const queryId = urlParams.get(‘selectedRecipe’);
const apiKey = ‘e0d1d6a7494740a8b04492f03e59ebcc’
// GET for query id (name)
fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${queryId}&apiKey=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    console.log(‘complex search api’);
    console.log(data);
    console.log(queryId);
    // Assigning variable to container element
    const ingredientsWidgetContainer = document.getElementById(‘ingredients-widgets-container’)
    // Make a GET for the ingredients list widget
    //https://api.spoonacular.com/recipes/1082038/ingredientWidget
    fetch(`https://api.spoonacular.com/recipes/${queryId}/ingredientWidget?apiKey=${apiKey}&defaultCss=true`)
      .then(response => response.text())
      .then(widgetHtml => {
        // call parameter and
        console.log(‘ingrdent-widget API’);
        console.log(widgetHtml);
        ingredientsWidgetContainer.innerHTML = widgetHtml;
      })
      .catch(error => {
        console.error(‘Error:‘, error);
      });
      // tell which api call tocode use a weight
    // Make a GET for recipe name, cooking steps
    fetch(`https://api.spoonacular.com/recipes/${queryId}/analyzedInstructions?apiKey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        const recipeNameElement = document.querySelector(‘.selected-recipe’);
        recipeNameElement.textContent = data[0].name;
        console.log (“analyzedInstructions”)
        console.log(data);
        // Display the cooking steps
        const stepsList = document.getElementById(‘cooking-steps-container’);
        data[0].steps.forEach(step => {
          const listItem = document.createElement(‘li’);
          listItem.textContent = step.step;
          stepsList.appendChild(listItem);
        });
        // Display the ingredients
        const ingredientsList = document.getElementById(‘ingredients-list’);
        data[0].ingredients.forEach(ingredient => {
          const listItem = document.createElement(‘li’);
          listItem.textContent = ingredient.name;
          ingredientsList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error(‘Error:‘, error);
      });
// Event listener for Recipe Guide heading
document.querySelector(‘.recipe-guide a’).addEventListener(‘click’, function(event) {
  event.preventDefault();
  window.location.href = ‘index.html’;
});
// Event listener for Favorite Recipes heading
document.querySelector(‘.mr-3 a’).addEventListener(‘click’, function(event) {
  event.preventDefault();
  window.location.href = ‘./index.html?favorites’;
});
  })
