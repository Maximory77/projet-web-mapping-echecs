//initialisation des Variables
var plateau =  document.getElementById('plateau');
var promo =  document.getElementById('promo');
var container =  document.getElementById('container');
var verif;
var promotion = document.createElement('iframe');
promotion.id="promotion";

//initialisation des variables des pieces déplacés
var surligne=[];
var coord_piece_select="";
var type_piece_select="";
var case_arrive="";
var rep_iframe="";
var bool_promo=false;

//initialisation des attribut pour les envoies au serveur
var partie = 999;
var id_joueur = 'j1';
var cote = 2;
var tour = 1;
var trait = 1;
var coup = 0;


// FONCTIONS UTILES
//permet de remettre les cases de la bonne couleur des cases surlignées
function remise_couleur(e){//fonction quand on clique sur une case
  for (let i=0; i<case_possible.length; i++){
    let coord="case"+case_possible[i][2]+case_possible[i][3];
      //regarde si la case est noir ou blanche
      if ((case_possible[i][2]+case_possible[i][3])%2==0){//la case est noir
        $(`#${coord}`).html('<div class="case_noir_case" id="'+coord+'"></div>');
      }else{//la case est blanche
        $(`#${coord}`).html('<div class="case_blanche_case" id="'+coord+'"></div>');
      }
  }
}

function enleve_surbrillance (tab_surbrillance){// même fonction mais en argument un tableau des dalles surlignées
  for (let i=0; i<tab_surbrillance.length; i++){
    let coord="case"+tab_surbrillance[i][2]+tab_surbrillance[i][3];
      //regarde si la case est noir ou blanche
      if ((tab_surbrillance[i][2]+tab_surbrillance[i][3])%2==0){//la case est noir
        $(`#${coord}`).html('<div class="case_noir_case" id="'+coord+'"></div>');
      }else{//la case est blanche
        $(`#${coord}`).html('<div class="case_blanche_case" id="'+coord+'"></div>');
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
    rep_promo=rep_iframe.toLowerCase()+"_noir";
    $(`#${case_arrive}`).html('<img class="piece" draggable="true" src="../images/'+rep_promo+'.png" alt="'+rep_promo+'">');
    rep_iframe="";
    bool_promo=true;
  }
}


//fonction qui permet de recuperer la valeur d'une iframe fille
function afficheParent(valeur){
  rep_iframe=valeur;
}


// INITIALISATION DU JEU
var initialisation_pos =["case81", "case82", "case83", "case84", "case85", "case86", "case87","case88",
                         "case71", "case72", "case73", "case74", "case75", "case76", "case77","case78"];


var initialisation_type = ["tour_noir", "cavalier_noir", "fou_noir", "reine_noir", "roi_noir", "fou_noir", "cavalier_noir","tour_noir",
                           "piont_noir", "piont_noir", "piont_noir", "piont_noir", "piont_noir", "piont_noir", "piont_noir","piont_noir"];

for (let i=0; i<initialisation_pos.length;i++){
  coords = initialisation_pos[i];
  var type_ini = initialisation_type[i];
  $(`#${coords}`).html('<img class="piece" draggable="true" src="../images/'+type_ini+'.png" alt="'+type_ini+'">');
}

 var tab_promotion=["case44","case81", "case82", "case83", "case84", "case85", "case86", "case87","case88"];
// deplacement des pieces

// recuperation des coups possibles :
//coups_possible=[[2,1,1,3],[2,1,3,3],[7,1,6,3],[7,1,8,3],[1,2,1,3],[2,2,2,3],[3,2,3,3],[4,2,4,3],[5,2,5,3],[6,2,6,3],[7,2,7,3],[8,2,8,3],[1,2,1,4],[2,2,2,4],[3,2,3,4],[4,2,4,4],[5,2,5,4],[6,2,6,4],[7,2,7,4],[8,2,8,4]]
//recup_coup_t1_j1();

function joue_uncoups(){
  if(trait==2){
    recup_coup_j1();
    $(`.piece`).mousedown(dragS);
    $(`.piece`).on('click',remise_couleur);
  }else{
    $(`.piece`).off('click',remise_couleur);
    $(`.piece`).off('mousedown',dragS);
  }
}

test=setInterval(joue_uncoups,4000);// fonction qui permet de jouer de jouer si on a le trait
test=setInterval(cr_1_j1,1000);//fonction qui regarde toutes les 1 secondes a quel tour on est et qui a le trait




//quand on commence à deplacer ou clic une piece on doit : mettre en surbrillance uniquement les cases disponibles
// $(`.piece`).mousedown(dragS);
// $(`.piece`).on('click',remise_couleur);
function dragS(e){

  //on supprime les cases déjà surlignées
  enleve_surbrillance(surligne);
  surligne=[];

  //mise à jour des position et du type de la piece bougé
  coord_piece_select = e.target.parentElement["id"];
  type_piece_select = e.currentTarget['alt'];

  //recuperation des coups popssible en fonction de la piece prise
  for (let i=0;i<coups_possible.length;i++){
    if (coups_possible[i][0]==coord_piece_select[4]&&coups_possible[i][1]==coord_piece_select[5]){
      surligne.push(coups_possible[i]);
    }
  }

  // mettre ces cases en subrillance et en droppable
  for(let i=0;i<surligne.length;i++){
    //transformation de la coordonnees en identifiant de case
    let coord="case"+surligne[i][2]+surligne[i][3];

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
  $(`#${case_arrive}`).html('<img class="piece" draggable="true" src="../images/'+type_piece_select+'.png" alt="'+type_piece_select+'">');

    // on supprime l'anciene
  if ((parseInt(coord_piece_select[4])+parseInt(coord_piece_select[5]))%2==0){//la case est noir
    $(`#${coord_piece_select}`).html('<div class="case_noir_case" id="'+coord_piece_select+'"></div>');
  }else{//la case est blanche
    $(`#${coord_piece_select}`).html('<div class="case_blanche_case" id="'+coord_piece_select+'"></div>');
  }

    // cas d'une Promotion
  if ((!(tab_promotion.indexOf(case_arrive)==-1))&&(type_piece_select=="piont_noir")){// si on est dans la derniere ligne et si c'est un piont
    promotion.src = '../promotion.html';
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
    coup=index;
    console.log(coup);

    // on construit la requete

    //on lance la requete pour le php
    joue_j1()
}


// fonction utiles pour les coups des joueurs

function cr_1_j1() {
  fetch('../cr.json.php?partie=' + partie + '&id_joueur="' + id_joueur + '"')
  .then(r => r.json())
  .then(r => {
    trait=parseInt(r['trait']);
    tour=parseInt(r['tour']);
  })
}
function joue_j1(){
  // j1 joue un coup
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
  .then(r => r.json())
  .then(r => {
    console.log(r)
  })
}
function recup_coup_j1(){
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + (trait-1))
  .then(r => r.json())
  .then(r => {
    coups_possible=r["coups"]
    console.log(r)
  })
}





function premier_coup_j2() {
  // j2 commence à jouer, il demande les premiers coups
  var partie = 999;
  var id_joueur = 'j2';
  var cote = 1;
  var tour = 1;
  var trait = 1;

  // sans le coup
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
  .then(r => r.json())
  .then(r => {
    coups_possible=r["coups"]
    console.log(r)
  })
}
function joue_t1_j2() {
  // j2 joue le coup 1 (pion en bas à gauche avance de 2)
  var partie = 999;
  var id_joueur = 'j2';
  var cote = 1;
  var tour = 1;
  var trait = 1;
  var coup = 1;
  fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}
function recup_coup_t1_j1() {
  // j1 récupère le coup de j2


  // sans le coup
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + (trait-1))
  .then(r => r.json())
  .then(r => {
    coups_possible=r['coups'];
    console.log(r)
  })
}
function joue_t1_j1() {
  // j1 joue le coup
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
  .then(r => r.json())
  .then(r => {
    console.log(r)
  })
}
function recup_coup_t2_j2() {
  // j1 récupère le coup de j2
  var partie = 999;
  var id_joueur = 'j2';
  var cote = 1;
  var tour = 1;
  var trait = 2;

  // sans le coup
  fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}
function joue_t2_j2() {
  //88
  var partie = 999;
  var id_joueur = 'j2';
  var cote = 1;
  var tour = 2;
  var trait = 1;
  var coup = 3;
  fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}
function recup_coup_t2_j1() {
  // j1 récupère le coup de j2
  var partie = 999;
  var id_joueur = 'j1';
  var cote = 2;
  var tour = 2;
  var trait = 1;

  // sans le coup
  fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}
function joue_t2_j1() {
  // j1 récupère le coup de j2
  var partie = 999;
  var id_joueur = 'j1';
  var cote = 2;
  var tour = 2;
  var trait = 2;
  var coup = 28;
  fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}
function recup_coup_t3_j2() {
  // j1 récupère le coup de j2
  var partie = 999;
  var id_joueur = 'j2';
  var cote = 1;
  var tour = 3;
  var trait = 2;

  // sans le coup
  fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
  .then(r => r.json())
  .then(r => {
    console.log(r)
  })
}
