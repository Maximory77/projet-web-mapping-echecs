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
var tab_promotion=["case44","case81", "case82", "case83", "case84", "case85", "case86", "case87","case88"];

//initialisation des attribut pour les envoies au serveur
var partie = 10;
var id_joueur = 'j2';
var cote = 1;
var tour = 1;
var trait = 1;
var coup = 0;

// ajout de Baptiste pour recharger et ne pas toujours retourner dans la BDD
recharger_boutton = document.getElementById('recharger')
recharger_boutton.addEventListener('click',function() {
  fetch('../recharger.php?partie=' + partie)
})

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
  // On vérifie si la promotion a été terminé (choisi par l'utilisateur) afin de rafficher la carte
  verif = setInterval(verification, 200);
}


// Fonction de vérification de la fin de la promotion de rafficher la carte en la mettant à jour
function verification() {
  if(promotion.parentNode != container) {
    container.appendChild(promo);
    clearInterval(verif);
    rep_promo=rep_iframe.toLowerCase()+"_blanc";
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
var initialisation_pos =["case21", "case22", "case23", "case24", "case25", "case26", "case27","case28",
                         "case11", "case12", "case13", "case14", "case15", "case16", "case17","case18"];


var initialisation_type = ["piont_blanc", "piont_blanc", "piont_blanc", "piont_blanc", "piont_blanc", "piont_blanc", "piont_blanc","piont_blanc",
                           "tour_blanc", "cavalier_blanc", "fou_blanc", "reine_blanc", "roi_blanc", "fou_blanc", "cavalier_blanc","tour_blanc"];

var initialisation_brouillard=["case81", "case82", "case83", "case84", "case85", "case86", "case87","case88",
                               "case71", "case72", "case73", "case74", "case75", "case76", "case77","case78",
                               "case61", "case62", "case63", "case64", "case65", "case66", "case67","case68",
                               "case51", "case52", "case53", "case54", "case55", "case56", "case57","case58"]

for (let i=0; i<initialisation_pos.length;i++){// met en place les pieces sur le plateau
  coords = initialisation_pos[i];
  var type_ini = initialisation_type[i];
  $(`#${coords}`).html('<img class="piece" draggable="true" src="../images/'+type_ini+'.png" alt="'+type_ini+'">');
}
for (let i=0; i<initialisation_brouillard.length;i++){// met en place le brouillard initiale sur le plateau
  coords = initialisation_brouillard[i];
  case_brouillard(coords);
}



// DEPLACEMENT DES PIECES

// recuperation des coups possibles :

function joue_uncoups(){
  if(trait==1){// c'est à nous de jouer
    if(tour==1){// le premier tour
      premier_coup_j2();// recupere les informations des coups possibles
      $(`.piece`).mousedown(dragS); // rajoute l'evenement de drag en drop sur les pieces dont le deplacement est possible
      $(`.piece`).on('click',remise_couleur);// rajoute l'evenement de clic sur les pieces dont le deplacement est possible

    }else{// on est apres le premier tour
      recup_coup_j2(); //recupere les informations des coups possibles
      $(`.piece`).mousedown(dragS); // rajoute l'evenement de drag en drop sur les pieces dont le deplacement est possible
      $(`.piece`).on('click',remise_couleur);// rajoute l'evenement de clic sur les pieces dont le deplacement est possible
    }
  }else{// Nous n'avons plus le trait, c'est à l'autre joueur de jouer
    // on enleve les evenement d'ecoute,; on ne peut plus deplacer les pieces
    $(`.piece`).off('click',remise_couleur);
    $(`.piece`).off('mousedown',dragS);
  }
}

test=setInterval(joue_uncoups,4000);// fonction qui permet de jouer si on a le trait, elle permet de savoir quels sont les coups possibles et de declancher les evenements d'ecoute sur les cases
test=setInterval(cr_1_j2,1000);//fonction qui regarde toutes les une seconde à quel tour on est et qui a le trait

function dragS(e){// fonction d'evenement : elle permet de mettre en surbrillance les cases possible quand on commence en drag and drop

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

function drop_handler(ev) {// fonction qui permet d'afficher la piece une fois déplacée et d'envoyer la requete au serveur
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
  if ((!(tab_promotion.indexOf(case_arrive)==-1))&&(type_piece_select=="piont_blanc")){// si on est dans la derniere ligne et si c'est un pion
    // on fait appel à l'Iframe fille promotion
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

    // on construit la requete
    coup=index;
    //on lance la requete pour le php
    joue_j2();
}




// fonction utiles pour les coups des joueurs : il s'agit des fetchs pour les envoie au serveur
function cr_1_j2() {// fetch permettant de recuperer le compte rendu du joueur j2 : il permet surtout d'avoir acces au trait
  fetch('../cr.json.php?partie=' + partie + '&id_joueur="' + id_joueur + '"')
  .then(r => r.json())
  .then(r => {
    trait=parseInt(r['trait']);
    tour=parseInt(r['tour']);
  })
}
function joue_j2(){// fetch permettant d'envoyer le coup que le joueur à décidé de réaliser : il permet également d'avoir acces au vues disponible
  // j2 joue un coup
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
  .then(r => r.json())
  .then(r => {
    console.log(r)
  })
}
function recup_coup_j2(){// fetch permettant de recuperer les coups possibles une fois que l'adversaire au joué :
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + (trait+1))
  .then(r => r.json())
  .then(r => {
    coups_possible=r["coups"]
    console.log(r)
  })
}
function premier_coup_j2() {// fetch permettant de recuperer les coups possibles lors du premier tour des blancs
  // j2 commence à jouer, il demande les premiers coups
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
  .then(r => r.json())
  .then(r => {
    coups_possible=r["coups"]
    console.log(r)
  })
}

// fonction inutile a supprimer
function joue_t1_j2() {
  // j2 joue le coup 1 (pion en bas à gauche avance de 2)

  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
  .then(r => r.json())
  .then(r => {
    console.log(r)
  })
}
function recup_coup_t1_j1() {
  // j1 récupère le coup de j2
  var partie = 10;
  var id_joueur = 'j1';
  var cote = 2;
  var tour = 1;
  var trait = 1;

  // sans le coup
  fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}
function joue_t1_j1() {
  // j1 récupère le coup de j2
  var partie = 10;
  var id_joueur = 'j1';
  var cote = 2;
  var tour = 1;
  var trait = 2;
  var coup = 27;
  fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}
function recup_coup_t2_j2() {
  // j1 récupère le coup de j2
  var partie = 10;
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
  var partie = 10;
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
  var partie = 10;
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
  var partie = 10;
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
  var partie = 10;
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



// BROUILLARD
function case_brouillard (case_b){// met une case dans le brouillard : prend en argument la position de la case du type "casexx" avec xx les coordonnées de la case
    $(`#${case_b}`).html('<div class="case_brouillard" id="'+case_b+'"></div>');
}



// function brouillard(list_coord){//prend un argument la sortie du fetch joue_j2 c'est-à-dire la liste des vues : permet d'afficher la liste des vues et de mettre du brouillard sur les autres cases
//
//   var list_case_vide=[]
//   for (let i=0;i<list_coord.length;i++) {
//     var vue=list_coord[i];
//     if (vue.length==4){//la case est vide
//       list_case_vide.push(list_coord[i]);
//     }else{// il y a une piece adverse presente sur la case
//       let type_piece=vue[4];
//       let case="case"+vue[2]+vue[3];
//         //regarde si la case est noir ou blanche
//       if ((vue[2]+vue[3])%2==0){//la case est noir
//         $(`#${case}`).html('<div class="case_noir_case" id="'+case+'"></div>');
//       }
//       if(!(vue[2]+vue[3])%2==0){//la case est blanche
//         $(`#${case}`).html('<div class="case_blanche_case" id="'+case+'"></div>');
//       }
//       // on regarde quel est le type de piece qui est present
//       if (type_piece=='P'){//il s'agit d'un pion
//         type_piece="piont_noir";
//       }
//       if (type_piece=='T'){// il s'agit d'une tour
//         type_piece= "tour_noir";
//       }
//       if (type_piece=='C'){// il s'agit d'un cavalier
//         type_piece="cavalier_noir";
//       }
//       if (type_piece=='F'){// il s'agit d'un fou
//         type_piece="fou_noir";
//       }
//       if (type_piece=='D'){// il s'agit de la dame
//         type_piece="reine_noir";
//       }
//       if (type_piece=='R'){// il s'agit du roi
//         type_piece="roi_noir";
//       }
//       // on ajoute donc la piece sur l'echiquier
//       $(`#${case}`).html('<img class="piece" draggable="true" src="../images/'+type_piece+'.png" alt="'+type_piece+'">');
//     }
//   }
//   // on met en toutes les cases vue en visible et dans la bonne couleur
//   enleve_surbrillance(list_case_vide);
//
//
//  // on doit aussi mettre toutes les autres cases en brouillard (au moins les cases que pouvais voir la piece qui a pouger le tour precedent)
//
//
//
// }
