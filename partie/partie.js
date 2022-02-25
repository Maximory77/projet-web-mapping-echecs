//initialisation des Variables

var plateau =  document.getElementById('plateau');
var promo =  document.getElementById('promo');
var container =  document.getElementById('container');
var emplacement_pseudo = document.getElementById('pseudo');
var verif;
var promotion = document.createElement('iframe');
promotion.id="promotion";
var pseudo = localStorage.getItem('pseudo');

//initialisation des variables des pieces déplacés
var surligne=[];
var coord_piece_select="";
var type_piece_select="";
var case_arrive="";
var rep_iframe="";
var bool_promo=false;

//Pseudo du joueur retenu dans la page
emplacement_pseudo = pseudo;

// FONCTIONS UTILES
//permet de remettre les cases de la bonne couleur des cases surlignées
function remise_couleur(e){//fonction quand on clique sur une case
  for (let i=0; i<case_possible.length; i++){
    let coord="case"+case_possible[i][2]+case_possible[i][3];
      //regarde si la case est noir ou blanche
      if ((case_possible[i][2]+case_possible[i][3])%2==0){//la case est blanche
        $(`#${coord}`).html('<div class="case_blanche_case" id="'+coord+'"></div>');
      }else{//la case est noir
        $(`#${coord}`).html('<div class="case_noir_case" id="'+coord+'"></div>');
      }
  }
}

function enleve_surbrillance (tab_surbrillance){// même fonction mais en argument un tableau des dalles surlignées
  for (let i=0; i<tab_surbrillance.length; i++){
    let coord="case"+tab_surbrillance[i][2]+tab_surbrillance[i][3];
      //regarde si la case est noir ou blanche
      if ((tab_surbrillance[i][2]+tab_surbrillance[i][3])%2==0){//la case est blanche
        $(`#${coord}`).html('<div class="case_blanche_case" id="'+coord+'"></div>');
      }else{//la case est noir
        $(`#${coord}`).html('<div class="case_noir_case" id="'+coord+'"></div>');
      }
  }
}

// Fonction de gestion de la promotion
function fctpromotion() {
  // On insère l'iFrame de la promotion
  container.removeChild(promo);
  container.appendChild(promotion);
  // On vérifie si lla promotion a été terminé (choisi par l'utilisateur) afin de rafficher la carte
  verif = setInterval(verification, 200);
}


// Fonction de vérification de la fin de la promotion de rafficher la carte en la mettant à jour
function verification() {
  if(promotion.parentNode != container) {
    container.appendChild(promo);
    clearInterval(verif);
    rep_promo=rep_iframe.toLowerCase()+"_blanc";
    $(`#${case_arrive}`).html('<img class="piece" draggable="true" src="./images/'+rep_promo+'.png" alt="'+rep_promo+'">');
    rep_iframe="";
    bool_promo=true;
  }
}


//fonction qui permet de recuperer la valeur d'une iframe fille
function afficheParent(valeur){
  rep_iframe=valeur;
}


// INITIALISATION DU JEU

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
  var type_ini = initialisation_type[i];
  $(`#${coords}`).html('<img class="piece" draggable="true" src="./images/'+type_ini+'.png" alt="'+type_ini+'">');
}
 var tab_promotion=["case11", "case21", "case31", "case41", "case51", "case61", "case71","case81"];

// deplacement des pieces

// recuperation des coups possibles :
//coups_possible=[[2,1,1,3],[2,1,3,3],[7,1,6,3],[7,1,8,3],[1,2,1,3],[2,2,2,3],[3,2,3,3],[4,2,4,3],[5,2,5,3],[6,2,6,3],[7,2,7,3],[8,2,8,3],[1,2,1,4],[2,2,2,4],[3,2,3,4],[4,2,4,4],[5,2,5,4],[6,2,6,4],[7,2,7,4],[8,2,8,4]]
premier_coup_j2();


//quand on commence à deplacer ou clic une piece on doit : mettre en surbrillance uniquement les cases disponibles
$(`.piece`).mousedown(dragS);
$(`.piece`).on('click',remise_couleur);
function dragS(e){

  //on supprime les cases déjà surlignées
  enleve_surbrillance(surligne);
  surligne=[];

  //mise à jour des position et du type de la piece bougé
  coord_piece_select = e.target.parentElement["id"];
  type_piece_select = e.currentTarget['alt'];

  //recuperation des coups popssible en fonction de la piece prise
  for (let i=0;i<coups_possible.length;i++){
    if (coups_possible[i][1]==coord_piece_select[4]&&coups_possible[i][0]==coord_piece_select[5]){
      surligne.push(coups_possible[i]);
    }
  }

  // mettre ces cases en subrillance et en droppable
  for(let i=0;i<surligne.length;i++){
    //transformation de la coordonnees en identifiant de case
    let coord="case"+surligne[i][3]+surligne[i][2];

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
  case_arrive =(ev.target["id"]);

  //mise à jour de l'echequier
    //on enleve les cases en surbrillance
  enleve_surbrillance(surligne);
  surligne=[];

    // on affiche la nouvelle piece
  $(`#${case_arrive}`).html('<img class="piece" draggable="true" src="./images/'+type_piece_select+'.png" alt="'+type_piece_select+'">');

    // on supprime l'anciene
  if ((parseInt(coord_piece_select[4])+parseInt(coord_piece_select[5]))%2==0){//la case est blanche
    $(`#${coord_piece_select}`).html('<div class="case_blanche_case" id="'+coord_piece_select+'"></div>');
  }else{//la case est noir
    $(`#${coord_piece_select}`).html('<div class="case_noir_case" id="'+coord_piece_select+'"></div>');
  }

    // cas d'une Promotion
  if ((!(tab_promotion.indexOf(case_arrive)==-1))&&(type_piece_select=="piont_blanc")){// si on est dans la derniere ligne et si c'est un piont
    promotion.src = "promotion.html";
    fctpromotion();
  }

  // requete php
    //on trouve l'index du coup joue dans la liste des coups_possible
      //creation de la structure du coup joué
    var coup_joue=coord_piece_select[4]+","+coord_piece_select[5]+","+case_arrive[4]+","+case_arrive[5];
      //recherhce de l'index
    var index=0;
    for(let i=0;i<coups_possible.length;i++){
      if (coups_possible[i]==coup_joue){
        index=i;
        break;
      }
    }
    console.log(index);

    // on construit la requete


    //on lance la requete pour le php
}

