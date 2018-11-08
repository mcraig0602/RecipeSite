document.getElementById("addbtn").addEventListener("click", addRow);
//document.getElementById("addbtn").addEventListener("click", rmvRow);
let ingsQty = [];

$(document).ready(function (e) {
  //Get Recipes
  $.getJSON("all/recipes", (result) => {
    for (i = 0; i < result.recipe.length; i++) {
      let sel = document.createElement('option');
      sel.setAttribute('value', result.recipe[i].replace("_", " "));
      document.getElementById('selRec').appendChild(sel);
    }
  })
  //Get Ingredients
  $.getJSON("all/ingredients", (result) => {
    for (i = 0; i < result.ingredients.length; i++) {
      let sel = document.createElement('option');
      sel.setAttribute('value', result.ingredients[i])
      document.getElementById('mstrIngs').appendChild(sel);
    }
  })
});

$("#selectRecipe").change(function (e) {
  let item = e.currentTarget.value
  item = item.replace(" ", "_")
  let curRec = []
  let selRec = document.getElementById('selRec')
  for (p = 0; p < selRec.children.length; p++) {
    let curitem = selRec.children[p].value.replace(" ", "_")
    curRec.push(curitem);
  };
  if (curRec.indexOf(item) !== -1) {
    ingsQty = [];
    ingsLen = document.getElementById('ingTbl').children.length - 1
    for (let p = ingsLen; p > 0; p--) {
      document.getElementById('ingTbl').children[p].remove();
    }
    document.getElementById('blankholder').style.visibility = "hidden";
    document.getElementById('blankholder').style.position = "absolute";
    document.getElementById('blankholder').innerText = "Select a Recipe";
    $.getJSON("search/" + item, (result) => {
      ings = result.ingredients;
      for (i = 0; i < ings.length; i++) {
        loadRecipe(ings[i][0], ings[i][1], ings[i][2], i + 1);
      };
    })
  } else {
    document.getElementById('blankholder').innerText = "Add ingredients"
  }
});

$('#addJSON').click(() => {
  let ingredients = {};
  let tbl = document.getElementById('ingTbl');
  let rec = document.getElementsByName('recSelect');
  ingredients.name = rec[0].value.replace(" ", "_")
  for (i = 1; i < tbl.children.length; i++) {
    let indIng = [];
    indIng[0] = tbl.children[i].children[1].innerText;
    let qtyUnit = tbl.children[i].children[2].innerText.split(" ");
    indIng[1] = parseFloat(qtyUnit[0]);
    indIng[2] = qtyUnit[1];
    ingredients["ingredient" + i] = indIng;
  }
  $.ajax({
    type: "POST",
    url: 'add/',
    data: ingredients,
    success: console.log('We did it!'),
    dataType: 'application/JSON'
  });
})

function loadRecipe(nameJSON, qtyJSON, unitJSON, ingTblCt) {
  var rmvIng = document.createElement('button');
  rmvIng.setAttribute('type', 'button');
  rmvIng.setAttribute('id', 'removeBtn');
  rmvIng.setAttribute('onclick', 'rmvRow(this)');
  rmvIng.setAttribute('class', 'btn btn-outline-danger');
  rmvIng.innerText = '-';
  var rmvIngP = document.createElement('td');
  rmvIngP.appendChild(rmvIng);
  //Quantity//
  var qty = document.createElement('td');
  qty.innerText = qtyJSON + ' ' + unitJSON;
  //Ingredient//
  var ing = document.createElement('td');
  ing.innerHTML = nameJSON;
  //Row Number//
  var rowNum = document.createElement('th');
  rowNum.setAttribute('scope', 'row')
  rowNum.innerText = ingTblCt;
  //Create Row//
  var ingredient = document.createElement('tr')
  ingredient.setAttribute('id', 'ingredient');
  //Combine Cells//
  ingredient.appendChild(rowNum);
  ingredient.appendChild(ing);
  ingredient.appendChild(qty);
  ingredient.appendChild(rmvIngP);
  ingTbl.appendChild(ingredient);
  ingsQty.push(qtyJSON);
}

function addRow() {
  document.getElementById('blankholder').style.visibility = "hidden";
  document.getElementById('blankholder').style.position = "absolute";
  var ingTbl = document.getElementById('ingTbl');
  var ingTblCt = ingTbl.childElementCount
  var ingRow = document.getElementById('ingInput').value;
  var qtyRow = document.getElementById('qtyInput').value;
  var unitRow = document.getElementById('unitInput').value;
  if (ingRow == "" || qtyRow == "" || unitRow == "") {
    alert('You must fill in all fields');
  } else {
    //Remove Ingredient Button//
    var rmvIng = document.createElement('button');
    rmvIng.setAttribute('type', 'button');
    rmvIng.setAttribute('id', 'removeBtn');
    rmvIng.setAttribute('onclick', 'rmvRow(this)');
    rmvIng.innerText = '-';
    var rmvIngP = document.createElement('td');
    rmvIngP.appendChild(rmvIng);
    //Quantity//
    var qty = document.createElement('td');
    qty.innerText = qtyRow + ' ' + unitRow;
    //Ingredient//
    var ing = document.createElement('td');
    ing.innerText = ingRow;
    //Row Number//
    var rowNum = document.createElement('th');
    rowNum.innerText = ingTblCt + 1;
    //Create Row//
    var ingredient = document.createElement('tr')
    ingredient.setAttribute('id', 'ingredient');
    //Combine Cells//
    ingredient.appendChild(rowNum);
    ingredient.appendChild(ing);
    ingredient.appendChild(qty);
    ingredient.appendChild(rmvIngP);
    ingTbl.appendChild(ingredient);
    ingsQty.push(qtyRow)
  }
}

function rmvRow(cls) {
  if (cls.parentNode.parentNode.rowIndex !== null) {
    var delRowI = cls.parentNode.parentNode.rowIndex;
    document.getElementById('ingTable').deleteRow(delRowI);
    var ingTbl = document.getElementById('ingTbl');
    ingsQty.splice(delRowI - 2, 1);
    for (i = 1; i < document.getElementById('ingTbl').children.length; i++) ingTbl.children[i].children[0].innerText = i;
    if (document.getElementById('ingTbl').children.length == 1) {
      document.getElementById('blankholder').style.visibility = "visible";
      document.getElementById('blankholder').style.position = "relative";
      document.getElementById('selectRecipe').value = null;
    }
  }
}

function rmvRow2(cls) {
  if (cls.parentNode.parentNode.rowIndex !== null) {
    var delRowI = cls.parentNode.parentNode.rowIndex;
    var cnfrm = confirm('Are you sure you want to delete this row?')
    if (cnfrm) {
      document.getElementById('masterTbl').deleteRow(delRowI);
    }
    var mstrTbl = document.getElementById('mstrTbl');
    var mstrTblCt = mstrTbl.childElementCount;
    for (i = 1; i < mstrTblCt; i++) {
      mstrTbl.children[i].children[0].innerText = i;
    }
  }
}

function clearIngs() {
  document.getElementById('blankholder').style.visibility = "visible";
  document.getElementById('blankholder').style.position = "relative";
  document.getElementById('blankholder').innerText = "Select a Recipe";
  ingsQty = [];
  document.getElementById('selectRecipe').value = null;
  ingsLen = document.getElementById('ingTbl').children.length - 1
  console.log(ingsLen);
  for (let p = ingsLen; p > 0; p--) {
    document.getElementById('ingTbl').children[p].remove();
  }
};


function clearMastIngs() {
  ings = $("#masteringredient").length;
  while (document.getElementById("masteringredient") !== null) {
    document.getElementById("masteringredient").remove();
  }
}

function addMastRow(ingr, qtyI, unit) {
  var mstrTbl = document.getElementById('mstrTbl');
  //Remove Line Button
  let rmvIng = document.createElement('button');
  rmvIng.setAttribute('type', 'button');
  rmvIng.setAttribute('id', 'removeBtn');
  rmvIng.setAttribute('onclick', 'rmvRow2(this)');
  rmvIng.setAttribute('class', 'btn btn-outline-danger');
  rmvIng.innerText = '-';
  let rmvIngP = document.createElement('td');
  rmvIngP.appendChild(rmvIng);
  //Quantity//
  var qty = document.createElement('td');
  qty.innerText = String(qtyI) + " " + unit;
  qty.setAttribute('id', 'qty')
  //Ingredient//
  var ing = document.createElement('td');
  ing.innerText = String(ingr);
  //Row Number//
  var rowNum = document.createElement('th');
  rowNum.innerText = document.getElementById('mstrTbl').children.length;
  //Create Row//
  var ingredient = document.createElement('tr')
  ingredient.setAttribute('id', 'masteringredient');
  //Combine Cells//
  ingredient.appendChild(rowNum);
  ingredient.appendChild(ing);
  ingredient.appendChild(qty);
  ingredient.appendChild(rmvIngP);
  mstrTbl.appendChild(ingredient);
}
$("#addList").click(
  function (e) {
    document.getElementById('blankholder2').style.visibility = "hidden";
    document.getElementById('blankholder2').style.position = "absolute";
    let ings = document.getElementById('ingTbl').children.length;
    let testlnth = document.getElementById('mstrTbl').children.length;
    const recipe = document.getElementById('selectRecipe').value
    let currentIngs = [];
    let currentQty = [];
    let currentUnit = [];

    for (var i = 1; i < testlnth; i++) {
      var mstrIngs = document.getElementById('mstrTbl').children[i].childNodes[1].childNodes[0].data
      var mstrQty = document.getElementById('mstrTbl').children[i].childNodes[2].childNodes[0].data
      //Seperating Qty and Unit
      mstrQty = mstrQty.split(" ");
      var qty = mstrQty[0];
      currentQty.push(qty);
      var unit = mstrQty[1];
      currentUnit.push(unit);
      currentIngs.push(mstrIngs);
    }
    console.log(currentIngs)
    for (i = 1; i < ings; i++) {
      if (currentIngs.indexOf(document.getElementById('ingTbl').children[i].childNodes[1].childNodes[0].data) !== -1) {
        let qty = document.getElementById('ingTbl').children[i].childNodes[2].childNodes[0].data.split(" ")
        let ind = currentIngs.indexOf(document.getElementById('ingTbl').children[i].childNodes[1].childNodes[0].data)
        let newqty = parseInt(currentQty[ind]) + parseInt(qty[0])
        currentQty[ind] = newqty;
      } else {
        //let ingr = document.getElementById('ingTbl').children[i].childNodes[1].childNodes[0].data
        let qty = document.getElementById('ingTbl').children[i].childNodes[2].childNodes[0].data.split(" ")
        currentQty.push(qty[0]);
        currentUnit.push(qty[1]);
        currentIngs.push(document.getElementById('ingTbl').children[i].childNodes[1].childNodes[0].data)
      };
    }
    clearIngs();
    document.getElementById('blankholder').style.visibility = "visible";
    document.getElementById('blankholder').style.position = "relative";
    document.getElementById('selectRecipe').value = "";
    document.getElementById('serveInput').value = 1;
    clearMastIngs();
    for (j = 0; j < currentQty.length; j++) {
      addMastRow(currentIngs[j], currentQty[j], currentUnit[j]);
    }
  });

function indRecipe(currentRecipe){
  //This probably will go into addList
  let myTab = document.getElementById('myTab')
  let recipe = document.createElement('a')
  recipe.setAttribute('class', 'nav-link');
  recipe.setAttribute('id', 'home-tab');
  recipe.setAttribute('data-toggle', 'tab');
  recipe.setAttribute('href', '#'+currentRecipe); //put currentRecipe here with # infront of it
  recipe.setAttribute('role', 'tab');
  recipe.innerText = currentRecipe; //put currentRecipe here
  let recipe2 = document.createElement('li');
  recipe2.setAttribute('class','nav-item');
  recipe2.appendChild(recipe);

  //create table
  let recTblNum = document.createElement('th');
  recTblNum.setAttribute('width', '5%');
  let recTblIng = document.createElement('th');
  recTblIng.setAttribute('width', '50%');
  let recTblQty = document.createElement('th')
  recTblQty.setAttribute('width', '7%');
  let recTblRmv = document.createElement('th');
  recTblRmv.setAttribute('width', '10%');
  let recTbl = document.createElement('tr');
  recTbl.setAttribute('id','topper');
  recTbl.appendChild(recTblNum);
  recTbl.appendChild(recTblIng);
  recTbl.appendChild(recTblQty);
  recTbl.appendChild(recTblRmv);
  let indTbl = document.createElement('thead').appendChild(recTbl);
  let indRecTbl = document.createElement('table').appendChild(indTbl)
  recipe2.appendChild(indRecTbl)
  myTab.appendChild(recipe2);
  console.log(recipe2);
  
/*   var mstrTbl = document.getElementById('mstrTbl');
  let indTbl = document.createElement('')

  //Create individual line
  //Remove Line Button
  let rmvIng = document.createElement('button');
  rmvIng.setAttribute('type', 'button');
  rmvIng.setAttribute('id', 'removeBtn');
  rmvIng.setAttribute('onclick', 'rmvRow2(this)');
  rmvIng.setAttribute('class', 'btn btn-outline-danger');
  rmvIng.innerText = '-';
  let rmvIngP = document.createElement('td');
  rmvIngP.appendChild(rmvIng);
  //Quantity//
  var qty = document.createElement('td');
  qty.innerText = String(qtyI) + " " + unit;
  qty.setAttribute('id', 'qty')
  //Ingredient//
  var ing = document.createElement('td');
  ing.innerText = String(ingr);
  //Row Number//
  var rowNum = document.createElement('th');
  rowNum.innerText = document.getElementById('mstrTbl').children.length;
  //Create Row//
  var ingredient = document.createElement('tr')
  ingredient.setAttribute('id', 'masteringredient');
  //Combine Cells//
  ingredient.appendChild(rowNum);
  ingredient.appendChild(ing);
  ingredient.appendChild(qty);
  ingredient.appendChild(rmvIngP);
  mstrTbl.appendChild(ingredient); */
}

//Multiplies qtys for additional servings
$("#serveInput").change(function (e) {
  let serves = document.getElementById('serveInput').value;
  for (i = 1; i <= ingsQty.length; i++) {
    let qty = document.getElementById('ingTbl').children[i].childNodes[2].childNodes[0].data.split(" ")
    qty[0] = parseFloat(ingsQty[i - 1]) * parseFloat(serves)
    let upQty = String(qty[0]) + " " + String(qty[1])
    document.getElementById('ingTbl').children[i].childNodes[2].childNodes[0].data = upQty;
  }
});