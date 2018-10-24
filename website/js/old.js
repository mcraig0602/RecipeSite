$("#selectRecipe").change(function (e) {
  let item = e.currentTarget.value
  document.getElementById('blankholder').style.visibility = "hidden";
  document.getElementById('blankholder').style.position = "absolute";
  clearIngs();
  $.getJSON("JSON/Recipes.json", function (result) {
    let recipes = [];
    let slct;
    for (j = 0; j < result.recipes.length; j++) {
      recipes.push(result.recipes[j].name)
    }
    slct = recipes.indexOf(item)
    if (slct !== -1) {
      for (i = 0; i < result.recipes[slct].ingredients.length; i++) {
        var nameJSON = result.recipes[slct].ingredients[i].name;
        var qtyJSON = result.recipes[slct].ingredients[i].qty;
        var unitJSON = result.recipes[slct].ingredients[i].unit;
        var ingTblCt = i + 1;
        ingsQty.push(qtyJSON);
        loadRecipe(nameJSON, qtyJSON, unitJSON, ingTblCt);
      };
    } else {
      document.getElementById('blankholder').style.visibility = "visible";
      document.getElementById('blankholder').style.position = "relative";
    }
  });
});

    //Get Recipes
let recipes = [];
let recipeJSON = document.getElementById('selRec');
for (j = 0; j < result.recipes.length; j++) {
  let indRec = document.createElement('OPTION');
  recipes.push(result.recipes[j].name);
  indRec.setAttribute('value', result.recipes[j].name);
  recipeJSON.appendChild(indRec);
}

for (i = 0; i < result.recipes[0].ingredients.length; i++) {
  var nameJSON = result.recipes[0].ingredients[i].name;
  var qtyJSON = result.recipes[0].ingredients[i].qty;
  var unitJSON = result.recipes[0].ingredients[i].unit;
  var ingTblCt = i + 1;
};