/*
var partie = 1;
var id_joueur = 'Sarko';

fetch('cr.json.php?partie=' + partie + '&id_joueur="' + id_joueur + '"')
.then(r => r.json())
.then(r => {
  console.log(r)
})
*/

var partie = 1;
var id_joueur = 'Sarko';
var cote = 2;
var tour = 1;
var trait = 2;
var coup = 2

// sans le coup
fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
      '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait)
.then(r => r.text())
.then(r => {
  console.log(r)
})


/* // avec le coup
fetch('maj.json.php?partie=' + partie + '&id_joueur="' + id_joueur +
      '"&cote=' + cote + "&tour=" + tour + "&trait=" + trait + "&coup=" + coup)
.then(r => r.text())
.then(r => {
  console.log(r)
}) */
