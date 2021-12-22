let bouton_regis = document.getElementById('bouton_regis');

let pseudo_login = document.getElementById('pseudo_login');
let mdp_login = document.getElementById('mdp_login');
let bouton_login = document.getElementById('bouton_login');

let erreur = document.getElementById('erreur');


var bd_auth;
var bd_regis;



$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});





bouton_regis.addEventListener('click', () => {
  erreur.innerHTML = "";
  let pseudo_regis = document.getElementById('pseudo_regis');
  let mdp_regis = document.getElementById('mdp_regis');
  let mail_regis = document.getElementById('mail_regis');
  console.log("la création du compte commence");
  console.log("ce compte s'appelle "+pseudo_regis.value);
  // Fonction permettant de créer un compte à partir d'une adresse mail
  // On y associe un pseudo et un mot de passe
  fetch('../log/auth.json.php')
  .then(r => r.json())
  .then(r => {
    bd_regis = r;
    for (let i=0; i<bd_regis.length; i++){
      if(pseudo_regis.value == bd_regis[i].nom){
        // Chaque pseudo est unique, il ne doit pas avoir été déjà utilisé
        erreur.innerHTML = "<p>Ce pseudo est déjà utilisé</p>";
        break;
      }
      else if (mail_regis.value == bd_regis[i].mail){
        // A chaque adresse mail n'est associé qu'un seul compte
        erreur.innerHTML = "<p>Un compte est déjà associé à cette adresse</p>";
        break;
      }
      else if(mdp_regis.value.length<3){
        // Un mot de passe doit être de taille supérieure ou égale à 3 caractères
        erreur.innerHTML = "<p>Veuillez choisir un mot de passe de 3 caractères ou plus</p>";
        break;
      }
      else {
        if (i == bd_regis.length-1){
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
          })
        }
      }
    }
  })
});







// bouton_login.addEventListener('click', () => {

  // let pseudo_login = document.getElementById('pseudo_login');
  // let mdp_login = document.getElementById('mdp_login');
  // let bouton_login = document.getElementById('bouton_login');
  // fetch('../log/auth.json.php')
  // .then(r => r.json())
  // .then(r => {
  // // console.log("blabla");
  // // $.ajax({
  // //         url: "../log/auth.json.php",
  // //         type: "GET",
  // //         // data: {"nom": pseudo_login},
  // //         dataType: "json",
  // //         // async: true,         //asynchrone, précision pour certain navigateurs (pas ceux qui pilotent les navires hein)
  // //         success: function(data,status){
  //   bd_auth = r;
  //   console.log(bd_auth);
  // })
// });
  // On regarde dans la base de données si le pseudo et le mot de passe donnés sont dans la base de données
//   for (let i=0; i<bd_auth.length; i++){
//     if(pseudo_login == bd_auth[i].pseudo && mdp_login == bd_auth[i].mdp){
//       //L'authentification a fonctionné, on passe à la page de choix des parties
//       console.log("OK");
//     }
//
//     //
//     //
//     // if(i==bd_auth.length-1 && pseudo_login != bd_auth[i].pseudo){
//     //   // Pour s'authentifier, le pseudo doit exister
//     //   console.log("Ce pseudo n'existe pas");
//     //   alert("Ce pseudo n'existe pas");
//     // }
//     // else if(pseudo_login == bd_auth[i].pseudo && mdp_login != bd_auth[i].mdp){
//     //   // Pour s'authentifier, on vérifie si le mot de passe est associé à ce pseudo
//     //   console.log("Mot de passe erroné");
//     //   alert("Mot de passe erroné");
//     // }
//     // else if(pseudo_login == bd_auth[i].pseudo && mdp_login == bd_auth[i].mdp){
//     //   //L'authentification a fonctionné, on passe à la page de choix des parties
//     //   console.log("OK");
//     // }
//   }
// });
