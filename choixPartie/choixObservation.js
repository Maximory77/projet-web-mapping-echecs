let observer = document.getElementById('observer');
let rediffusion = document.getElementById('rediffusion');


var emplacement_pseudo = document.getElementById('pseudo');
var pseudo = localStorage.getItem('pseudo');
var partie = localStorage.getItem('id_partie');


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
