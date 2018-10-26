let fs = require('fs');
let recipes = JSON.parse(fs.readFileSync('JSON/Recipes.json'));

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors')
let app = express();
let server = app.listen(3000, listening);

function listening() {
  console.log('Listening...');
}
app.use(express.static('website'));
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(cors());

app.get('/all', getAll)

function getAll(request, response) {
  let data = {
    recipes: recipes.recipes
  }
  response.send(data);
}

app.get('/all/recipes', allRecs);

function allRecs(request, response) {
  let recs = [];
  for (let i = 0; i < recipes.recipes.length; i++) recs.push(recipes.recipes[i].name);
  recs.sort();
  reply = {
    status: "complete",
    recipe: recs
  }
  response.send(reply);
}

app.get('/all/ingredients', allIngs);

function allIngs(request, response) {
  let ings = [];
  let filtIngs = [];

  for (let i = 0; i < recipes.recipes.length; i++) {
    for (let j = 0; j < recipes.recipes[i].ingredients.length; j++) {
      ings.push(recipes.recipes[i].ingredients[j].name);
    }
  }
  ings.sort();
  for (k = 0; k < ings.length; k++) {
    if (ings[k] !== ings[k + 1]) {
      filtIngs.push(ings[k]);
    }
  }

  reply = {
    status: "complete",
    ingredients: filtIngs
  }
  response.send(reply);
}
app.post('/add', addRecipe);

function addRecipe(req, res) {
  data = JSON.parse(req.body);
  recipes.recipes.push(data);
  let recipeData = JSON.stringify(recipes, null, 2);
  console.log(recipeData);
  fs.writeFile('Recipes.json', recipeData, (err) => {
    if (err) throw err;
  })
  console.log(recipeData);
  res.send(data);
}

app.get('/search/:recipe', searchRecipes);

function searchRecipes(request, response) {
  let recipe = request.params.recipe;
  let reply;
  let ings = [];

  for (let i = 0; i < recipes.recipes.length; i++) {
    if (recipes.recipes[i].name === recipe) {
      for (let j = 0; j < recipes.recipes[i].ingredients.length; j++) {
        ings.push([recipes.recipes[i].ingredients[j].name, recipes.recipes[i].ingredients[j].qty, recipes.recipes[i].ingredients[j].unit]);
      }
      reply = {
        status: 'found',
        recipe: recipe,
        ingredients: ings
      }
      break;
    } else {
      reply = {
        status: 'Not Found',
        recipe: recipe
      }
    }
  }
  response.send(reply);
}