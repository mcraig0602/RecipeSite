let fs = require('fs');
let recipes = JSON.parse(fs.readFileSync('JSON/Recipes.json'));
console.log('Server is started!!!');

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

app.get('/search/:recipe', searchRecipes);

function searchRecipes(request, response) {
  let recipe = request.params.recipe;
  let reply;
  let ings = [];
  let temp = recipes.recipes[0].name
  let len = recipes.recipes.length
  console.log(recipe)
  for (let i = 0; i < len; i++) {
    if (recipes.recipes[i].name = recipe) {
      //recipe = recipes.recipes[i].name
      console.log(recipe)
      for (j = 0; j < recipes.recipes[i].ingredients.length; j++) {
        ings.push(recipes.recipes[i].ingredients[j]);
      }
      reply = {
        status: 'found',
        recipe: recipe,
        ingredients: ings
      }
      break
    }
  }
  response.send(reply);
}