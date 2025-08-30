
function getRecipes() {
    return JSON.parse(localStorage.getItem("recipes")) || [];
}
function saveRecipes(recipes) {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

function renderRecipes(filter = "") {
    const recipes = getRecipes();
    const recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = "";

    let totalCalories = 0;

    recipes
        .filter(r => r.name.toLowerCase().includes(filter.toLowerCase()) || 
            r.ingredients.join(", ").toLowerCase().includes(filter.toLowerCase()))
        .forEach((recipe, index) => {
            const card = document.createElement("div");
            card.className = "recipe-card";
            if (recipe.favorite) card.classList.add("favorite");

            card.innerHTML = `
        <h3>${recipe.name}</h3>
        <p><b>Ingredients:</b> ${recipe.ingredients.join(", ")}</p>
        <p><b>Calories:</b> ${recipe.calories}</p>
        <button id="m" onclick="toggleFavorite(${index})">Favorite</button>
        <button id="m" onclick="editRecipe(${index})">Edit</button>
        <button id="m" onclick="deleteRecipe(${index})">Delete</button>
      `;

            recipeList.appendChild(card);

            if (recipe.favorite) totalCalories += parseInt(recipe.calories);
        });

    document.getElementById("totalCalories").innerText = totalCalories;
}

document.getElementById("recipeForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let recipes = getRecipes();

    const name = document.getElementById("name").value;
    const ingredients = document.getElementById("ingredients").value.split(",");
    const calories = document.getElementById("calories").value;
    const editIndex = document.getElementById("editIndex").value;

    if (editIndex) {
        recipes[editIndex] = { name, ingredients, calories, favorite: recipes[editIndex].favorite };
        document.getElementById("editIndex").value = "";
    } else {
        recipes.push({ name, ingredients, calories, favorite: false });
    }

    saveRecipes(recipes);
    renderRecipes();
    this.reset();
});

function editRecipe(index) {
    const recipe = getRecipes()[index];
    document.getElementById("name").value = recipe.name;
    document.getElementById("ingredients").value = recipe.ingredients.join(", ");
    document.getElementById("calories").value = recipe.calories;
    document.getElementById("editIndex").value = index;
}


function deleteRecipe(index) {
    let recipes = getRecipes();
    recipes.splice(index, 1);
    saveRecipes(recipes);
    renderRecipes();
}

function toggleFavorite(index) {
    let recipes = getRecipes();
    recipes[index].favorite = !recipes[index].favorite;
    saveRecipes(recipes);
    renderRecipes();
}

document.getElementById("search").addEventListener("input", (e) => {
    renderRecipes(e.target.value);
});

if (!localStorage.getItem("recipes")) {
    saveRecipes([
        { name: "Pasta", ingredients: ["noodles", "sauce"], calories: 400, favorite: false },
        { name: "Salad", ingredients: ["lettuce", "tomato"], calories: 150, favorite: true },
        { name: "Omelette", ingredients: ["eggs", "cheese"], calories: 250, favorite: false },
        { name: "Sandwich", ingredients: ["bread", "ham"], calories: 300, favorite: false },
        { name: "Soup", ingredients: ["chicken", "broth"], calories: 200, favorite: true }
    ]);
}

renderRecipes();
