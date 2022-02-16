
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
    var coup = null;
    display(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 2) {
    explications.innerText = "Le joueur blanc (joueur 2) a reçu les coups disponibles, il joue le pion (2,1) en (4,1)";
    var partie = 2;
    var id_joueur = "j2";
    var cote = 1;
    var tour = 1;
    var trait = 1;
    var coup = 1;
    display(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 3) {
    explications.innerText = "Le joueur noir (j1) reçoit la confirmation du coup joué par le joueur blanc (j2) : pion (2,1) en (4,1), il obtient les coups disponibles, dans ce cas il ne voit que la position finale du pion joué par l'adversaire";
    var partie = 3;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 1;
    var coup = null;
    display(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 4) {
    explications.innerText = "Le joueur noir (j1) reçoit la confirmation du coup joué par j2 (coup impossible (2,1) en (6,1)), il obtient les coups disponibles, dans ce cas il ne voit que la position finale du pion joué par l'adversaire. On remarque bien que j2 a plusieurs coups possibles (avec son cavalier et son pion en (7,2), de plus il a le pion dans la liste 'vues' grace à (7,1))";
    var partie = 4;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 1;
    var coup = null;
    display(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 5) {
    explications.innerText = "Le joueur noir (j1) reçoit la confirmation du coup joué par j2 (coup impossible (6,1) en (2,1)), il obtient les coups disponibles, dans ce cas il ne voit que la position initale du pion joué par l'adversaire";
    var partie = 5;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 1;
    var coup = null;
    display(partie,id_joueur,cote,tour,trait,coup);
  }
  if (value == 6) {
    explications.innerText = "Le joueur noir (j1) reçoit la confirmation du coup joué par j2 (coup impossible (6,1) en (6,2)), il obtient les coups disponibles, dans ce cas il ne voit tout le coup joué par l'adversaire";
    var partie = 6;
    var id_joueur = "j1";
    var cote = 2;
    var tour = 1;
    var trait = 1;
    var coup = null;
    display(partie,id_joueur,cote,tour,trait,coup);
  }

})



function display(partie,id_joueur,cote,tour,trait,coup) {
  fetch('../maj.json.php?  partie=' + partie
                        + '&id_joueur="' + id_joueur
                        + '"&cote=' + cote
                        + "&tour=" + tour
                        + "&trait=" + trait
                        + "&coup=" + coup
                        + '&test_unit=' + test_unit)
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}

/*
function recoit_coup_adv() {
  // j1 récupère le coup de j2
  var partie = 3;
  var id_joueur = "j1";
  var cote = 2;
  var tour = 1;
  var trait = 1;

  // sans le coup
  fetch('../maj.json.php?  partie=' + partie
                        + '&id_joueur="' + id_joueur
                        + '"&cote=' + cote
                        + "&tour=" + tour
                        + "&trait=" + trait
                        + '&test_unit=' + test_unit)
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}


/*
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

function cr_1_j1() {

  var partie = 10;
  var id_joueur = 'j1';

  fetch('../cr.json.php?partie=' + partie
                      + '&id_joueur="' + id_joueur + '"'
                      + '&test_unit=' + test_unit)
  .then(r => r.text())
  .then(r => {
    console.log(r)
  })
}
{"histo":{"0":{"coups":[[2,1,3,1],[2,1,4,1],[2,2,3,2],[2,2,4,2],[2,3,3,3],[2,3,4,3],[2,4,3,4],
[2,4,4,4],[2,5,3,5],[2,5,4,5],[2,6,3,6],[2,6,4,6],[2,7,3,7],[2,7,4,7],[2,8,3,8],[2,8,4,8],[1,2,3,1],
[1,2,3,3],[1,7,3,6],[1,7,3,8]],"vues":[]},"je_joue":[2,3,4,3],"vues":[[2,1,3,1],[2,1,4,1],[2,2,3,2]
,[2,2,4,2],[4,3,5,3],[2,4,3,4],[2,4,4,4],[2,5,3,5],[2,5,4,5],[2,6,3,6],[2,6,4,6],[2,7,3,7],[2,7,4,7]
,[2,8,3,8],[2,8,4,8],[1,2,3,1],[1,2,3,3],[1,7,3,6],[1,7,3,8],[1,4,2,3],[1,4,3,2],
[1,4,4,1]]}}
*/
