// Récupère les éléments HTML nécessaires
let bouton_regis = document.getElementById('bouton_regis');
let bouton_login = document.getElementById('bouton_login');

let erreur_login = document.getElementById('erreur_login');
let erreur_regis = document.getElementById('erreur_regis');

let pagesuivante_login = document.getElementById('pagesuivante_login');
let pagesuivante_regis = document.getElementById('pagesuivante_regis');

var bd_auth;
var bd_regis;

// Vide le local storage si il en existait un, permet de "déconnecter" une personne
localStorage.removeItem("pseudo");
localStorage.removeItem("id_partie");

$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});




// Ajout des event listeners sur les boutons
// Bouton d'inscription
bouton_regis.addEventListener('click', (a) => {
  a.preventDefault();
  erreur_regis.innerHTML = "";
  let pseudo_regis = document.getElementById('pseudo_regis');
  let mdp_regis = document.getElementById('mdp_regis');
  let mail_regis = document.getElementById('mail_regis');
  // Permet de créer un compte à partir d'une adresse mail
  // On y associe un pseudo et un mot de passe
  fetch('../log/auth.json.php')
  .then(r => r.json())
  .then(r => {
    bd_regis = r;
    for (let i=0; i<bd_regis.length; i++){
      if(pseudo_regis.value == bd_regis[i].nom){
        // Chaque pseudo est unique, il ne doit pas avoir été déjà utilisé
        erreur_regis.innerHTML = "<p>Ce pseudo est déjà utilisé</p>";
        break;
      }
      else if(mdp_regis.value.length<3){
        // Un mot de passe doit être de taille supérieure ou égale à 3 caractères
        erreur_regis.innerHTML = "<p>Veuillez choisir un mot de passe de 3 caractères ou plus</p>";
        break;
      }
      else {
        if (i == bd_regis.length-1 && mail_regis.value != bd_regis[i].mail && pseudo_regis.value != bd_regis[i].nom){
          // Si la base de donnée entière a été parcourue sans être interrompue par une des conditions ci-dessus
          // On crée l'entrée dans la base de données, la personne est connectée et on passe sur la page de choix des parties
          var data = 'nom='+pseudo_regis.value+'&mdp='+mdp_regis.value+'&mail='+mail_regis.value;
          fetch('../log/register.json.php',{
            method: 'post',
            body: data,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then(r => r.text())
          .then(r => {
            bd_regis=r;
            // On passe sur la page suivante
            localStorage.setItem('pseudo', pseudo_regis.value);
            pseudo_regis.style.display = "none";
            mdp_regis.style.display = "none";
            mail_regis.style.display = "none";
            pagesuivante_regis.innerHTML = "<a href='../choixPartie/choixPartie.html'> Cliquer ici pour accèder à la page de choix des parties</a>";
          })
        }
      }
    }
  })
});


// Bouton de connexion
bouton_login.addEventListener('click', (a) => {
  a.preventDefault();
  erreur_login.innerHTML = ""
  let pseudo_login = document.getElementById('pseudo_login');
  let mdp_login = document.getElementById('mdp_login');
  let bouton_login = document.getElementById('bouton_login');
  fetch('../log/auth.json.php')
  .then(r => r.json())
  .then(r => {
    bd_auth = r;

    // On regarde dans la base de données si le pseudo et le mot de passe donnés sont dans la base de données
    for (let i=0; i<bd_auth.length; i++){
      if(pseudo_login.value == bd_auth[i].nom && mdp_login.value == bd_auth[i].mdp){
        //L'authentification a fonctionné, on modifie l'affichage et on passe à la page de choix des parties
        localStorage.setItem('pseudo', pseudo_login.value);
        pseudo_login.style.display = "none";
        mdp_login.style.display = "none";
        bouton_login.style.display = "none";
        pagesuivante_login.innerHTML = "<a href='../choixPartie/choixPartie.html'> Cliquer ici pour accèder à la page de choix des parties</a>";
        break;
      }
      else if (i==bd_auth.length-1 && pseudo_login.value != bd_auth[i].nom) {
        //Il faut que le pseudo soit déjà inscrit
        erreur_login.innerHTML = "<p>Ce pseudo n'existe pas</p>";
        break;
      }
      else if (pseudo_login.value == bd_auth[i].nom && mdp_login != bd_auth[i].mdp) {
        //Il faut le bon mot de passe associé au bon compte
        erreur_login.innerHTML = "<p>Mot de passe erroné</p>";
        break;
      }
    }
  })
});
