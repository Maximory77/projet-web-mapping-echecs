var test_unit = true;
var select = document.getElementById('test');
var explications = document.getElementById("explications");
var button_ok = document.getElementById("ok");

console.log("c'est parti");

button_ok.addEventListener("click", function() {
  var value = select.options[select.selectedIndex].value;
  console.log(value);
  if (value == 1) {
    explications.innerText = "lors du début de la partie, le joueur blanc doit recevoir les coups disponibles";
    var partie = 1;
    var id_joueur = "j2";
    var cote = 1;
    var tour = 1;
    var trait = 1;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 2) {
    explications.innerText = "Le joueur blanc (joueur 2) a reçu les coups disponibles, il joue le pion (2,1) en (4,1)";
    var partie = 2;
    var id_joueur = "j2";
    var cote = 1;
    var tour = 1;
    var trait = 1;
    var coup = 1;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 3) {
    explications.innerText = "Le joueur noir (j1) reçoit la confirmation du coup joué par le joueur blanc (j2) : pion (2,1) en (4,1), il obtient les coups disponibles, dans ce cas il ne voit que la position finale du pion joué par l'adversaire";
    var partie = 3;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 1;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 4) {
    explications.innerText = "Le joueur noir (j1) reçoit la confirmation du coup joué par j2 (coup impossible (2,1) en (6,1)), il obtient les coups disponibles, dans ce cas il ne voit que la position finale du pion joué par l'adversaire. On remarque bien que j2 a plusieurs coups possibles (avec son cavalier et son pion en (7,2), de plus il a le pion dans la liste 'vues' grace à (7,1))";
    var partie = 4;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 1;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 5) {
    explications.innerText = "Le joueur noir (j1) reçoit la confirmation du coup joué par j2 (coup impossible (6,1) en (2,1)), il obtient les coups disponibles, dans ce cas il ne voit que la position initale du pion joué par l'adversaire";
    var partie = 5;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 1;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 6) {
    explications.innerText = "Le joueur noir (j1) reçoit la confirmation du coup joué par j2 (coup impossible (6,1) en (6,2)), il obtient les coups disponibles, dans ce cas il ne voit tout le coup joué par l'adversaire";
    var partie = 6;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 1;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 7) {
    explications.innerText = "Le joueur noir (j1) a reçu la confirmation du coup joué par j2, il va jouer le premier coup proposé (7,1) en (5,1), on constate qu'il peut voir le pion blanc en face de lui puisque les deux pions à gauche du plateau ont chacun monté de 2 cases";
    var partie = 7;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 2;
    var coup = 1;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 8) {
    explications.innerText = "Le joueur blanc (j2) attend le coup de l'adversaire";
    var partie = 7;
    var id_joueur = "j2";
    var cote = 1;
    var tour = 1;
    var trait = 2;
    var coup = null;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 9) {
    explications.innerText = "Le joueur blanc (j2) va prendre un pion adverse, dans le plateau mis à jour on voit le pion P22 avec des coordonnées null";
    var partie = 9;
    var id_joueur = "j2";
    var cote = 1;
    var tour = 2;
    var trait = 1;
    var coup = 2;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 10) {
    explications.innerText = "Le joueur noir (j1) reçoit le coup, il s'est fait prendre un pion";
    var partie = 10;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 2;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 11) {
    explications.innerText = "Le joueur noir (j1) a reçu la confirmation du coup joué par j2, il va jouer le premier coup proposé (8,4) en (1,4), ce coup fictif va mettre en échec le roi adverse";
    var partie = 11;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 2;
    var coup = 0;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 12) {
    explications.innerText = "Le joueur noir (j1) a reçu la confirmation du coup joué par j2, il va jouer le deuxième coup proposé (8,5) en (3,5), ce coup fictif va mettre en échec le roi adverse";
    var partie = 11;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 2;
    var coup = 1;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 13) {
    explications.innerText = "C'est au joueur 1 de jouer, il demande le nul (nul = 1)";
    var partie = 7;
    var id_joueur = "j1";
    var cote = 2;
    var nul = 1;
    display_nul_abandon(partie,id_joueur,cote,coup,nul);
  }
  if (value == 14) {
    explications.innerText = "Le joueur 1 a demandé le nul, le joueur 2 reçoit cette demande via une requete vers maj.json.php";
    var partie = 14;
    var id_joueur = "j2";
    var cote = 1;
    var tour = 1;
    var trait = 2;
    var coup = null;
    display_maj(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 15) {
    explications.innerText = "Le joueur 1 a demandé le nul, le joueur 2 l'accepte (nul = 1) : fin de la partie";
    var partie = 14;
    var id_joueur = "j2";
    var cote = 1;
    var nul = 1;
    display_nul_abandon(partie,id_joueur,cote,coup,nul);
  }
  if (value == 16) {
    explications.innerText = "Le joueur 1 a demandé le nul, le joueur 2 le refuse (nul = 0)";
    var partie = 14;
    var id_joueur = "j2";
    var cote = 1;
    var nul = 0;
    display_nul_abandon(partie,id_joueur,cote,coup,nul);
  }
})



function display_maj(partie,id_joueur,cote,tour,trait,coup) {
  fetch('../maj.json.php?  partie=' + partie
                        + '&id_joueur="' + id_joueur
                        + '"&cote=' + cote
                        + "&tour=" + tour
                        + "&trait=" + trait
                        + "&coup=" + coup
                        + '&test_unit=' + test_unit
                        + '&coup=' + coup
                        )
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}
function display_nul_abandon(partie,id_joueur,cote,coup,nul) {
  fetch('../nul_abandon.json.php?  partie=' + partie
                        + '&id_joueur="' + id_joueur
                        + '"&cote=' + cote
                        + '&test_unit=' + test_unit
                        + '&coup=' + coup
                        + '&nul=' + nul
                        )
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}
