let pseudo = document.getElementById('pseudo');
let mdp = document.getElementById('mdp');
let mail = document.getElementById('mail');
let startButton = document.getElementById('startButton');
let erreur = document.getElementById('erreur');

var BD_auth;

startButton.addEventListener('click', login);


function login(pseudo, mdp){
  fetch('../auth.json.php')
  .then(r => r.json())
  .then(r => {
    BD_auth = r;
  })
  for (let i=0; i<BD_auth.length; i++){
    if(pseudo == BD_auth[i].pseudo && mdp == BD_auth[i].mdp){
      /// on passe à la page suivante
    }
  }
}


function CreationCompte(pseudo, mail, mdp){
  // Fonction permettant de créer un compte à partir d'une adresse mail
  // On y associe un pseudo et un mot de passe
  fetch('../register.json.php')
  .then(r => r.json())
  .then(r => {
    BD_regis = r;
  })
  for (let i=0; i<BD_auth.length; i++){
    if(pseudo == BD_auth[i].pseudo){
      // Chaque pseudo est unique, il ne doit pas avoir été déjà utilisé
      erreur.innerHTML = "Ce pseudo est déjà utilisé"
    }
    else if (mail == BD_auth[i].mail){
      // A chaque adresse mail n'est associé qu'un seul compte
      erreur.innerHTML = "Un compte est déjà associé à cette adresse"
    }
    else if(mdp.length<6){
      // Un mot de passe doit être de taille supérieure 
      erreur.innerHTML = "Veuillez choisir un mot de passe de plus de 6 caractères"
    }
    else {
      // Créer l'entrée dans la base de données
      var data = 'pseudo='+pseudo.value+'&mail='+mail.value+'&mdp='+mdp.value;
      fetch('../register.json.php',{
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(r => r.text())
      .then(r => {
        BD_regis=r;
      })
      erreur.innerHTML = "Votre compte a bien été créé"
    }
  }
}
