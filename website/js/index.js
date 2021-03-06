document.getElementById("addbtn").addEventListener("click", addRow);
let ingsQty = [];

$(document).ready(() => {
  //Get Units
  $.getJSON("all/units", result => {
    for (i = 0; i < result.units.length; i++) {
      let sel = document.createElement("option");
      sel.setAttribute("value", result.units[i]);
      sel.innerText = result.units[i];
      document.getElementById("unitInput").appendChild(sel);
    }
  });
  refreshJSON();
});

function refreshJSON() {
  //Get Recipes
  $.getJSON("all/recipes", result => {
    for (i = 0; i < result.recipe.length; i++) {
      let sel = document.createElement("option");
      sel.setAttribute("value", result.recipe[i].replace(/_/g, " "));
      document.getElementById("selRec").appendChild(sel);
    }
  });
  //Get Ingredients
  $.getJSON("all/ingredients", result => {
    for (i = 0; i < result.ingredients.length; i++) {
      let sel = document.createElement("option");
      sel.setAttribute("value", result.ingredients[i]);
      document.getElementById("mstrIngs").appendChild(sel);
    }
  });
}

$("#selectRecipe").change(function(e) {
  let item = e.currentTarget.value;
  item = item.replace(/ /g, "_");
  let curRec = [];
  let selRec = document.getElementById("selRec");
  for (p = 0; p < selRec.children.length; p++) {
    let curitem = selRec.children[p].value.replace(/ /g, "_");
    curRec.push(curitem);
  }
  if (curRec.indexOf(item) !== -1) {
    ingsQty = [];
    ingsLen = document.getElementById("ingTbl").children.length - 1;
    for (let p = ingsLen; p > 0; p--) {
      document.getElementById("ingTbl").children[p].remove();
    }
    document.getElementById("blankholder").style.visibility = "hidden";
    document.getElementById("blankholder").style.position = "absolute";
    document.getElementById("blankholder").innerText = "Select a Recipe";
    $.getJSON("search/" + item, result => {
      const ings = result.ingredients;
      for (i = 0; i < ings.length; i++)
        loadRecipe(ings[i][0], ings[i][1], ings[i][2], i + 1);
    });
  } else {
    document.getElementById("blankholder").innerText = "Add ingredients";
  }
});

$("#addJSON").click(() => {
  let ingredients = {};
  let tbl = document.getElementById("ingTbl");
  let rec = document.getElementById("selectRecipe").value;
  if (rec == "")
    rec = prompt(
      "The recipe name can not be empty. Please enter a recipe name",
      "Recipe Name"
    );
  rec = rec.toString();
  ingredients.name = rec.replace(/ /g, "_");
  for (i = 1; i < tbl.children.length; i++) {
    let indIng = [];
    indIng[0] = tbl.children[i].children[1].innerText;
    let qtyUnit = tbl.children[i].children[2].innerText.split(" ");
    qtyUnit = convertQty(qtyUnit[0], qtyUnit[1]);
    indIng[1] = qtyUnit[0];
    indIng[2] = qtyUnit[1];
    ingredients["ingredient" + i] = indIng;
  }
  $.ajax({
    type: "POST",
    url: "add/",
    data: ingredients,
    success: console.log("good"),
    dataType: "application/JSON",
    complete: res => {
      data = JSON.parse(res.responseText);
      console.log(data.msg);
      if (data.msg == "Duplicate Entry") {
        let name = data.name.replace(/_/g, " ");
        alert(`${name} is already in the recipebook.`);
      }
    }
  });
  refreshJSON();
});

function convertQty(qty, unit) {
  let mtrQty;
  switch (unit) {
    case "cup(wet)":
      qty = qty * 8;
      unit = "floz";
      mtrQty = [qty, unit];
      return mtrQty;
      break;
    case "cup(dry)":
      qty = qty * 4;
      unit = "oz";
      mtrQty = [qty, unit];
      return mtrQty;
      break;
    case "tbsp":
      qty = qty * 0.5;
      unit = "oz";
      mtrQty = [qty, unit];
      return mtrQty;
      break;
    case "tea":
      qty = qty * (1 / 6);
      unit = "floz";
      mtrQty = [qty, unit];
      return mtrQty;
      break;
    default:
      mtrQty = [qty, unit];
      return mtrQty;
      break;
  }
}

function optimizeQty(qty) {}

function loadRecipe(nameJSON, qtyJSON, unitJSON, ingTblCt) {
  let indLne = `
  <tr id="ingredient">
  <th>${ingTblCt}</th>
  <td>${nameJSON}</td>
  <td id="qty">${qtyJSON} ${unitJSON}</td>
  <td><button type="button" id="removeBtn" onclick="rmvRow(this)" class="btn btn-outline-danger">-</button></td>
  </tr>`;
  $("#ingTbl").append(indLne);
  ingsQty.push(qtyJSON);
}

function addRow() {
  document.getElementById("blankholder").style.visibility = "hidden";
  document.getElementById("blankholder").style.position = "absolute";
  var ingTblCt = ingTbl.childElementCount;
  var ingRow = document.getElementById("ingInput").value;
  var qtyRow = document.getElementById("qtyInput").value;
  var unitRow = document.getElementById("unitInput").value;
  if (ingRow == "" || qtyRow == "" || unitRow == "") {
    alert("You must fill in all fields");
  } else {
    let indLne = `
    <tr id="ingredient">
    <th>${ingTblCt}</th>
    <td>${ingRow}</td>
    <td id="qty">${qtyRow} ${unitRow}</td>
    <td><button type="button" id="removeBtn" onclick="rmvRow(this)" class="btn btn-outline-danger">-</button></td>
    </tr>`;
    $("#ingTbl").append(indLne);
    ingsQty.push(qtyRow);
    document.getElementById("ingInput").value = null;
    document.getElementById("qtyInput").value = null;
    document.getElementById("unitInput").value = null;
    document.getElementById("ingInput").focus();
  }
}

function rmvRow(cls) {
  if (cls.parentNode.parentNode.rowIndex !== null) {
    var delRowI = cls.parentNode.parentNode.rowIndex;
    document.getElementById("ingTable").deleteRow(delRowI);
    var ingTbl = document.getElementById("ingTbl");
    ingsQty.splice(delRowI - 2, 1);
    for (i = 1; i < document.getElementById("ingTbl").children.length; i++)
      ingTbl.children[i].children[0].innerText = i;
    if (document.getElementById("ingTbl").children.length == 1) {
      document.getElementById("blankholder").style.visibility = "visible";
      document.getElementById("blankholder").style.position = "relative";
      document.getElementById("selectRecipe").value = null;
    }
  }
}

//removes the row from Master List
function rmvRow2(cls) {
  if (cls.parentNode.parentNode.rowIndex !== null) {
    let delRowI = cls.parentNode.parentNode.rowIndex;
    const ing = cls.parentNode.parentNode.children[1].innerText;
    let cnfrm = confirm("Are you sure you want to delete this row?");
    if (cnfrm) document.getElementById("masterTbl").deleteRow(delRowI);
    //Remove Master Ingredient List
    let mstrTblCt = document.getElementById("mstrTbl").childElementCount;
    for (i = 1; i < mstrTblCt; i++)
      document.getElementById("mstrTbl").children[i].children[0].innerText = i;
    let tabs = document.getElementById("myTab").childElementCount;
    for (let i = 0; i < tabs; i++) {
      let tabContent = document.getElementById("tab-content").children[i]
        .children[0].children[1].childElementCount;
      //Remove ingredients from tab
      for (let j = 0; j < tabContent - 1; j++) {
        if (
          document.getElementById("tab-content").children[i].children[0]
            .children[1].children[j].children[1].innerText === ing
        ) {
          let delRowJ =
            document.getElementById("tab-content").children[i].children[0]
              .children[1].children[j].rowIndex - 1;
          document
            .getElementById("tab-content")
            .children[i].children[0].children[1].deleteRow(delRowJ);
          //Renumber child tabs
          for (let k = 0; k < tabContent - 1; k++)
            document.getElementById("tab-content").children[
              i
            ].children[0].children[1].children[k].children[0].innerText = k + 1;
        }
      }
    }
  }
}

function rmvRow3(cls) {
  if (cls.parentNode.parentNode.rowIndex !== null) {
    let delRowI = cls.parentNode.parentNode.rowIndex;
    let recipeID = cls.parentNode.parentNode.parentNode.parentNode.id;
    let qtyu = cls.parentNode.parentNode.children[2].innerText;
    let qtyU = qtyu.split(" ");
    let qty = qtyU[0];
    let cnfrm = confirm("Are you sure you want to delete this row?");
    if (cnfrm) document.getElementById(recipeID).deleteRow(delRowI);
    let indTbl = document.getElementById(recipeID);
    let indTblCt = indTbl.children[1].childElementCount;
    for (let i = 0; i < indTblCt; i++)
      indTbl.children[1].children[i].children[0].innerText = i + 1;
    let mstrTbl = document.getElementById("mstrTbl");
    let mstrTblCt = mstrTbl.childElementCount;
    for (let j = 1; j < mstrTblCt; j++) {
      if (
        mstrTbl.children[j].children[1].innerText ===
        cls.parentNode.parentNode.children[1].innerText
      ) {
        let mstrQtyU = mstrTbl.children[j].children[2].innerText.split(" ");
        let newQty = parseFloat(mstrQtyU[0]) - qty;
        if (newQty <= 0) {
          let delRowI = mstrTbl.children[j].rowIndex;
          document.getElementById("masterTbl").deleteRow(delRowI);
          let mstrTblCt = mstrTbl.childElementCount;
          for (i = 1; i < mstrTblCt; i++)
            mstrTbl.children[i].children[0].innerText = i;
        } else
          mstrTbl.children[j].children[2].innerText = `${newQty} ${
            mstrQtyU[1]
          }`;
        break;
      }
    }
    let final = document.getElementById(recipeID);
    let rec = recipeID.replace("Tbl", "");
    rec = rec + "-tab";
    if (final.children[1].childElementCount > 0) {
      final.remove();
      document.getElementById(rec).remove();
    }
  }
}

function clearIngs() {
  document.getElementById("blankholder").style.visibility = "visible";
  document.getElementById("blankholder").style.position = "relative";
  document.getElementById("blankholder").innerText = "Select a Recipe";
  ingsQty = [];
  document.getElementById("selectRecipe").value = null;
  ingsLen = document.getElementById("ingTbl").children.length - 1;
  for (let p = ingsLen; p > 0; p--)
    document.getElementById("ingTbl").children[p].remove();
}

function clearMastIngs() {
  ings = $("#masteringredient").length;
  while (document.getElementById("masteringredient") !== null)
    document.getElementById("masteringredient").remove();
}

function addMastRow(ingr, qtyI, unit) {
  var mstrTbl = document.getElementById("mstrTbl");
  for (let i = 0; i < ingr.length; i++) {
    let mstrLne = ``;
    mstrLne = ` <tr id = "masteringredient">
        <th>${i + 1}</th>
        <td>${ingr[i]}</td>
        <td id="qty">${qtyI[i]} ${unit[i]}</td>
        <td><button type="button" id="removeBtn" onclick="rmvRow2(this)" class="btn btn-outline-danger">-</button></td>
        </tr>`;
    $("#mstrTbl").append(mstrLne);
  }
}
$("#addList").click(function(e) {
  document.getElementById("blankholder2").style.visibility = "hidden";
  document.getElementById("blankholder2").style.position = "absolute";
  let ings = document.getElementById("ingTbl").children.length;
  let testlnth = document.getElementById("mstrTbl").children.length;
  const recipe = document.getElementById("selectRecipe").value;
  let currentIngs = [];
  let currentQty = [];
  let currentUnit = [];
  for (var i = 1; i < testlnth; i++) {
    let mstrIngs = document.getElementById("mstrTbl").children[i].children[1]
      .innerText;
    //mstrIngs = mstrIngs.substr(0, mstrIngs.length - 1)
    let mstrQty = document.getElementById("mstrTbl").children[i].children[2]
      .innerText;
    //Seperating Qty and Unit
    mstrQty = mstrQty.split(" ");
    var qty = mstrQty[0];
    currentQty.push(qty);
    var unit = mstrQty[1];
    currentUnit.push(unit);
    currentIngs.push(mstrIngs);
  }
  let ingredient = [];
  let quantity = [];
  let units = [];
  for (let j = 1; j < ings; j++) {
    ingredient.push(
      document.getElementById("ingTbl").children[j].children[1].innerText
    );
    let masterQty = document.getElementById("ingTbl").children[j].children[2]
      .innerText;
    masterQty = masterQty.split(" ");
    quantity.push(masterQty[0]);
    units.push(masterQty[1]);
  }
  indRecipe(recipe, ingredient, quantity, units);
  for (i = 1; i < ings; i++) {
    let varIng = document.getElementById("ingTbl").children[i].children[1]
      .innerText;
    if (currentIngs.indexOf(varIng) !== -1) {
      let qty = document
        .getElementById("ingTbl")
        .children[i].children[2].innerText.split(" ");
      let ind = currentIngs.indexOf(varIng);
      let newqty = parseFloat(currentQty[ind]) + parseFloat(qty[0]);
      currentQty[ind] = Math.round(newqty * 100) / 100;
    } else {
      let qty = document
        .getElementById("ingTbl")
        .children[i].children[2].innerText.split(" ");
      currentQty.push(qty[0]);
      currentUnit.push(qty[1]);
      currentIngs.push(
        document.getElementById("ingTbl").children[i].children[1].innerText
      );
    }
  }
  clearIngs();
  document.getElementById("blankholder").style.visibility = "visible";
  document.getElementById("blankholder").style.position = "relative";
  document.getElementById("selectRecipe").value = "";
  document.getElementById("serveInput").value = 1;
  clearMastIngs();
  addMastRow(currentIngs, currentQty, currentUnit);
});

function indRecipe(currentRecipe, currentIngs, currentQty, currentUnit) {
  //This probably will go into addList
  let myTab = document.getElementById("myTab");
  if (myTab.children.length === 0) $("#myTab").attr("visibility", "visible");
  let currentRecipeP = currentRecipe.replace(" ", "");
  let tab = `<li class="nav-item">
  <a class="nav-link" id="${currentRecipeP}-tab" data-toggle="tab" href="#${currentRecipeP}" role="tab">${currentRecipe}</a>
  </li>`;
  $("#myTab").append(tab);
  //create table
  let tabTblH = `<div class="tab-pane fade indRecipe" id="${currentRecipeP}" role="tabpanel">
      <table id="Tbl${currentRecipeP}" class="table-sm table-hover">
      <thead>
        <tr id="topper">
          <th width="5%"></th>
          <th width="50%">Ingredient</th>
          <th width="7%">Quantity</th>
          <th width="10%"></th>
        </tr>
      </thead>
      <tbody id="mstrTbl">
        <tr id="indIngredients">`;
  let tabTblB = ``;
  for (let i = 0; i < currentIngs.length; i++) {
    tabTblB += `<th>${i + 1}</th>
        <td>${currentIngs[i]}</td>
        <td id="qty">${currentQty[i]} ${currentUnit[i]}</td>
        <td><button type="button" id="removeBtn" onclick="rmvRow3(this)" class="btn btn-outline-danger">-</button></td>
        </tr>`;
  }
  let tabTblF = `</tbody>
        </table>
        </div>`;
  let tabTbl = tabTblH + tabTblB + tabTblF;
  $(".tab-content").append(tabTbl);
}

//Multiplies qtys for additional servings
$("#serveInput").change(function(e) {
  let serves = document.getElementById("serveInput").value;
  for (i = 1; i <= ingsQty.length; i++) {
    let qty = document
      .getElementById("ingTbl")
      .children[i].childNodes[2].childNodes[0].data.split(" ");
    qty[0] = parseFloat(ingsQty[i - 1]) * parseFloat(serves);
    let upQty = String(qty[0]) + " " + String(qty[1]);
    document.getElementById("ingTbl").children[
      i
    ].childNodes[2].childNodes[0].data = upQty;
  }
});
