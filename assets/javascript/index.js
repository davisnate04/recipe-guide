const toggler = document.getElementsByClassName("caret");
const nested = document.getElementsByClassName("nested");
const filters = document.getElementsByClassName("filters");
const favoriteBtn = document.getElementsByClassName("favoriteBtn");
const search = document.getElementById("search");
const submit = document.getElementById("submit");
const gridItem = document.getElementsByClassName("grid-item");
const gridContainer = document.getElementById("grid-container")
const urlParams = new URLSearchParams(window.location.search)
let favoriteList = JSON.parse(localStorage.getItem("myFavorites")) || [];

var api = "e0d1d6a7494740a8b04492f03e59ebcc ";
var i;

let intolerances = [];
let cuisine = [];
let diet = [];

if (urlParams.has('favorites')) {
    for (const child of gridItem) {
      child.style.display = "none";
    }
    for (i = 0; i < favoriteList.length; i++) {
      createCard(favoriteList[i].src, favoriteList[i].title, favoriteList[i].url, true);
    
    }
}

function callApi(requestUrl) {
  fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        data.results.forEach(result => {
            createCard(result.image, result.title, `https://davisnate04.github.io/recipe-guide/recipe-page.html?selectedRecipe=${result.id}`, false);
        })
    });
}

for (const child of toggler) {
  child.addEventListener("click", function () {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}

for (const child of nested) {
  for (i = 0; i < child.children.length; i++) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("class", "filters");

    child.children[i].appendChild(checkbox);
  }
}


for (i = 0; i < favoriteBtn.length; i++) {
  var findFavorite = favoriteList.find(function(test) {return test.url == favoriteBtn[i].parentElement.children[1].href})

  console.log(favoriteBtn[i]);

  if (findFavorite) {
    favoriteBtn[i].dataset.favorited = "true";
    favoriteBtn[i].innerHTML = "&#9733;";
  }
  favoriteBtn[i].addEventListener("click", function () {
    favoriteRecipe(this);
  })
}

function createCard(image, title, url, favorited) {
    const div = document.createElement("div");
    const a = document.createElement("a");
    const img = document.createElement("img");
    const p = document.createElement("p");
    const button = document.createElement("button");

    gridContainer.appendChild(div);
    div.appendChild(a);
    div.appendChild(button);
    a.appendChild(img);
    a.appendChild(p);

    div.classList.add("grid-item");
    button.classList.add("favoriteBtn");

    a.href = url;
    img.src = image;

    img.setAttribute("style", "width:-moz-available; width:-webkit-fill-available;")
    button.dataset.favorited = `${favorited}`;

    button.addEventListener("click", function () {
      favoriteRecipe(this);
    })

    if (button.dataset.favorited === "true") {
      button.innerHTML = "&#9733;";
    } else if (button.dataset.favorited === "false") {
      button.innerHTML = "&#9734;";
    }

    p.textContent = title;
}

function favoriteRecipe(favoriteButton) {
    let favorites = {
      "url": favoriteButton.parentElement.children[0].href,
      "src": favoriteButton.parentElement.children[0].children[0].src,
      "title":  favoriteButton.parentElement.children[0].children[1].textContent
    }

    if (favoriteButton.dataset.favorited == "false") {
      if (!getFavorites) {
        favoriteList.push(favorites);
      }
      favoriteButton.innerHTML = "&#9733;";
      favoriteButton.dataset.favorited = "true";
    } else {
      for (i = favoriteList.length - 1; i >= 0; i--) {
        var getFavorites = favoriteList.find(function(favorite) {return favorite.href === favorites.href});
        
        if (getFavorites) {
          favoriteList = favoriteList.filter(favorite => favorite !== getFavorites);
        }
      } 
      favoriteButton.innerHTML = "&#9734;";
      favoriteButton.dataset.favorited = "false";
    }

  localStorage.setItem("myFavorites", JSON.stringify(favoriteList));
}

function createFilter() {
    for (child of filters) {
        let parent = child.parentElement.parentElement.parentElement;
        let setChild = child.previousSibling.data;
    
        if (child.closest("li")) {
          if (child.checked) {
            switch (parent.id) {
              case "cuisine":
                if (!cuisine.includes(setChild)) {
                  cuisine.push(setChild);
                }
                break;
    
              case "intolerances":
                if (!intolerances.includes(setChild)) {
                    intolerances.push(setChild);
                }
                break;
                case "diet":
                if (!diet.includes(setChild)) {
                    diet.push(setChild);
                }
                break;
              default:
                return;
            }
          } else {
            switch (parent.id) {
              case "cuisine":
                cuisine = cuisine.filter((c) => c !== setChild);
                break;
    
              case "intolerances":
                intolerances = intolerances.filter((c) => c !== setChild);
                break;
                case "diet":
                diet = diet.filter((c) => c !== setChild);
                break;
              default:
                return;
            }
          }
        }
      }
}

submit.addEventListener("click", function () {
    createFilter();
    for (const child of gridItem) {
      child.style.display = "none";
    }
  let link = `https://api.spoonacular.com/recipes/complexSearch/?query=${search.value}&cuisine=${cuisine}&intolerances=${intolerances}&diet=${diet}&apiKey=${api}&number=25`;

  callApi(link);
});
