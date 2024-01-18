const toggler = document.getElementsByClassName("caret");
const nested = document.getElementsByClassName("nested");
const search = document.getElementById("search");
const submit = document.getElementById("submit");
const filters = document.getElementsByClassName("filters");
const gridContainer = document.getElementById("grid-container")
const idList = JSON.parse(localStorage.getItem("idList")) || [];

var api = "6825ac17c3144b07877801b0fc040efc";
var i;

let intolerances = [];
let cuisine = [];
let diet = [];

async function callApi(requestUrl) {
  fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        data.results.forEach(result => {
            createCard(result.image, result.title);
        })
    });
}

function createCard(image, title) {
    const div = document.createElement("div");
    const a = document.createElement("a");
    const img = document.createElement("img");
    const p = document.createElement("p");

    gridContainer.appendChild(div);
    div.appendChild(a);
    a.appendChild(img);
    a.appendChild(p);

    div.classList.add("grid-item");

    a.href = "#";
    img.src = image;

    img.setAttribute("style", "width:-moz-available; width:-webkit-fill-available;")

    p.textContent = title;
}


for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function () {
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

submit.addEventListener("click", function () {
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
  let link = `https://api.spoonacular.com/recipes/complexSearch/?q=${search.value}&cuisine=${cuisine}&intolerances=${intolerances}&diet=${diet}&apiKey=${api}&number=20`;

  callApi(link)
  console.log("Hello")
});
