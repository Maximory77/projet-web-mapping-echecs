var emplacement_pseudo = document.getElementById('pseudo');
var connexion = document.getElementById('connexion');
var container = document.getElementById('container');

// Le joueur s'est déjà connecté, seul le bouton de deconnexion est indiqué
if (localStorage.getItem('pseudo') !== null) {
  var pseudo = localStorage.getItem('pseudo');
  emplacement_pseudo.innerHTML = '<p><strong>'+pseudo+'</strong></p>';
  connexion.innerHTML = "<a class='connection' href='../index.html'>Déconnexion</a>";
}
// Le joueur ne s'est pas encore connecté, seul le bouton de connexion lui est indiqué
else {
  emplacement_pseudo.innerHTML = "Joueur non connecté";
  connexion.innerHTML = "<a class='connection' href='/log/log.html'>Connexion</a>";
  container.innerHTML = "";
}
