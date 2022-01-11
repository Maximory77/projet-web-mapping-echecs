var reine = document.getElementById('Reine');
var fou = document.getElementById('Fou');
var cavalier = document.getElementById('Cavalier');
var tour = document.getElementById('Tour');
// var resultat=parent.document.getElementById('promo');
var promo_select="";

//Ajout des listener
reine.addEventListener('click', fcsubmit);
fou.addEventListener('click', fcsubmit);
cavalier.addEventListener('click', fcsubmit);
tour.addEventListener('click', fcsubmit);


function fcsubmit(e) {
  e.preventDefault();
  promo_select=e.target.id

  //on envoie l'informtion à la page mere
  window.parent.afficheParent(promo_select);

  // Supression du choix du conteneur parent
  parent.document.getElementById('container').removeChild(parent.document.getElementById('promotion'));
}
