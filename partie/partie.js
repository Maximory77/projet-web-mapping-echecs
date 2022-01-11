


function cr_1_j1() {
  var partie = 999;
  var id_joueur = 'j1';

  fetch('cr.json.php?partie=' + partie + '&id_joueur="' + id_joueur + '"')
  .then(r => r.text())
  .then(r => {
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
  fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
        '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
  .then(r => r.text())
  .then(r => {
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
  var partie = 999;
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
  var partie = 999;
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

recup_coup_t1_j1();
