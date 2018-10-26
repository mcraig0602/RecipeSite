document.getElementById("addbtn").addEventListener("click", addRow);
document.getElementById("addbtn").addEventListener("click", rmvRow);
let ingsQty = [];

$("#selectRecipe").change(function (e) {
  let item = e.currentTarget.value
  item = item.replace(" ", "_")
  document.getElementById('blankholder').style.visibility = "hidden";
  document.getElementById('blankholder').style.position = "absolute";
  clearIngs();
  $.getJSON("search/" + item, (result) => {
    ings = result.ingredients;
    for (i = 0; i < ings.length; i++) {
      loadRecipe(ings[i][0], ings[i][1], ings[i][2], i + 1);
    };
  })
});

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

function addRecipe() {
  let data = {};
  let ings = [];
  let tbl = document.getElementById('ingTbl');
  let rec = document.getElementsByName('recSelect');
  data.name = rec[0].value
  for (i = 1; i < tbl.children.length; i++) {
    let indIng = {};
    indIng.name = tbl.children[i].children[1].innerText;
    let qtyUnit = tbl.children[i].children[2].innerText.split(" ");
    indIng.qty = parseFloat(qtyUnit[0]);
    indIng.unit = qtyUnit[1];
    ings.push(indIng);
  }
  data.ingredients = ings
  console.log(data);
  $.ajax({
    type: "POST",
    url: 'add/',
    data: data,
    success: console.log('We did it!'),
    dataType: 'JSON'
  });
}

function loadRecipe(nameJSON, qtyJSON, unitJSON, ingTblCt) {
  var rmvIng = document.createElement('button');
  rmvIng.setAttribute('type', 'button');
  rmvIng.setAttribute('id', 'removeBtn');
  rmvIng.setAttribute('onclick', 'rmvRow(this)');
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
    var ingTblCt = ingTbl.childElementCount;
    ingsQty.splice(delRowI - 2, 1);
    for (i = 1; i < ingTblCt; i++) {
      ingTbl.children[i].children[0].innerText = i;
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
  ingsQty = [];
  ings = $("#ingredient").length;
  while (document.getElementById("ingredient") !== null) {
    document.getElementById("ingredient").remove();
  }
}

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

$('#addJSON').click(() => {
  $.getJSON("JSON/Recipes.json", function (result) {
    addJSON = {};
    tempJSON = {};
    addIngs = [];
    svIng = document.getElementById('ingTbl')
    for (i = 1; i < svIng.children.length; i++) {
      temp = {};
      //Quantity and Units
      qty = document.getElementById('ingTbl').children[i].childNodes[2].childNodes[0].data.split(" ")
      ing = document.getElementById('ingTbl').children[i].childNodes[1].childNodes[0].data
      temp.name = ing;
      temp.qty = qty[0];
      temp.unit = qty[1];
      addIngs.push(temp);
    }
    addJSON.name = document.getElementById('selectRecipe').value;
    addJSON.ingredients = addIngs;
    //addJSON.stringify(tempJSON);
    result.recipes.push(addJSON);
  })
})

//Checks to see if any current ingredients are in the master ingredient list
$("#addList").click(
  function (e) {
    document.getElementById('blankholder2').style.visibility = "hidden";
    document.getElementById('blankholder2').style.position = "absolute";
    var ings = document.getElementById('ingTbl').children.length;
    var testlnth = document.getElementById('mstrTbl').children.length;
    var currentIngs = [];
    var currentQty = [];
    var currentUnit = [];

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
$("#serveInput").change(function (e) {
  let serves = document.getElementById('serveInput').value;
  for (i = 1; i <= ingsQty.length; i++) {
    let qty = document.getElementById('ingTbl').children[i].childNodes[2].childNodes[0].data.split(" ")
    qty[0] = parseFloat(ingsQty[i - 1]) * parseFloat(serves)
    let upQty = String(qty[0]) + " " + String(qty[1])
    document.getElementById('ingTbl').children[i].childNodes[2].childNodes[0].data = upQty;
  }
});