var partie = 1;
var id_joueur = 'Sarko';

fetch('cr.json.php?partie=' + partie + '&id_joueur="' + id_joueur + '"')
.then(r => r.json())
.then(r => {
  console.log(r)
})
