//initialisation des Variables issues de l'html
var plateau =  document.getElementById('plateau');
var promo =  document.getElementById('promo');
var container =  document.getElementById('container');
var emplacement_pseudo = document.getElementById('pseudo');
var pseudo = localStorage.getItem('pseudo')
var verif;
var promotion = document.createElement('iframe');
promotion.id="promotion";


//initialisation des variables
var surligne=[];
var coord_piece_select="";
var type_piece_select="";
var case_arrive="";
var rep_iframe="";
var rep_promo="";
var bol_promo=0;
var tab_promotion=["case81", "case82", "case83", "case84", "case85", "case86", "case87","case88"];
var coups_possible="";
var a_demander=0;
var list_vues=[];
var plateau=initialisation_plateau();// la plateau vu par le joueur avec les pieces

//Pseudo du joueur retenu dans la page
emplacement_pseudo = pseudo;

//initialisation des attributs pour les envoies au serveur
var partie = 10;
var id_joueur = 'Sarko';
var cote = 1;
var tour = 1;
var trait = 1;
var coup = 0;

// ajout de Baptiste pour recharger et ne pas toujours retourner dans la BDD
recharger_boutton = document.getElementById('recharger');
recharger_boutton.addEventListener('click',function() {
  fetch('../recharger.php?partie=' + partie)
  .then(r => {
    console.log(r);
  })
})
//Fin ajout Baptiste

//GESTION DES MESSAGES

var message = document.getElementById('felicitations');




//ABANDON
abandonner_boutton = document.getElementById('abandonner');
abandonner_boutton.addEventListener('click',abandonner);

function abandonner() {//fetch permettant d'envoyer un abandon

  fetch('../nul_abandon.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&abandon=" + 1)
  .then(r => r.json())
  .then(r => {
    if (r["requete"]=='ok'){//la demande d'abandon a ete accepte par l'arbitre
      defaite();
    }else{
      console.log("la demande a été refusé");
    }
  })
}

// REMISE DES COULEURS :
//les deux fonctions suivantes permettent de remettre les cases de la bonne couleur des cases surlignées
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

//PROMOTION : Fonction de gestion de la promotion
function fctpromotion() {//elle permet la creation de l'iframe "promotion"
  // On insère l'iFrame de la promotion
  container.removeChild(promo);
  container.appendChild(promotion);
  // On vérifie si la promotion a été terminé (choisi par l'utilisateur) afin de rafficher la carte
  verif = setInterval(verification, 200);
}
function verification() {// Fonction de vérification de la fin de la promotion de rafficher le plateau en le mettant à jour
  message.innerHTML ="Pomotion de pion, veuillez choisir la promotion en bas de l'écran.";
  if(promotion.parentNode != container) {
    container.appendChild(promo);
    clearInterval(verif);//on supprime l'intervalle car l'utilisateur a decide la piece voulu
    if(rep_iframe.toUpperCase()[0]=="R"){// probleme de communication R designe la Reine et non la dame
      rep_iframe="D";
    }
    //on met en place la structure du coup joue pour savoir l'index que l'utilisateur a choisi
    rep_promo='promo'+rep_iframe.toUpperCase()[0];
    var coup_joue=coord_piece_select[4]+","+coord_piece_select[5]+","+case_arrive[4]+","+case_arrive[5];

    //recherhce de l'index
    var index=0;
    for(let i=0;i<coups_possible.length;i++){
      let coup_compare=coups_possible[i][0]+","+coups_possible[i][1]+","+coups_possible[i][2]+","+coups_possible[i][3];
      if (coup_compare==coup_joue){// alors la case de depart et d'arrivee est la même plus qu'a savoir quelle pormotion le joueur a choisi
        if(coups_possible[i].length==5){//alors il s'agit juste d'une promotion sans avoir pris une piece adverse
          if(coups_possible[i][4]==rep_promo){
            index=i;
            break;
          }
        }
        if (coups_possible[i].length==6){//alors il s'agit juste d'une promotion en prenant une piece adverse
          if(coups_possible[i][5]==rep_promo){
            index=i;
            break;
          }
        }
      }
    }
    rep_iframe="";//on reinitialise la reponse de l'iframe si jamais il ya une nouvelle promotion
    coup=index;// on met a jour le coup que l'utilisateur a choisi
    bol_promo=1;//on met a jour la variable qui sera utile plus tard pour informer qu'il y a eu une promotion

    //on lance la requete pour le php
    joue_j2();
    var a_demander=0;
  }
}
function afficheParent(valeur){//fonction qui permet de recuperer la valeur d'une iframe fille
  rep_iframe=valeur;
}



// DEROULEMENT DU JEU

affichage_plateau(plateau);// on affiche le plateau
joue=setInterval(joue_uncoupsbis,1500);// fonction qui permet de jouer si on a le trait, elle permet de savoir quels sont les coups possibles et de declancher les evenements d'ecoute sur les cases
cr=setInterval(cr_1_j2,500);//fonction qui regarde toutes les demi seconde à quel tour on est et qui a le trait

function joue_uncoupsbis(){// permet de lancé les evenements d'ecoutes sur les cases possibles quand on a le trait et d'enlever les evenements d'ecoute quand on n'a pas le trait
  if(trait==1){// c'est à nous de jouer
    message.innerHTML ='A nous de jouer';
    a_demander=recuperer_les_coups_possible(a_demander);
    $(`.piece`).mousedown(dragS); // rajoute l'evenement de drag en drop sur les pieces dont le deplacement est possible
    $(`.piece`).on('click',remise_couleur);// rajoute l'evenement de clic sur les pieces dont le deplacement est possible

  }else{// Nous n'avons plus le trait, c'est à l'autre joueur de jouer
    // on enleve les evenement d'ecoute,; on ne peut plus deplacer les pieces
    $(`.piece`).off('click',remise_couleur);
    $(`.piece`).off('mousedown',dragS);
    message.innerHTML = "En attente de l'adversaire";
    a_demander=0;
    // on doit regarder si on a perdu
    defaite();
  }
}
function recuperer_les_coups_possible(a_demander2){//fonction qui permet de recuperer les coups posssibles
  // a_demander2 est un entier (0 ou 1) qui permet de savoir si l'utilisateur a deja demande les coups possible dans le tour en jeu

  if(a_demander2==0){// alors on n'a jamais demander les coups possibles
    if(tour==1){// le premier tour
      premier_coup_j2();// mettre a jour les informations des coups possibles
    }else{// on est apres le premier tour
      recup_coup_j2(); //mettre a jour les informations des coups possibles
    }
  }
  a_demander2=1// cela permet de ne pas remander toutes les 1 secondes les coups possible et donc de na pas polluer la base de donne qui rajoute ces coups à l'historique
  return a_demander2;
}


//DEPLACEMENT DES PIECES
function dragS(e){// fonction d'evenement : elle permet de mettre en surbrillance les cases possible quand on commence un drag and drop

  //on supprime les cases déjà surlignées
  enleve_surbrillance(surligne);
  surligne=[];

  //mise à jour dde la position et du type de la piece bougée
  coord_piece_select = e.target.parentElement["id"];
  type_piece_select = e.currentTarget['alt'];

  //recuperation des coups popssibles en fonction de la piece prise
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

  //mise à jour de l'echiquier
    //on enleve les cases en surbrillance
  enleve_surbrillance(surligne);
  surligne=[];
  affichage_plateau(plateau);//on affiche le plateau

    // si il y a une promotion il faut que l'utilisateur choissise la piece avant de lancer la requete
  if ((!(tab_promotion.indexOf(case_arrive)==-1))&&(type_piece_select=="piont_blanc")){// si on est dans la derniere ligne et si c'est un pion
    // on fait appel à l'Iframe fille promotion
    promotion.src = '../promotion.html';
    fctpromotion();//la fonction promotion enverra la requete au seveur
  }else{//si il y a pas de promotion on envoie la requete php
    //on trouve l'index du coup joue dans la liste des coups_possible
    //creation de la structure du coup joué
    var coup_joue=coord_piece_select[4]+","+coord_piece_select[5]+","+case_arrive[4]+","+case_arrive[5];
    //recherhce de l'index
    var index=0;
    for(let i=0;i<coups_possible.length;i++){
      let coup_compare=coups_possible[i][0]+","+coups_possible[i][1]+","+coups_possible[i][2]+","+coups_possible[i][3];
      if (coup_compare==coup_joue){
        index=i;
        break;
      }
    }
    coup=index;
    //on lance la requete pour le php
    joue_j2();
    var a_demander=0;
  }
}

//FONCTION D'ENVOIE AU SERVEUR (fetchs)
function joue_j2(){// fetch permettant d'envoyer le coup que le joueur à décidé de réaliser : il permet également d'avoir acces au vues disponible
  // j2 joue un coup
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
  .then(r => r.json())
  .then(r => {
    if((typeof r['erreur'] == 'undefined')){//on doit verifier que le coup est bien accepté par l'arbitre
      //on met le deplacement de la piece a jour sur le plateau
      plateau=maj_plateau_deplacement_piecebis(plateau,r["je_joue"]);
      //on regarde si on n'a pas mis le roi adverse en echec
      if (!(typeof r['fin'] == 'undefined')){// la partie est fini il y a un gagnant
        victoire(r['fin']);
      }
      list_vues=r["vues"];//on recupere les vues
      plateau=maj_plateau_vues(plateau, list_vues);//on met a jour le plateau avec ces nouvelles vues
      affichage_plateau(plateau);//on affiche le plateau
    }
  })
}
function recup_coup_j2(){// fetch permettant de recuperer les coups possibles une fois que l'adversaire au joué :
  fetch('../maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + (trait+1))
  .then(r => r.json())
  .then(r => {
    coups_possible=r["coups"];// on met a jour les coups disponible au joueur
    let coups_vue=r["coups"].concat(r["vues"]);// on cree une liste de toutes les vues possibles (les coups possibles et les vues renvoyé au serveur)

    // quand une piece apparait directement dans une case visible et qu'on peut la manger
    let il_joue=r["il_joue"];
    let nature=r["nature"];
    if (r["pion pris"]==0){
      plateau=maj_plateau_deplacement_piece_il_joue(plateau,il_joue, nature);
    }else{
      plateau=maj_plateau_piece_mangee(plateau,r["pion pris"],nature);
    }

    //on met a jour toutes les vues possibles
    plateau=maj_plateau_vues(plateau,coups_vue);

    //on affiche le plateau avec les nouveaux changements
    affichage_plateau(plateau);
  })
}
function premier_coup_j2() {// fetch permettant de recuperer les coups possibles lors du premier tour des blancs
  // j2 commence à jouer, il demande les premiers coups (demande differents pour le serveur)
  fetch('../maj.json.php?  partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
  .then(r => r.json())
  .then(r => {
    coups_possible=r["coups"];// recupere les premiers coups des blancs
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
function defaite(){// fetch permettant de savoir si on a perdu
  fetch('../maj.json.php?  partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
  .then(r => r.json())
  .then(r => {
    if (!(typeof r['fin'] == 'undefined')){// la partie est fini il y a un gagnant
      victoire(r['fin']);
    }
  })
}


//CIMETIERE
function cimetiere(type_piece_mange, couleur){//permet de rajouter une piece dans les cimetieres
  // cette fonction est appelee pour mettre à jour les cimetieres des qu'une piece est mangée
  // quand on prend une piece ca sera dans je_joue donc dans le fetchs
  // quand je me fais manger ca sera dans plateau_piece_mangee
  // type_piece_mange est un string de la forme "P","T","C","D","R"
  // couleur est un string representant la couleur de la piece mangée (blanc ou noir)


  //on recupere la nature de la piece mangée
  type_piece=type_piece_mange;

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
  if (piece_mangee==1){// le coups est bien une piece qui a ete mangee
    type_piece=type_piece+"_"+couleur;
    var piece_cimetiere = '<img draggable="true" src="../images/'+type_piece+'.png" alt="'+type_piece+'">';
    // on l'ajoute au cimetiere
    if(couleur=="blanc"){// il s'agit d'une piece blanche
      document.getElementById('cimetiere_j2').innerHTML += piece_cimetiere;
    }else{// il s'agit d'une piece noire
      document.getElementById('cimetiere_j1').innerHTML += piece_cimetiere;
    }
  }
}

// BROUILLARD
function case_brouillard (case_b){// met une case dans le brouillard : prend en argument la position de la case du type "casexx" avec xx les coordonnées de la case
    $(`#${case_b}`).html('<div class="case_brouillard" id="'+case_b+'"></div>');
}


//PLATEAU : de l'initialisation jusqu'au deplacement des pieces et de la gestion du brouillard
function initialisation_plateau(){// fonction qui permet la mise en place du plateau des blancs
  let plat=[];
  for (let i=0;i<57;i++) {//les quatres premieres rangées sont initialement dans le brouillard
    if (i<32){
      plat.push("b");
    }
    if(i<48 && i>31){// les deux rangés suivantes sont visibles car les pionts peuvent se deplacer dessus
      plat.push("v")
    }if(i<56 && i>47){// Ensuite il y une rangé de piont
      plat.push("piont_blanc");
    }
    if(i>55){//enfin  il y a les autres pieces
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

function maj_plateau_vues(plateau, vues){// met a jour le plateau en fonction des vues qu'on envoie
  // plateau : l'ancien plateau a mettre a jour
  // vues : ensembles des vues envoyer par le fetchs

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
    }else{// il y a une piece adverse presente sur la case ou c'est un coup (vue) speciale
      let type_piece=vue[4];
      if ((!(vue[4]=="pr"))&&(!(vue[4]=="gr"))&&(!(vue[4]=="promoD"))&&(!(vue[4]=="promoF"))&&(!(vue[4]=="promoC"))&&(!(vue[4]=="promoT"))){//si il ne s'agit pas d'un coup special
        // on regarde quel est le type de la piece qui est presente
        type_piece=nom_piece(vue[4],"noir");
        // on ajoute donc la piece sur l'echiquier
        plateau_maj[coord]=type_piece;
      }else{//il s'agit d'une case de promotion sans une piece adverse
        if((vue[4]=="promoD")||(vue[4]=="promoF")||(vue[4]=="promoC")||(vue[4]=="promoT")){
          plateau_maj[coord]="v";// on met la case en visible
        }
      }
    }
  }
  return plateau_maj;// on renvoie le plateau mis a jour
}

function affichage_plateau(plateau_afficher){// permet d'afficher le plateau avec les pieces et le brouillard
  //plateau_afficher : le plateau qu'on souhaite afficher

  for (let i=0;i<plateau_afficher.length;i++){
    // on transforme la position de la case dans le tableau en coordonéee à afficher
    let lignecase=8-(Math.floor(i/8));
    let colonnecase=(i%8)+1;
    let coord="case"+lignecase+colonnecase;
    let type_de_case=plateau_afficher[i];

    if (type_de_case=="b"){//il s'agit d'une case de brouillard
      case_brouillard(coord);// on met le brouillard sur la case
      continue;
    }

    if (type_de_case=="v"){//il s'agit d'une case visible
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

function maj_plateau_deplacement_piecebis(plateau,je_joue){// deplacement de la piece quand celle si est validée
  //plateau : mettre a joueur le plateau du deplacement de la piece jouee
  //je_joue : le coup joue par l'utilisateur

  let coord_dep=8*(8-parseInt(je_joue[0]))-1+parseInt(je_joue[1]);//coordonnée de la case de depart dans le plateau car l'origine des reperes est differents
  let coord_arr=8*(8-parseInt(je_joue[2]))-1+parseInt(je_joue[3]);//coordonnée de la case d'arrivee dans le plateau car l'origine des reperes est differents
  let type=plateau[coord_dep];// on recupere le type de la piece qui est joué

  //on doit regarder si il s'agit d'un coup special
  if (je_joue.length>4){//alors il s'agit d'un coup speciale
    if (je_joue[4]=="P" || je_joue[4]=="C" || je_joue[4]=="T" || je_joue[4]=="D" || je_joue[4]=="F" || je_joue[4]=="R"){// on a mange une piece adverse
      //on met a jour le cimetiere
      cimetiere(je_joue[4],"noir");
    }

    if(je_joue[4]=="pr"){//il s'agit du petit roque ("pr")
      plateau[63]="v";
      plateau[62]="roi_blanc";
      plateau[61]="tour_blanc";
      plateau[60]="v";
    }

    if (je_joue[4]=="gr"){//il s'agit du grand roque ("gr")
      plateau[60]="v";
      plateau[59]="tour_blanc";
      plateau[58]="roi_blanc";
      plateau[57]="v";
      plateau[56]="b";
    }

    if(bol_promo==1){ //il s'agit d'une promotion
      bol_promo=0;//on met a jour la variable si jamais on a une autre promotion
      if (je_joue.length==5){// il s'agit d'une promo sans prendre de piece adverse
        //on change le type de piece
        type=nom_piece(je_joue[4][5],"blanc");
      }else{// il s'agit d'une promo avec une prise de piece adverse
        //on met a jour le cimetiere
        cimetiere(je_joue[4],"noir");
        //on change le type de piece
        type=nom_piece(je_joue[5][5],"blanc");
      }
    }
  }

  // on met a jour le plateau
  plateau[coord_dep]="b";
  plateau[coord_arr]=type;
  return plateau;
}

function maj_plateau_deplacement_piece_il_joue(plateau, il_joue, nature){// met a jour le plateau du coups de l'ennemie
  //plateau : plateau a mettre a jour
  // il_joue : le coup que l'ennemie a realise
  // nature : type de la piece qui a mange

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

function maj_plateau_deplacement_piece_il_joue_vue(plateau,vues){// met a jour le plateau des nouvelles vues disponible quand l'adversaire a joue
  // plateau : plateau a mettre a jour
  // vues : listes des vues que le joueur peux voir

  for (let i=0;i<vues.length;i++){
    var vue=vues[i];
    let coord=8*(8-vue[2])-1+vue[3];//coordonnée de la case dans le plateau car l'origine des reperes est differents

  if (vue.length==4){//la case est vide alors on met dans le plateau la valeur "v" (vue)
    plateau[coord]="v";
  }else{// il y a une piece adverse presente sur la case
    let type_piece=vue[4];
    if ((!(vue[4]=="pr"))&&(!(vue[4]=="gr"))){//il ne s'agit pas de coups speciaux
      // on regarde quel est le type de piece qui est present
      type_piece=nom_piece(vue[4],"noir");
      // on ajoute donc la piece sur l'echiquier
      plateau[coord]=type_piece;
      }
    }
  }
  return plateau;
}

function maj_plateau_piece_mangee(plateau,il_joue,nature){// met a jour le plateau quand on se fait manger une piece
  //plateau : plateau a mettre a jour
  //il_joue : coup jouer par l'adversaire de la forme {"i" : i, "j" : j,"i_dep" : i_dep, "j_dep" : j_dep, "pion" : "N", "pion_ad" : "N" } avec i et j les coordonnées du pion pris et "N" la nature de la pièce prise (P,T,F,R,D,C)
  //nature : type de la piece qui a mange

  //on cree les variables des positions et des types des pieces
  let piont_ad_i=il_joue["i_dep"];
  let piont_ad_j=il_joue["j_dep"];
  let piont_ad_type=nom_piece(nature,"noir");
  let ligne=il_joue["i"];
  let col=il_joue["j"];
  let type_mangee=il_joue["pion"];
  let coord_piece_mang=8*(8-parseInt(ligne))-1+parseInt(col);
  let coord_dep=8*(8-parseInt(piont_ad_i))-1+parseInt(piont_ad_j);
  //si la piece qui a mangé est toujours vsible alors on l'affiche
  if(!(typeof nature == 'undefined')){
    plateau[coord_piece_mang]=piont_ad_type;
  }else{//Sinon on met la case de l'ennemie dans le brouillard
    plateau[coord_piece_mang]="b";
  }
  cimetiere(type_mangee,"blanc");
  plateau[coord_dep]="b";
  return plateau;
}


//AUTRES FONCTIONS UTILES
function nom_piece(string,couleur){  //renvoie le type de la piece en fonction de l'indication "P", "C" , "T" ...
  //string : nature de la piece "P", "C" , "T", "D", "F"
  //couleur : string indiquant le camp de la piece ("blanc", "noir")

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

function victoire(cote){//creer la fin de partie en cas de victoire
  //cote : numero du coté gagnant (1 pour les blancs et 2 pour les noirs)

  //suppression des setInterval
  clearInterval(joue);
  clearInterval(cr);
  //affichage du gagnant
  if(cote==1){
    message.innerHTML ="Ce sont les blancs qui ont gagné!!";
  }else{
    message.innerHTML ="Ce sont les noirs qui ont gagné!!";
  }
}
