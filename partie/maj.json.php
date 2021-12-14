<?php
/*
  Vérifie id de login est valide et correspond au joueur inscrit sur la partie du côté indiqué (partie, cote)
  vérifie que la partie en est au stade indiqué par les param "tour" et "trait"
  Si le paramètre optionnel fourni est correct (tour indiqué = tour courant, joueur a bien le trait et rang coup valide)
    alors arbitrage est lancé pour jouer le coup et rédiger une nouvelle situation
  Si une des conditions précédentes n'est pas vérifié, erreur lancée

  entrée :
    partie : id de la partie en cours
    cote : 1 si c'est le blanc qui fait la requete, 2 si c'est le noir, 0 si arbitre
    tour : numéro du tour, le premier tour est le tour 1
    trait : 1 si c'est au blancs de jouer, 2 si c'est aux noirs
    coup (optionnel) : rang du coup joué dans le tableau de coups du CR précédent

  sortie :
    erreur si besoin
    si aucune MAJ disponible : {"ras":1}
    sinon : contenu de la MAJ
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
    $tableau = [];
    while ($ligne = mysqli_fetch_assoc($result)) {
      if ($ligne['j1'] == $id_joueur) { // s'il s'agit du joueur 1
        $CR = array('tour' => $ligne['tour'], 'trait' => $ligne['trait'], 'cote' => 2, 'histo' => $ligne['crj1']);
        echo json_encode($CR);
      } else if ($ligne['j2'] == $id_joueur) { // s'il s'agit du joeur 2
        $CR = array('tour' => $ligne['tour'], 'trait' => $ligne['trait'], 'cote' => 1, 'histo' => $ligne['crj2']);
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
