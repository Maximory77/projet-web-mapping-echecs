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
var tab_promotion=["case81", "case82", "case83", "case84", "case85", "case86", "case87","case88"];
var coups_possible="";
var a_demander=0;
var list_vues=[];

var plateau=initialisation_plateau();// la plateau vu par le joeur avec les pieces actuelles

//initialisation des attribut pour les envoies au serveur
var partie = 10;
var id_joueur = 'Sarko';
var cote = 1;
var tour = 1;
var trait = 1;
var coup = 0;

// ajout de Baptiste pour recharger et ne pas toujours retourner dans la BDD
recharger_boutton = document.getElementById('recharger')
recharger_boutton.addEventListener('click',function() {
  fetch('../recharger.php?partie=' + partie)
  .then(r => {
    console.log(r)
  })
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

affichage_plateau(plateau);


// DEPLACEMENT DES PIECES

// recuperation des coups possibles :
function joue_uncoupsbis(){
  if(trait==1){// c'est à nous de jouer
    console.log('a nous de jouer');
    a_demander=recuperer_les_coups_possible(a_demander);
    $(`.piece`).mousedown(dragS); // rajoute l'evenement de drag en drop sur les pieces dont le deplacement est possible
    $(`.piece`).on('click',remise_couleur);// rajoute l'evenement de clic sur les pieces dont le deplacement est possible

  }else{// Nous n'avons plus le trait, c'est à l'autre joueur de jouer
    // on enleve les evenement d'ecoute,; on ne peut plus deplacer les pieces
    $(`.piece`).off('click',remise_couleur);
    $(`.piece`).off('mousedown',dragS);
    console.log("j'ai supprimer les drag");
    a_demander=0;
  }
}

function recuperer_les_coups_possible(a_demander2){
  if(a_demander2==0){
    if(tour==1){// le premier tour
      console.log("premeir tour");
      premier_coup_j2();// mettre a jour les informations des coups possibles
    }else{// on est apres le premier tour
      console.log("deuxieme tour");
      recup_coup_j2(); //mettre a jour les informations des coups possibles
    }
  }
  a_demander2=1
  return a_demander2;
}


test=setInterval(joue_uncoupsbis,3000);// fonction qui permet de jouer si on a le trait, elle permet de savoir quels sont les coups possibles et de declancher les evenements d'ecoute sur les cases
test=setInterval(cr_1_j2,500);//fonction qui regarde toutes les deux seconde à quel tour on est et qui a le trait

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
  affichage_plateau(plateau);//on affiche le plateau

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
    console.log(coup_joue);
    for(let i=0;i<coups_possible.length;i++){
      let coup_compare=coups_possible[i][0]+","+coups_possible[i][1]+","+coups_possible[i][2]+","+coups_possible[i][3];
      if (coup_compare==coup_joue){
        index=i;
        console.log(index);
        break;
      }
    }

    // on construit la requete
    coup=index;

    // on met a jour notre cimetiere

    //on met a jour le plateau (deplacement de la piece)
    plateau=maj_plateau_deplacement_piece(plateau,coup_joue,type_piece_select);

    //on lance la requete pour le php
    console.log("plateau avant l'envoie du fetch");
    console.log(plateau);
    joue_j2();
    console.log("plateau juste apres l'envoie du fetch");
    console.log(plateau);
    var a_demander=0;
}




// fonctions utiles pour les coups des joueurs : il s'agit des fetchs pour les envoie au serveur

function joue_j2(){// fetch permettant d'envoyer le coup que le joueur à décidé de réaliser : il permet également d'avoir acces au vues disponible
  // j2 joue un coup
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
  .then(r => r.json())
  .then(r => {
    console.log(r)
    list_vues=r["vues"]//on recupere les vues
    plateau=maj_plateau_vues(plateau, list_vues)//on met a jour le plateau avec ces nouvelles vues
    affichage_plateau(plateau);//on affiche le plateau
    console.log("plateau une fois le fetch terminer");
    console.log(plateau)
  })
}
function recup_coup_j2(){// fetch permettant de recuperer les coups possibles une fois que l'adversaire au joué :
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + (trait-1))
  .then(r => r.json())
  .then(r => {
    coups_possible=r["coups"];
    console.log(r);
    // quand une piece apparait directement dans une case visible et qu'on peut la manger
    let il_joue=r["il_joue"];
    let nature=r["nature"];
    console.log(r["pion pris"]);
    if (r["pion pris"]==0){
      plateau=maj_plateau_deplacement_piece_il_joue(plateau,il_joue, nature);
    }else{
      console.log("je rentre");
      plateau=maj_plateau_piece_mangee(plateau,r["pion pris"]);
    }

    // quand une piece apparait sur une case visible mais qu'on ne peut pas la manger (un piont devant un autre piont)
    let vue=r["vues"];
    if (!(typeof vue[0] == 'undefined')){// la vue existe
      plateau=maj_plateau_deplacement_piece_il_joue_vue(plateau,vue);
    }
    affichage_plateau(plateau);
  })
}
function premier_coup_j2() {// fetch permettant de recuperer les coups possibles lors du premier tour des blancs
  // j2 commence à jouer, il demande les premiers coups
  fetch('../maj.json.php?  partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
  .then(r => r.json())
  .then(r => {
    coups_possible=r["coups"];
    console.log(r);
  })
}
function cr_1_j2() {// fetch permettant de recuperer le compte rendu du joueur j2 : il permet surtout d'avoir acces au trait
  fetch('../cr.json.php?partie=' + partie + '&id_joueur="' + id_joueur + '"')
  .then(r => r.json())
  .then(r => {
    trait=parseInt(r['trait']);
    tour=parseInt(r['tour']);
  })
}

//CIMETIERE

// quand on prend une pice ca sera dans je_joue donc dans le fetchs
//quand je me fais manger ca sera dans plateau_pice_mangee
function cimetiere(coup_effectue, couleur){//permet de rajouter une piece dans les cimetieres
  // coup_effectue array de la forme [i_depart,j_depart,i_arrivee,j_arrivee,option] avec dans options dont l'option correspond à la nature de la piece mangé (P,T,F,R,D,C)
  // couleur est un string representant la couleur de la piece mangée (blanc ou noir)

  //on recupere la nature de la piece mangée
  type_piece=coup_effectue[4];

  //variable permettant de savoir si le coups speciale est bien une piece qui a été mangée
  piece_mangee=0;

  if (type_piece=='P'){//il s'agit d'un pion
    type_piece="piont";
    piece_mangee=1;
  }
  if (type_piece=='T'){// il s'agit d'une tour
    type_piece= "tour";
    piece_mangee=1;
  }
  if (type_piece=='C'){// il s'agit d'un cavalier
    type_piece="cavalier";
    piece_mangee=1;
  }
  if (type_piece=='F'){// il s'agit d'un fou
    type_piece="fou";
    piece_mangee=1;
  }
  if (type_piece=='D'){// il s'agit de la dame
    type_piece="reine";
    piece_mangee=1;
  }
  if (type_piece=='R'){// il s'agit du roi
    type_piece="roi";
    piece_mangee=1;
  }
  if (piece_mangee==1){// le coups est bien une pice qui a ete mangee
    type_piece=type_piece+"_"+couleur;
    // on l'ajoute au cimetiere
    //A MODIFIER en fonction de la couleur pour savoir quel cimetiere
    //$(`#${cimetiere j1}`).html('<img class="piece" draggable="true" src="../images/'+type_piece+'.png" alt="'+type_piece+'">');
  }
}

// BROUILLARD
function case_brouillard (case_b){// met une case dans le brouillard : prend en argument la position de la case du type "casexx" avec xx les coordonnées de la case
    $(`#${case_b}`).html('<div class="case_brouillard" id="'+case_b+'"></div>');
}


function nom_piece(string,couleur){  //renvoie le type de la piece en fonction de l'indication "P", "C" , "T" ...

  let type_piece="";
  if (string=='P'){//il s'agit d'un pion
    type_piece="piont";
  }
  if (string=='T'){// il s'agit d'une tour
    type_piece= "tour";
  }
  if (string=='C'){// il s'agit d'un cavalier
    type_piece="cavalier";
  }
  if (string=='F'){// il s'agit d'un fou
    type_piece="fou";
  }
  if (string=='D'){// il s'agit de la dame
    type_piece="reine";
  }
  if (string=='R'){// il s'agit du roi
    type_piece="roi";
  }
  type_piece=type_piece+"_"+couleur;
  return type_piece;
}


//PLATEAU
function initialisation_plateau(){
  let plat=[];
  for (let i=0;i<57;i++) {
    if (i<32){
      plat.push("b");
    }
    if(i<48 && i>31){
      plat.push("v")
    }if(i<56 && i>47){
      plat.push("piont_blanc");
    }
    if(i>55){
      plat.push("tour_blanc")
      plat.push("cavalier_blanc")
      plat.push("fou_blanc")
      plat.push("reine_blanc")
      plat.push("roi_blanc")
      plat.push("fou_blanc")
      plat.push("cavalier_blanc")
      plat.push("tour_blanc")
    }
  }
  return plat
}

function maj_plateau_vues(plateau, vues){// met a jour le plateau en fonction des vues

  plateau_maj=[];

  // on enleve toutes les cases du plateau qui ne sont pas des pieces de couleur du joueur et on les mets dans le brouillard
  for (let i=0;i<plateau.length;i++){
    if (plateau[i]=="piont_blanc" ||plateau[i]=="tour_blanc" ||plateau[i]=="cavalier_blanc" ||plateau[i]=="fou_blanc" ||plateau[i]=="reine_blanc" ||plateau[i]=="roi_blanc"){
      plateau_maj.push(plateau[i]);
    }else{
     plateau_maj.push("b");
    }
  }

  for (let i=0;i<vues.length;i++){// on met a jour les vues disponibles
    var vue=vues[i];
    let coord=8*(8-vue[2])-1+vue[3];//coordonnée de la case dans le plateau car l'origine des reperes est differents

    if (vue.length==4){//la case est vide alors on met dans le plateau la valeur "v" (vue)
      plateau_maj[coord]="v";//on remplace le brouillard par v

    }else{// il y a une piece adverse presente sur la case
      let type_piece=vue[4];

      // on regarde quel est le type de piece qui est present
      if (type_piece=='P'){//il s'agit d'un pion
        type_piece="piont_noir";
      }
      if (type_piece=='T'){// il s'agit d'une tour
        type_piece= "tour_noir";
      }
      if (type_piece=='C'){// il s'agit d'un cavalier
        type_piece="cavalier_noir";
      }
      if (type_piece=='F'){// il s'agit d'un fou
        type_piece="fou_noir";
      }
      if (type_piece=='D'){// il s'agit de la dame
        type_piece="reine_noir";
      }
      if (type_piece=='R'){// il s'agit du roi
        type_piece="roi_noir";
      }
      // on ajoute donc la piece sur l'echiquier
      plateau_maj[coord]=type_piece;
    }
  }
  return plateau_maj;
}

function affichage_plateau(plateau_afficher){// permet d'afficher le plateau avec les pieces et le brouillard
  for (let i=0;i<plateau_afficher.length;i++){
    // on transforme la position du dans le tableau en coordonéee à afficher
    let lignecase=8-(Math.floor(i/8));
    let colonnecase=(i%8)+1;
    let coord="case"+lignecase+colonnecase;
    let type_de_case=plateau_afficher[i];


    if (type_de_case=="b"){// on met le brouillard sur la case
      case_brouillard(coord);
      continue;
    }

    if (type_de_case=="v"){// on met la vue disponible ; attention a la couleur de la case
      //regarde si la case est noir ou blanche
      if ((lignecase+colonnecase)%2==0){//la case est noir
        $(`#${coord}`).html('<div class="case_noir_case" id="'+coord+'"></div>');
      }else{//la case est blanche
        $(`#${coord}`).html('<div class="case_blanche_case" id="'+coord+'"></div>');
      }
      continue;
    }
    else{// il y a une piece sur la case (blanche ou noir)
      //on doit d'abord mettre la case de la bonne couleur
      if ((lignecase+colonnecase)%2==0){//la case est noir
        $(`#${coord}`).html('<div class="case_noir_case" id="'+coord+'"></div>');
      }else{//la case est blanche
        $(`#${coord}`).html('<div class="case_blanche_case" id="'+coord+'"></div>');
      }

      //puis on doit ajouter la piece sur la case
      $(`#${coord}`).html('<img class="piece" draggable="true" src="../images/'+type_de_case+'.png" alt="'+type_de_case+'">');
      continue
    }

  }
}

function maj_plateau_deplacement_piece(plateau,coup_real,type){
  // met a jour le plateau une fois qu'on a effectuer un coup
  let coord_dep=8*(8-parseInt(coup_real[0]))-1+parseInt(coup_real[2]);//coordonnée de la case dans le plateau car l'origine des reperes est differents
  let coord_arr=8*(8-parseInt(coup_real[4]))-1+parseInt(coup_real[6]);//coordonnée de la case dans le plateau car l'origine des reperes est differents
  plateau[coord_dep]="b";
  plateau[coord_arr]=type;
  return plateau;
}

function maj_plateau_deplacement_piece_il_joue(plateau, il_joue, nature){

  if (il_joue[0]==0 &&(!(il_joue[2]==0))){// alors la piece est apparu
    let coord_arr=8*(8-parseInt(il_joue[2]))-1+parseInt(il_joue[3]);
    let type=nom_piece(nature, "noir");
    plateau[coord_arr]=type;
  }

  if ((!(il_joue[0]==0)) &&(il_joue[2])==0){// alors la piece a disparu
    let coord_dep=8*(8-parseInt(il_joue[0]))-1+parseInt(il_joue[1]);
    plateau[coord_dep]="v";
  }

  if ((!(il_joue[0]==0))&&(!(il_joue[2]==0))){// alors la piece adversaire visible s'est deplacee et est toujours visible
    let coord_dep=8*(8-parseInt(il_joue[0]))-1+parseInt(il_joue[1]);
    let coord_arr=8*(8-parseInt(il_joue[2]))-1+parseInt(il_joue[3]);
    let type=nom_piece(nature,"noir");
    plateau[coord_dep]="b";
    plateau[coord_arr]=type;
  }

  return plateau;
}

function maj_plateau_deplacement_piece_il_joue_vue(plateau,vue){

  let coord_arr=8*(8-parseInt(vue[0][2]))-1+parseInt(vue[0][3]);
  let type=nom_piece(vue[0][4],"noir");
  plateau[coord_arr]=type;
  return plateau;
}

function maj_plateau_piece_mangee(plateau,il_joue){
  //attention le resultat envoyer de il_joue est un string et non un dictionnaire....
  let coord_dep=8*(8-parseInt(il_joue[5]))-1+parseInt(il_joue[11]);
  let type_mangee=il_joue[21];
  plateau[coord_dep]="b";
  return plateau;

}
