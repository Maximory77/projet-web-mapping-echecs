// A relier avec le bon id
let bouton_observer = document.getElementById('observer');
let bouton_rejoindre = document.getElementById('chargerPartie');
let bouton_defier = document.getElementById('nouvellePartieAlea');

var emplacement_pseudo = document.getElementById('pseudo');
var pseudo = localStorage.getItem('pseudo');

console.log("bla");
console.log(pseudo);
console.log("blu");

emplacement_pseudo.innerHTML = '<p><strong>'+pseudo+'</strong></p>';


// bouton_observer.addEventListener('click', () => {
//   // Vérifier l'id
//   let liste_partie = document.getElementsById('liste_partie');
//
//   fetch('../choixPartie/partie.json.php')
//   .then(r => r.json())
//   .then(r => {
//     bd_parties = r;
//     let tableau_parties = document.createElement('table');
//     tableau_parties.innerHTML = '<tr><th>Id</th><th>Nom</th><th>Tour</th><th>Trait</th><th>Joueur1</th><th>Joueur2</th><th>Observer cette partie</th></tr>';
//     for (let i=0; i<bd_parties.length; i++){
//       let id_partie = bd_parties[i].id;
//       let nom_partie = bd_parties[i].nom;
//       let tour_partie = bd_parties[i].tour;
//       let trait_partie = bd_parties[i].trait;
//       let j1_partie = bd_parties[i].j1;
//       let j2_partie = bd_parties[i].j2;
//       tableau_parties.insertAdjacentHTML('beforeend', '<tr><td>'+id_partie+'</td><td>'+nom_partie+'</td><td>'+tour_partie+'</td><td>'+trait_partie+'</td><td>'+j1_partie+'</td><td>'+j2_partie+'</td><td><form class="formulaire" action="partie.html" method="post"><button type="submit" id="observer">Observer</button></form></td></tr>');
//     }
//
//   })
// })


// bouton_rejoindre.addEventListener('click', () => {
//   // Vérifier l'id
//   let liste_partie = document.getElementById('liste_partie');
//   // endroit où le nom du joueur est inscrit sur la page html
//   let joueur = document.getElementById('joueur');
//
//   fetch('../choixPartie/partie.json.php')
//   .then(r => r.json())
//   .then(r => {
//     bd_parties = r;
//
//     // Ajouter un entête précisant le nom du tableau ?
//     let tableau_parties = document.createElement('table');
//     tableau_parties.innerHTML = '<tr><th>Id</th><th>Nom</th><th>Tour</th><th>Trait</th><th>Joueur1</th><th>Joueur2</th><th>Rejoindre cette partie</th></tr>';
//     for (let i=0; i<bd_parties.length; i++){
//       if (joueur.value == bd_parties[i].j1 || joueur.value == bd_parties[i].j2){
//         let id_partie = bd_parties[i].id;
//         let nom_partie = bd_parties[i].nom;
//         let tour_partie = bd_parties[i].tour;
//         let trait_partie = bd_parties[i].trait;
//         let j1_partie = bd_parties[i].j1;
//         let j2_partie = bd_parties[i].j2;
//         tableau_parties.insertAdjacentHTML('beforeend', '<tr><td>'+id_partie+'</td><td>'+nom_partie+'</td><td>'+tour_partie+'</td><td>'+trait_partie+'</td><td>'+j1_partie+'</td><td>'+j2_partie+'</td><td><form class="formulaire" action="partie.html" method="post"><button type="submit" id="rejoindre">Rejoindre</button></form></td></tr>');
//       }
//     }
//   })
// })


// bouton_defier.addEventListener('click', () => {
//   // Vérifier l'id
//   let liste_partie = document.getElementById('liste_partie');
//   // endroit où le nom du joueur est inscrit sur la page html
//   let joueur = document.getElementById('joueur');
//
//   // Fetch à faire sur nouvellePartie.json.php ?
//   fetch('../log/auth.json.php')
//   .then(r => r.json())
//   .then(r => {
//     bd_joueurs = r;
//
//     // Ajouter un entête précisant le nom du tableau ?
//     let tableau_joueurs = document.createElement('table');
//     tableau_joueurs.innerHTML = '<tr><th>Id</th><th>Nom</th><th>Défier ce joueur</th></tr>';
//     for (let i=0; i<bd_joueurs.length; i++){
//       if (joueur.value != bd_joueurs[i].nom){
//         let nom_joueur = bd_joueurs[i].nom;
//         tableau_joueurs.insertAdjacentHTML('beforeend', '<tr><td>'+nom_joueur+'</td><td><form class="formulaire" action="partie.html" method="post"><button type="submit" id="defier">Défier</button></form></td></tr>');
//       }
//     }
//   })
// })



///// popup lorsque l'on veut changer de page lorsqu'une partie est en cours
///// afficher le bouton connection si on est pas connecté, deconnection si on est connecté
