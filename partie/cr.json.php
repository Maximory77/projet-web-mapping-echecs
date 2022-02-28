<?php
/*
  renvoie le compte rendu d'un joueur, c'est à dire son historique complet, le tour et le trait de la partie.

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
} else {
  //Prévention de potentiels problèmes d'encodages
  mysqli_set_charset($link, "utf8");

  renvoyer_cr($link);
}

function renvoyer_cr($link) {
  $table = 'parties'; // affectation de la table à utiliser : si on utilise les tests unitaires ou non
  if (isset($_GET['test_unit'])) {
    $table = 'parties_test_unitaire';
  }

  if (isset($_GET['partie'])) {

    // s'ils sont bien définis, on récupère les données en entrée
    $partie = $_GET['partie'];
    $id_joueur = $_GET['id_joueur'];

    // vérification id valide et correspond à un joueur inscrit sur la partie
    $requete = "SELECT j1,j2,tour,trait,histo1,histo2 FROM $table WHERE id = $partie";
    if ($result_BDD = mysqli_query($link,$requete)) {
      $resultat = mysqli_fetch_assoc($result_BDD);
      if ($resultat["j1"] == $id_joueur) { // s'il s'agit du joueur 1
        $CR = array('tour' => $resultat['tour'], 'trait' => $resultat['trait'], 'cote' => 2, 'histo' => $resultat['histo1']);
        echo json_encode($CR);
      } else if ($resultat['j2'] == $id_joueur) { // s'il s'agit du joueur 2
        $CR = array('tour' => $resultat['tour'], 'trait' => $resultat['trait'], 'cote' => 1, 'histo' => $resultat['histo2']);
        echo json_encode($CR);
      } else {
        echo json_encode(array('erreur' => "Ce participant n'est pas sur cette partie"));
      }
    } else {
      echo json_encode(array('erreur' => "Erreur de requete de base de donnees."));
    }
  } else {
    echo json_encode(array('erreur' => "Erreur de paramètres en entrée"));
  }
}


?>
