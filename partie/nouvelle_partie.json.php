<?php
/*
Lorsque ce fichier est appelé :
  - on envoie un nom de joueur tout seul : on créée nouvelle partie avec le joueur en coté 2
  - on envoie nom de joueur et une partie : met le joueur dans la partie
*/
$link = mysqli_connect('mysql-kevineuh.alwaysdata.net', 'kevineuh', 'root', 'kevineuh_chess_wihou');
//Vérification du lien
if (!$link) {
  echo json_encode(array('erreur' => "Erreur de connexion à la base de données"));
  die('Erreur de connexion');
} else {
  //Prévention de potentiels problèmes d'encodages
  mysqli_set_charset($link, "utf8");
  $id_joueur = $_GET['id_joueur']; // on récupère l'identifiant du joueur
  echo $id_joueur;
  if (isset($_GET['partie'])) { // si on a bien envoyé une partie
    $partie = $_GET['partie']; // on la récupère
    // dans ce cas on met simplement le joueur dans la partie en j1
    $requete = "UPDATE parties SET j1 = $id_joueur WHERE id = $partie";
  } else { // sinon on va créer la partie
    $requete_prochain_id = "SHOW TABLE STATUS FROM kevineuh_chess_wihou LIKE 'parties' ";
    $requete_base = "SELECT id,tour,trait,histo1,histo2,plateau,nul,fin FROM parties WHERE id = 0";
    if ($result_BDD_prochain_id = mysqli_query($link,$requete_prochain_id)) { // on recherche le prochain id
      if ($result_BDD_base = mysqli_query($link,$requete_base)) {  // on demande également la ligne de base
        $result_prochain_id = mysqli_fetch_assoc($result_BDD_prochain_id);
        $result_base = mysqli_fetch_assoc($result_BDD_base);
        $id_partie = $result_prochain_id['Auto_increment']; // on a ainsi le prochain identifiant
        $trait = $result_base["trait"]; // on peut récupérer les autres paramètres
        $tour = $result_base["tour"];
        $histo1 = $result_base["histo1"];
        $histo2 = $result_base["histo2"];
        $plateau = $result_base["plateau"];
        echo $id_joueur;
        $requete = "INSERT INTO parties (id,trait,tour,histo1,histo2,plateau,j2) VALUES ('$id_partie','$trait','$tour','$histo1','$histo2','$plateau','$id_joueur');";
      }
    } else {
      echo json_encode(array('erreur' => "Erreur de connexion à la base de données"));
    }
  }
  if (!(isset($_GET['test_unit']))) { // si on teste le programme, il est inutile de mettre à jour la BDD
    if ($result = mysqli_query($link,$requete)) {
      echo json_encode(array("nouvelle_parte"=>"ok"));
    } else {
      echo json_encode(array('erreur' => "Erreur de requete de base de données"));
    }
  } else { // RETOUR TESTS UNITAIRES
    echo "\n \nrequete:\n";
    echo $requete;
  }
}

?>
