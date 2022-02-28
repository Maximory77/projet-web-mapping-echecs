<?php
/*
Ce fichier permet de gérer les demandes/acceptations de nul et les abandons

### Les entrées

- id_joueur : identifiant du joueur avec des double quotes ("id_joueur")
- partie : identifiant de la partie
- cote : côté du joueur (1 ou 2)
- nul (par défaut 0) : si égal à 1 on veut faire une demande ou une acceptation de nul
- abandon (par défaut 0) : si égal à 1 on abandonne la partie
- test_unitaire : si égal à true, on est dans les tests unitaires et la BDD ne sera ainsi pas modifiée


### Les sorties

> Comme le nom du fichier l'indique, les sorties sont sous forme de json

1. **erreurs générales** :
  - {"erreur" : "Erreur de connexion à la base de données"} => mauvaise connexion à la BDD, certainement à cause de la connexion internet
  - {"erreur" : "Erreur de requete de base de donnees"}
  - {"erreur" : "aucune des situations ne correspond"}
  - {"erreur" : "aucune des situations ne correspond"}
2. **CR** : json contenant les paramètres suivants
  - {"requete" : "ok"} => il s'agit du seul retour pour indiquer au joueur que sa requête a bien été prise en compte

*/

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
  $cote_adv = 2; // on initialise le côté de l'adversaire (utile si le joueur demande l'abandon)
  if ($cote==2) {
    $cote_adv = 1; // si cote = 1 alors l'adversaire est du coté 2, sinon on a la bonne valeur pour $cote_adv
  }
  $table = 'parties'; // affectation de la table à utiliser : si on utilise les tests unitaires ou non
  if (isset($_GET['test_unit'])) {
    $table = 'parties_test_unitaire';
  }
  $nul = 0; // paramètre nul par défaut égal à 0
  if (isset($_GET['nul'])) { // si on a bien envoyé le paramètre nul
    if ($_GET['nul']!='undefined') { // et qu'il est bien défini
      $nul = $_GET['nul'];
    }
  }
  $abandon = 0; // paramètre abandon par défaut égal à 0
  if (isset($_GET['abandon'])) { // si on a bien envoyé le paramètre abandon
    if ($_GET['abandon']!='undefined') { // et qu'il est bien défini
      $abandon = $_GET['abandon'];
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
      } elseif ($abandon == 1) {
        // lorsqu'il y a abandon la partie se termine :
        // on met à jour la colonne "fin" de la BDD en lui affectant le coté du joueur demandant l'abandon
        $requete = "UPDATE $table SET fin = $cote_adv";
      } else {
        echo json_encode(array('erreur' => "aucune des situations ne correspond"));
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
