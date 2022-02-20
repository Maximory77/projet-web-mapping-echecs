<?php

$link = mysqli_connect('mysql-kevineuh.alwaysdata.net', 'kevineuh', 'root', 'kevineuh_chess_wihou');
// Vérification du lien
if (!$link) {
  echo json_encode(array('erreur' => "Erreur de connexion à la base de données"));
  die('Erreur de connexion');
} else {
  //Prévention de potentiels problèmes d'encodages
  mysqli_set_charset($link, "utf8");

  // récupération des paramètres
  $id_joueur = $_GET['id_joueur'];
  $partie = $_GET['partie'];
  $cote = $_GET['cote'];
  $table = 'parties'; // affectation de la table à utiliser : si on utilise les tests unitaires ou non
  if (isset($_GET['test_unit'])) {
    $table = 'parties_test_unitaire';
  }
  $nul = 0; // paramètre nul
  if (isset($_GET['nul'])) { // si on a bien envoyé le paramètre nul
    if ($_GET['nul']!='undefined') { // et qu'il est bien défini
      $nul = $_GET['nul'];
    }
  }
  // On récupère les noms des joueurs et le paramètre indiquant si le nul a été demandé
  $requete = "SELECT j1,j2,nul FROM $table WHERE id = $partie";
  if ($result_BDD = mysqli_query($link,$requete)) {
    $resultat = mysqli_fetch_assoc($result_BDD);
    // on vérifie que le joueur correspond au bon côté
    if (($id_joueur==$resultat['j1'] AND $cote==2) OR ($id_joueur==$resultat['j2'] AND $cote==1)) {
      // on considère l'action demandée
      if ($nul and ($resultat['nul']==0)) {
        // lorsqu'un nul est demandé, on met à jour la colonne 'nul' de la BDD en lui affectant la valeur 1
        $requete = "UPDATE $table SET nul = 1";
      } elseif (($nul==1) and ($resultat['nul']==1)) {
        // lorsqu'un nul est accepté, la partie se termine : on met à jour la colonne "fin" de la BDD en lui affectant la valeur -1 (nul)
        $requete = "UPDATE $table SET fin = -1"; // on met la BDD à jour
      } elseif (($nul==0) and ($resultat['nul']==1)) {
        // lorsqu'un nul est refusé, on remet seulement la colonne "nul" de la BDD à 0
        $requete = "UPDATE $table SET nul = 0";
      } else {
        // lorsqu'il y a abandon la partie se termine :
        // on met à jour la colonne "fin" de la BDD en lui affectant le coté du joueur demandant l'abandon
        $requete = "UPDATE $table SET fin = $cote";
      }
      envoi_renquete($table,$link,$requete);
    } else {
      echo json_encode(array('erreur' => "Le joueur ne correspond pas au cote en entree."));
    }
  } else {
    echo json_encode(array("erreur" => "Erreur de requete de base de donnees"));
  }
}

function envoi_renquete($table,$link,$requete) {
  if (!(isset($_GET['test_unit']))) { // si on teste le programme, il est inutile de mettre à jour la BDD
    if (mysqli_query($link,$requete)) { // si la base de données à bien été mise à jour
      echo json_encode(array("requete" => "ok"));
    } else {
      echo json_encode(array("requete" => "Erreur de requete de base de donnees"));
    }
  } else {
    echo "retour:\n";
    echo json_encode(array("requete" => "ok"));
    echo "\n\nrequete:\n";
    echo json_encode($requete);
  }
}


?>
