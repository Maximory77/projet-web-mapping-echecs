<?php
/*
  Vérifie id de login est valide et correspond au joueur inscrit sur la partie du côté indiqué (partie, cote)
  vérifie que la partie en est au stade indiqué par les param "tour" et "trait"
  Si le paramètre optionnel fourni est correct (tour indiqué = tour courant, joueur a bien le trait et rang coup valide)
    alors arbitrage est lancé pour jouer le coup et rédiger une nouvelle situation

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


// on récupère les données en entrée
$id_joueur = $_GET['id_joueur'];
$partie = $_GET['partie'];
$cote = $_GET['cote'];
$tour = $_GET['tour'];
$trait = $_GET['trait'];

// on effectue toutes les vérifications avant de répartir la tache vers différentes fonctions selon le cas
$requete = "SELECT j1,j2,tour,trait FROM parties WHERE id = $partie";
if ($result = mysqli_query($link,$requete)) {
  while ($ligne = mysqli_fetch_assoc($result)) {
    // on vérifie que le joueur correspond au bon côté
    if (($id_joueur==$ligne['j1'] AND $cote==2) OR ($id_joueur==$ligne['j2'] AND $cote==1)){
      // on vérifie que la partie en est au stade indiqué par les param "tour" et "trait"
      if ($tour==$ligne['tour'] AND $trait==$ligne['trait']) { // A JOUR
        // si on est à jour c'est qu'on veut jouer ou que c'est encore à l'adversaire de jouer
        if (isset($_GET['coup'])) { // le client a lancé un coup
          $coup = $_GET['coup'];
          echo "on a joué";
        } else if ($cote!=$ligne['trait']) { // si on attend le coup de l'adversaire
          echo json_encode(array('ras' => 1));
        } else {
          echo json_encode(array('erreur' => "aucune des situations ne correspond"));
        }
      } else { // si on n'est pas à jour c'est que l'adversaire a joué => MAJ
        echo "adversaire a joué";
      }
    } else {
      echo json_encode(array('erreur' => "Le joueur ne correspond pas au côté en entrée."));
    }
  }
} else {
  echo json_encode(array('erreur' => "Erreur de requête de base de données."));
}


function attente($toto) {
    $toto += 15;
    return $toto + 10;
}



?>
