// Récupère les éléments id de la page
let new_partie = document.getElementById('nouvellePartieAmis');
let charger_partie = document.getElementById('chargerPartie');
let liste_partie = document.getElementById('liste_partie');
var emplacement_pseudo = document.getElementById('pseudo');

// Variables nécessaires
var pseudo = localStorage.getItem('pseudo');
var partie = localStorage.getItem('id_partie');

var bd_parties;

// Affiche le pseudo du joueur sur la page
emplacement_pseudo.innerHTML = '<p><strong>'+pseudo+'</strong></p>';


// Event listener de chargement d'une partie
charger_partie.addEventListener('click', (a) => {
  a.preventDefault();

  // Mise en page
  charger_partie.style.display = "none";
  new_partie.style.display = "none";

  //Récupère les parties en cours accessibles pour le joueur
  fetch('../choixPartie/partie.json.php')
  .then(r => r.json())
  .then(r => {

    bd_parties = r;

    // Résultat sous forme de tableaux
    liste_partie.innerHTML = '<p>Tableau des parties en cours</p><table><tr><th>Id</th><th>Nom</th><th>Tour</th><th>Trait</th><th>Joueur1</th><th>Joueur2</th><th>Rejoindre cette partie</th></tr></table>';
    for (let i=0; i<bd_parties.length; i++){
      if ('"'+pseudo+'"' == bd_parties[i].j1 || '"'+pseudo+'"' == bd_parties[i].j2 || "" == bd_parties[i].j1 || "" == bd_parties[i].j2){

        let id_partie = bd_parties[i].id;
        let nom_partie = bd_parties[i].nom;
        let tour_partie = bd_parties[i].tour;
        let trait_partie = bd_parties[i].trait;
        let j1_partie = bd_parties[i].j1;
        let j2_partie = bd_parties[i].j2;
        let fin = bd_parties[i].fin;

        // Si la partie n'est pas finie, elle peut figurer dans le tableau des parties en cours
        if (fin == 0) {
          liste_partie.insertAdjacentHTML('beforeend', '<table><tr><td>'+id_partie+'</td><td>'+nom_partie+'</td><td>'+tour_partie+'</td><td>'+trait_partie+'</td><td>'+j1_partie+'</td><td>'+j2_partie+'</td><td><form class="formulaire" action="../partie/partie.html" method="post"><button type="submit" id="'+id_partie+'">Rejoindre</button></form></td></tr></table>');

          // // Création de l'eventlistener sur le bouton
          // id_partie.addEventListener('click', () => {
          //
          //   // Si la partie ne contient qu'un joueur, le second joueur est inscrit
          //   if ("" == bd_parties[i].j2) {
          //     // Le joueur rejoint la partie
          //    fetch('../nouvelle_partie.json.php?&id_joueur="' + pseudo + '&partie=' + element_id)
          //    .then(r => r.text())
          //    .then(r => {
          //    })
          //   }
          //
          //
          // // On stocke coté client l'id de la partie sélectionnée
          // localStorage.setItem('id_partie', element_id)
          // });
        }
      }
    }
    })
});



// Le joueur désire démarrer une nouvelle partie, on lui affiche au maximum 100 adversaires possible
new_partie.addEventListener('click', (a) => {
  a.preventDefault();

  // Mise en page
  charger_partie.style.display = "none";
  new_partie.style.display = "none";

  liste_partie.innerHTML = "<p>Tableau des adversaires possibles</p><input type='text' placeholder='adversaire' id='adversaire'/> <button id='bouton_recherche_adversaire'>Recherche</button>";

  // Récupère les pseudos d'adversaires possibles.
  fetch('../log/auth.json.php')
  .then(r => r.json())
  .then(r => {
    bd_joueurs = r;

    liste_partie.insertAdjacentHTML('beforeend','<table><tr><th>Nom</th><th>Défier ce joueur</th></tr><table>');
    for (let i=0; i<bd_joueurs.length || i<100; i++){
      if (pseudo != bd_joueurs[i].nom){
        let nom_joueur = bd_joueurs[i].nom;
        liste_partie.insertAdjacentHTML('beforeend', '<table><tr><td>'+nom_joueur+'</td><td><form class="formulaire" action="../partie/partie.html" method="post"><button type="submit" id="'+nom_joueur+'">Défier</button></form></td></tr></table>');

        // nom_joueur.addEventListener(
        //   fetch('../nouvelle_partie.json.php?&id_joueur="' + pseudo)
        //   .then(r => r.text())
        //   .then(r => {
        //   })
        // );

      }
    }


    // // Création de l'eventlistener sur le bouton de recherche de pseudo
    // bouton_recherche_adversaire.addEventListener('click', (a) => {
    //   a.preventDefault();
    //
    //   // On récupère le texte
    //   let adversaire = document.getElementById('adversaire');
    //
    //   // On recrée le tableau avec les pseudos correspondants
    //   liste_partie.innerHTML = "<p>Tableau des adversaires possibles</p>";
    //
    //   fetch('../log/auth.json.php')
    //   .then(r => r.json())
    //   .then(r => {
    //     bd_joueurs = r;
    //
    //     liste_partie.insertAdjacentHTML('beforeend', '<table><tr><th>Id</th><th>Nom</th><th>Défier ce joueur</th></tr></table>');
    //     for (let i=0; i<bd_joueurs.length; i++){
    //       let nom_joueur = bd_joueurs[i].nom;
    //       if (pseudo != nom_joueur && nom_joueur.search(adversaire/i)){
    //         liste_partie.insertAdjacentHTML('beforeend', '<table><tr><td>'+nom_joueur+'</td><td><form class="formulaire" action="partie.html" method="post"><button type="submit" id="'+nom_joueur+'">Défier</button></form></td></tr></table>');
    //
    //         nom_joueur.addEventListener(
    //           fetch('../nouvelle_partie.json.php?&id_joueur="' + pseudo)
    //           .then(r => r.text())
    //           .then(r => {
    //           })
    //         );
    //       }
    //     }
    //   })
    // });

  })
});
