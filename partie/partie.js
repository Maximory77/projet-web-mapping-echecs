

// initialisation du jeu

var initialisation_pos =["case11", "case21", "case31", "case41", "case51", "case61", "case71","case81",
                         "case12", "case22", "case32", "case42", "case52", "case62", "case72","case82",
                         "case17", "case27", "case37", "case47", "case57", "case67", "case77","case87",
                         "case18", "case28", "case38", "case48", "case58", "case68", "case78","case88"];


var initialisation_type = ["tour_blanc", "cavalier_blanc", "fou_blanc", "roi_blanc", "reine_blanc", "fou_blanc", "cavalier_blanc","tour_blanc",
                           "piont_blanc", "piont_blanc", "piont_blanc", "piont_blanc", "piont_blanc", "piont_blanc", "piont_blanc","piont_blanc",
                           "piont_noir", "piont_noir", "piont_noir", "piont_noir", "piont_noir", "piont_noir", "piont_noir","piont_noir",
                           "tour_noir", "cavalier_noir", "fou_noir", "roi_noir", "reine_noir", "fou_noir", "cavalier_noir","tour_noir"];

for (let i=0; i<initialisation_pos.length;i++){
  coords = initialisation_pos[i];
  var type = initialisation_type[i];
  $(`#${coords}`).html('<img class="image" draggable="true" src="../images/'+type+'.png" alt="'+type+'">');
}


// deplacement des pieces

// recuperation des coups possibles :
coups_possible=[[2,1,1,3],[2,1,3,3],[7,1,6,3],[7,1,8,3],[1,2,1,3],[2,2,2,3],[3,2,3,3],[4,2,4,3],[5,2,5,3],[6,2,6,3],[7,2,7,3],[8,2,8,3],[1,2,1,4],[2,2,2,4],[3,2,3,4],[4,2,4,4],[5,2,5,4],[6,2,6,4],[7,2,7,4],[8,2,8,4]]


$(`.image`).mousedown(dragS);
function dragS(e){
  var pos=e.target.parentElement["id"]
  var pos_comparaison="["+pos[4]+","+pos[5]+"]";
  console.log(pos_comparaison);
  var type = e.currentTarget['alt'];
  console.log(type);
  //recuperation des coups popssible en fonction de la piece prise
  case_possible=[];
  for (let i=0;i<coups_possible.length;i++){
    if (coups_possible[i][0]==pos[4]&&coups_possible[i][1]==pos[5]){
      case_possible.push(coups_possible[i]);
    }
  }
  console.log(case_possible);
  // mettre ces cases en subrillance et en droppable
  for(let i=0;i<case_possible.length;i++){
    //transformation de la coordonnees en identifiant de case
    let coord="case"+case_possible[i][2]+case_possible[i][3];
    console.log(coord);
    //mettre les futures cases en surbrillance et en droppable
    $(`#${coord}`).html('<div class="case_noire case" id="'+coord+'" style=" background-color:#bacd22" ondrop="drop_handler(event)" ondragover="dragover_handler(event)"></div>');


  }
}


function dragover_handler(ev) {
 ev.preventDefault();
 ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
  ev.preventDefault();
  console.log(ev.target["id"]);
  //on lance la requete pour le php

}


// var coords = "case55";
//
// $(`#${coords}`).html('<div class="case_noire case" id="case55" ondrop="drop_handler(event)" ondragover="dragover_handler(event)"></div>');

// $(`.image`).on('dragstart', dragS);
//
// function dragS(e){
//   var pos=e.target.parentElement["id"]
//   var pos_comparaison="["+pos[4]+","+pos[5]+"]";
//   console.log(pos_comparaison);
//   var type = e.currentTarget['alt'];
//   console.log(type);
// }

//$(`.image`).on('dragend', dragE);
