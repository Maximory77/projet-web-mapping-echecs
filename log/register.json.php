<?php
//Connection à la BDD
$link = mysqli_connect('mysql-kevineuh.alwaysdata.net', 'kevineuh', 'root', 'kevineuh_chess_wihou');

//Vérification
if (!$link) {
  die('Erreur de connexion');
} else {
}


$nom = $_POST['nom'];
$mdp = $_POST['mdp'];
$mail = $_POST['mail'];


$requete = "INSERT INTO login VALUES ('$nom', '$mdp', '$mail')";

mysqli_query($link, $requete);


?>
