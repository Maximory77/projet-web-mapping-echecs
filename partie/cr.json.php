<?php
/*
  Vérifie id login valide et correspond à un joueur inscrit sur la partie,
  renvoie soit un message d'erreur, soit le compte rendu

  en entrée :
  partie : identifiant de la partie
  id_joueur = nom du joueur

  Compte rendu :
    tour : numéro du tour, le premier tour est le tour 1
    trait : 1 si c'est au blancs de jouer, 2 si c'est aux noirs
    cote : 1 si c'est le blanc qui fait la requete, 2 si c'est le noir, 0 si arbitre
    histo : tableau des différentes MAJ depuis le début de la partie

*/

$link = mysqli_connect('mysql-kevineuh.alwaysdata.net', 'kevineuh', 'root', 'kevineuh_chess_wihou');

//Vérification du lien
if (!$link) {
  echo json_encode(array('erreur' => "Erreur de connexion à la base de données"));
  die('Erreur de connexion');
}

//Prévention de potentiels problèmes d'encodages
mysqli_set_charset($link, "utf8");

if (isset($_GET['partie'])) {

  // s'ils sont bien définis, on récupère les données en entrée
  $partie = $_GET['partie'];
  $id_joueur = $_GET['id_joueur'];

  // vérification id valide et correspond à un joueur inscrit sur la partie
  $requete = "SELECT j1,j2,tour,trait,crj1,crj2 FROM parties WHERE id = $partie";
  if ($result = mysqli_query($link,$requete)) {
    while ($ligne = mysqli_fetch_assoc($result)) {
      if ($ligne['j1'] == $id_joueur) { // s'il s'agit du joueur 1
        $CR = array('tour' => $ligne['tour'], 'trait' => $ligne['trait'], 'cote' => 2, 'histo' => $ligne['histo1']);
        echo json_encode($CR);
      } else if ($ligne['j2'] == $id_joueur) { // s'il s'agit du joeur 2
        $CR = array('tour' => $ligne['tour'], 'trait' => $ligne['trait'], 'cote' => 1, 'histo' => $ligne['histo2']);
        echo json_encode($CR);
      } else {
        echo json_encode(array('erreur' => "Ce participant n'est pas sur cette partie"));
      }
    }
  } else {
    echo json_encode(array('erreur' => "Erreur de requête de base de données."));
  }
} else {
  echo json_encode(array('erreur' => "Erreur de paramètre en entrée"));;
}


?>
