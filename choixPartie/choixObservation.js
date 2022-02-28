// Récupère les éléments id de la page
let observer = document.getElementById('observer');
let rediffusion = document.getElementById('rediffusion');
let liste_partie = document.getElementById('liste_partie');
var emplacement_pseudo = document.getElementById('pseudo');

// Variables nécessaires
var pseudo = localStorage.getItem('pseudo');
var partie = localStorage.getItem('id_partie');

// Affiche le pseudo du joueur sur la page
emplacement_pseudo.innerHTML = '<p><strong>'+pseudo+'</strong></p>';


// Event listener d'observation d'une partie
observer.addEventListener('click', (a) => {
  a.preventDefault();

  observer.style.display = "none";
  rediffusion.style.display = "none";

  fetch('../choixPartie/partie.json.php')
  .then(r => r.json())
  .then(r => {
    bd_parties = r;

    // Résultat sous forme de tableaux
    liste_partie.innerHTML = '<p>Tableau des parties observables</p><table><tr><th>Id</th><th>Nom</th><th>Tour</th><th>Trait</th><th>Joueur1</th><th>Joueur2</th><th>Observer cette partie</th></tr></table>';
    for (let i=0; i<bd_parties.length; i++){
      // On ne peut pas observer une partie dont on est le joueur
      if ('"'+pseudo+'"' !== bd_parties[i].j1 || '"'+pseudo+'"' !== bd_parties[i].j2){
        let fin = bd_parties[i].fin;
        // Si la partie n'est pas encore finie, on peut l'observer.
        if (fin == 0){
          let id_partie = bd_parties[i].id;
          let nom_partie = bd_parties[i].nom;
          let tour_partie = bd_parties[i].tour;
          let trait_partie = bd_parties[i].trait;
          let j1_partie = bd_parties[i].j1;
          let j2_partie = bd_parties[i].j2;
          liste_partie.insertAdjacentHTML('beforeend', '<table><tr><td>'+id_partie+'</td><td>'+nom_partie+'</td><td>'+tour_partie+'</td><td>'+trait_partie+'</td><td>'+j1_partie+'</td><td>'+j2_partie+'</td><td><form class="formulaire" action="../partie/partie.html" method="post"><button type="submit" id="rejoindre">Observer</button></form></td></tr></table>');
        }
      }
    }
  })
});

// Event listener de rediffusion d'une partie
rediffusion.addEventListener('click', (a) => {
  a.preventDefault();

  // Mise en page
  observer.style.display = "none";
  rediffusion.style.display = "none";

  fetch('../choixPartie/partie.json.php')
  .then(r => r.json())
  .then(r => {
    bd_parties = r;

    // Résultat sous forme de tableaux
    liste_partie.innerHTML = '<p>Tableau des parties rediffusables</p><table><tr><th>Id</th><th>Nom</th><th>Tour</th><th>Trait</th><th>Joueur1</th><th>Joueur2</th><th>Rediffuser cette partie</th></tr></table>';
    for (let i=0; i<bd_parties.length; i++){
      let fin = bd_parties[i].fin;
      // Si la partie est finie, on peut la rediffuser.
      if (fin == 1 || fin == 2){
        let id_partie = bd_parties[i].id;
        let nom_partie = bd_parties[i].nom;
        let tour_partie = bd_parties[i].tour;
        let trait_partie = bd_parties[i].trait;
        let j1_partie = bd_parties[i].j1;
        let j2_partie = bd_parties[i].j2;
        liste_partie.insertAdjacentHTML('beforeend', '<table><tr><td>'+id_partie+'</td><td>'+nom_partie+'</td><td>'+tour_partie+'</td><td>'+trait_partie+'</td><td>'+j1_partie+'</td><td>'+j2_partie+'</td><td><form class="formulaire" action="../partie/partie.html" method="post"><button type="submit" id="rejoindre">Rediffuser</button></form></td></tr></table>');
      }
    }
  })
});
