let new_partie = document.getElementById('nouvellePartieAmis');
let charger_partie = document.getElementById('chargerPartie');
let liste_partie = document.getElementById('liste_partie');

var emplacement_pseudo = document.getElementById('pseudo');
var pseudo = localStorage.getItem('pseudo');
var partie = localStorage.getItem('id_partie');


emplacement_pseudo.innerHTML = '<p><strong>'+pseudo+'</strong></p>';




charger_partie.addEventListener('click', (a) => {
  a.preventDefault();
  new_partie.style.display = "none";
  partie_encours.style.display = "none";
  partie_temp.style.display = "none";

    fetch('../choixPartie/partie.json.php')
    .then(r => r.json())
    .then(r => {
      bd_parties = r;

      let tableau_parties = document.createElement('table');
      tableau_parties.innerHTML = '<tr><th>Id</th><th>Nom</th><th>Tour</th><th>Trait</th><th>Joueur1</th><th>Joueur2</th><th>Rejoindre cette partie</th></tr>';
      for (let i=0; i<bd_parties.length; i++){
        if (pseudo == bd_parties[i].j1 || pseudo == bd_parties[i].j2){
          let id_partie = bd_parties[i].id;
          let nom_partie = bd_parties[i].nom;
          let tour_partie = bd_parties[i].tour;
          let trait_partie = bd_parties[i].trait;
          let j1_partie = bd_parties[i].j1;
          let j2_partie = bd_parties[i].j2;
          tableau_parties.insertAdjacentHTML('beforeend', '<tr><td>'+id_partie+'</td><td>'+nom_partie+'</td><td>'+tour_partie+'</td><td>'+trait_partie+'</td><td>'+j1_partie+'</td><td>'+j2_partie+'</td><td><form class="formulaire" action="partie.html" method="post"><button type="submit" id="rejoindre">Rejoindre</button></form></td></tr>');
        }
      }
    })
});




// Le joueur désire démarrer une nouvelle partie, on lui affiche au maximum 100 adversaires possible
new_partie.addEventListener('click', (a) => {
  a.preventDefault();

  new_partie.style.display = "none";
  partie_encours.style.display = "none";
  partie_temp.style.display = "none";
  liste_partie.innerHTML = "<input type='text' placeholder='adversaire' id='adversaire'/> <button id='bouton_recherche_adversaire'>Recherche</button>";

  fetch('../log/auth.json.php')
  .then(r => r.json())
  .then(r => {
    bd_joueurs = r;

    let tableau_joueurs = document.createElement('table');
    tableau_joueurs.innerHTML = '<tr><th>Id</th><th>Nom</th><th>Défier ce joueur</th></tr>';
    for (let i=0; i<bd_joueurs.length || i<100; i++){
      if (pseudo != bd_joueurs[i].nom){
        let nom_joueur = bd_joueurs[i].nom;
        tableau_joueurs.insertAdjacentHTML('beforeend', '<tr><td>'+nom_joueur+'</td><td><form class="formulaire" action="partie.html" method="post"><button type="submit" id="defier">Défier</button></form></td></tr>');
      }
    }
  })

  // Si le joueur désire affronter une personne dont il connait le pseudo, il peut le sélectionner
  liste_partie.addEventListener('click', (a) => {
    a.preventDefault();
    let adversaire = document.getElementById('adversaire');
    tableau_joueurs.innerHTML = '';

    fetch('../log/auth.json.php')
    .then(r => r.json())
    .then(r => {
      bd_joueurs = r;

      tableau_joueurs.innerHTML = '<tr><th>Id</th><th>Nom</th><th>Défier ce joueur</th></tr>';
      for (let i=0; i<bd_joueurs.length; i++){
        let nom_joueur = bd_joueurs[i].nom;
        if (pseudo != nom_joueur && nom_joueur.search(adversaire/i)){
          tableau_joueurs.insertAdjacentHTML('beforeend', '<tr><td>'+nom_joueur+'</td><td><form class="formulaire" action="partie.html" method="post"><button type="submit" id="defier">Défier</button></form></td></tr>');
        }
      }
    })
  });
});







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
