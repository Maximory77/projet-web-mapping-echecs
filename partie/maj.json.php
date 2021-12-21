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
        MAJ($cote);
      }
    } else {
      echo json_encode(array('erreur' => "Le joueur ne correspond pas au côté en entrée."));
    }
  }
} else {
  echo json_encode(array('erreur' => "Erreur de requête de base de données."));
}


function MAJ($cote) {
  /*
  L'adversaire a joué, on veut renvoyer le tour et le trait maj,
  le coup de l'adversaire ainsi que les coups possibles désormais
  */
  $retour = array("coups" => [],"vues"=>[]);
  // on récupère la nouvelle disposition sur la base de données
  $partie = $_GET['partie'];
  $requete_plateau = "SELECT plateau FROM parties WHERE id = $partie";
  $link = mysqli_connect('mysql-kevineuh.alwaysdata.net', 'kevineuh', 'root', 'kevineuh_chess_wihou');
  if ($result = mysqli_query($link,$requete_plateau)) {
    $plateau = json_decode(mysqli_fetch_assoc($result)['plateau'],true);
    //echo $plateau["R1"]["j"];
    // on parcourt toutes les pièces de la couleur du joueur et on ajoute
    // les possibilités dans la liste des possibilités
    foreach ($plateau as $piece => $position) { // on parcourt toutes les pièces
      if ($piece[1] == $cote) { // on ne prend que celles du côté du joueur courant
        // on va alors calculer les possibilités de chaque pièce selon sa valeur
        if ($piece[0] == 'P') {
          $retour_pion = pion($piece,$plateau,$cote,$retour);
          $retour["coups"] = array_merge($retour["coups"],$retour_pion["coups"]);
          $retour["vues"] = array_merge($retour["vues"],$retour_pion["vues"]);
        } else if ($piece[0] == 'F') {
          $retour_fou = fou($piece,$plateau,$cote,$retour);
          $retour["coups"] = array_merge($retour["coups"],$retour_fou["coups"]);
        } else if ($piece[0] == 'T') {
          $retour_tour = tour($piece,$plateau,$cote,$retour);
          $retour["coups"] = array_merge($retour["coups"],$retour_tour["coups"]);
        } else if ($piece[0] == 'D') {
          $retour_dame = dame($piece,$plateau,$cote,$retour);
          $retour["coups"] = array_merge($retour["coups"],$retour_dame["coups"]);
        } else if ($piece[0] == 'C') {
          $retour_cavalier = cavalier($piece,$plateau,$cote,$retour);
          $retour["coups"] = array_merge($retour["coups"],$retour_cavalier["coups"]);
        }
      }
    }
    echo json_encode($retour);
  } else {
    echo json_encode(array("erreur" => "Erreur de requête de base de données."));
  }
}

function pion($piece,$plateau,$cote) {
  $coups_par_pion = array();
  $vues_par_pion = array();
  $i_p = $plateau[$piece]["i"]; // on récupère la coord i du pion
  $j_p = $plateau[$piece]["j"]; // et sa coordonnée j
  // on va tester la couleur du pion
  if ($cote == 1) { // s'il s'agit d'un pion blanc
    $sens = +1; // on va 'avancer' dans le sens i positif
  } else { // si on est du côté des noirs
    $sens = -1; // on va 'avancer' dans le sens i négatif
  }
  // on va parcourir les deux cases devant le pion
  foreach (array($i_p+1*$sens,$i_p+2*$sens) as $i_expl) { // on teste les cases devant le pion
    $occupee = occupee($plateau,$i_expl,$j_p);
    if ($occupee == false) { // s'il n'y a rien sur le chemin
      $coups_par_pion[] = [$i_p,$j_p,$i_expl,$j_p];
    } else if (($i_expl==1 && $cote==1) || ($i_expl==8 && $cote==2)) { // promotion
      // on ajoute les 4 promotions possibles
      $coups_par_pion[] = [$i_p,$j_p,$i_expl,$j_p,"F"];
      $coups_par_pion[] = [$i_p,$j_p,$i_expl,$j_p,"T"];
      $coups_par_pion[] = [$i_p,$j_p,$i_expl,$j_p,"R"];
      $coups_par_pion[] = [$i_p,$j_p,$i_expl,$j_p,"D"];
    } else { // si on rencontre un obstacle
      if ($occupee[1]!=$cote) { // si l'obstacle n'est pas de la couleur du joueur
        $vues_par_pion[] = [$i_p,$j_p,$i_expl,$j_p,$occupee[0]]; // on enregistre cet obstacle dans la valeur "vues"
      }
      break; // puis on coupe la trajectoire
    }
  }
  // puis on teste les cases en diagonale
  foreach (array($j_p-1,$j_p+1) as $j_expl) {
    $occupee = occupee($plateau,$i_p+1*$sens,$j_expl);
    if ($occupee != false) { // s'il y a bien une pièce sur cette case
      if ($occupee[1]!=$cote) { // et si elle n'est pas de la couleur du joueur
        $coups_par_pion[] = [$i_p,$j_p,$i_p+1,$j_expl,$occupee[0]];
      }
    }
  }
  // on renvoie alors le résultat
  return array("coups"=>$coups_par_pion,"vues"=>$vues_par_pion);
}


function cavalier($piece,$plateau,$cote) {
  $coups_par_cavalier = array();
  $i_c = $plateau[$piece]["i"];
  $j_c = $plateau[$piece]["j"];
  // on va parcourir les cases atteintes par le cavalier
  foreach(array(array($i_c-1,$j_c-2),array($i_c+1,$j_c-2),array($i_c+2,$j_c-1),
                array($i_c+2,$j_c+1),array($i_c+1,$j_c+2),array($i_c-1,$j_c+2),
                array($i_c-2,$j_c+1),array($i_c-2,$j_c-1)) as $coord_expl) {
    $i_expl = $coord_expl[0];
    $j_expl = $coord_expl[1];
    if (!(($i_expl<=0)||($i_expl>=9)||($j_expl<=0)||($j_expl>=9))) { // si la case explorée est bien sur l'échiquier
      $occupee = occupee($plateau,$i_expl,$j_expl); // on recherche si elle est occupée
      if ($occupee == false) { // s'il n'y a rien sur cette case
        $coups_par_cavalier[] = [$i_c,$j_c,$i_expl,$j_expl];
      } else { // si on rencontre un obstacle
        if ($occupee[1]!=$cote) { // si l'obstacle n'est pas de la couleur du joueur
          $coups_par_cavalier[] = [$i_c,$j_c,$i_expl,$j_expl,$occupee[0]]; // la pièce peut prendre celle sur la case explorée
        }
      }
    }
  }
  return array("coups"=>$coups_par_cavalier); // on renvoie alors le résultat
}

function fou($piece,$plateau,$cote) {
  $coups_par_fou = array();
  // on va parcourir les cases en diagonale
  foreach (array(array(-1,-1),array(+1,-1),array(-1,+1),array(+1,+1)) as $direction) {
    // on a 4 directions disponibles à tester
    $coups_par_fou = array_merge($coups_par_fou,explore_direction($direction,$plateau,$cote,$piece));
  }
  return array("coups"=>$coups_par_fou); // on renvoie alors le résultat
}


function tour($piece,$plateau,$cote) {
  $coups_par_tour = array();
  // on va parcourir les cases atteintes par la tour
  foreach (array(array(-1,0),array(+1,0),array(0,-1),array(0,+1)) as $direction) {
    // on a 4 directions disponibles
    $coups_par_tour = array_merge($coups_par_tour,explore_direction($direction,$plateau,$cote,$piece));
  }
  return array("coups"=>$coups_par_tour); // on renvoie alors le résultat
}


function dame($piece,$plateau,$cote) {
  $coups_par_dame = array();
  // on va parcourir les cases atteintes par la tour
  foreach (array(array(-1,0),array(+1,0),array(0,-1),array(0,+1),array(-1,-1),array(+1,-1),array(-1,+1),array(+1,+1)) as $direction) {
    // on a 8 directions disponibles
    $coups_par_dame = array_merge($coups_par_dame,explore_direction($direction,$plateau,$cote,$piece));
  }
  return array("coups"=>$coups_par_dame); // on renvoie alors le résultat
}

function explore_direction($direction,$plateau,$cote,$piece) {
  /*
  simule l'exploration d'un fou, d'une tour ou d'une dame.
  Pour cela, prend en entrée la direction choisie, le pateau, le coté et la pièce de base
  Renvoie la liste des coups possibles par la pièce dans cette direction
  */
  $i = $plateau[$piece]["i"];
  $j = $plateau[$piece]["j"];
  $coups_par_piece_dans_direction = array();
  for ($incr=1;$incr<8;$incr++) { // on incrémente d'une case
    $i_expl = $i + $incr*$direction[0];
    $j_expl = $j + $incr*$direction[1];
    if (($i_expl<=0)||($i_expl>=9)||($j_expl<=0)||($j_expl>=9)) {
      break; // si on dépasse du bord on coupe la trajectoire dans cette direction
    } else { // si la case est bien sur l'échiquier
      $occupee = occupee($plateau,$i_expl,$j_expl); // on recherche si elle est occupée
      if ($occupee == false) { // s'il n'y a rien sur cette case
        $coups_par_piece_dans_direction[] = [$i,$j,$i_expl,$j_expl];
      } else { // si on rencontre un obstacle
        if ($occupee[1]!=$cote) { // si l'obstacle n'est pas de la couleur du joueur
          $coups_par_piece_dans_direction[] = [$i,$j,$i_expl,$j_expl,$occupee[0]]; // la pièce peut prendre celle sur la case explorée
        }
        break; // puis on coupe la trajectoire dans cette direction
      }
    }
  }
  return $coups_par_piece_dans_direction;
}


function occupee($plateau,$i_expl,$j_expl) {
  /*
  fonction permettant de tester si une position donnée sur un plateau donné est occupée par une pièce
  renvoie false si non, renvoie la pièce en question si oui
  */
  foreach ($plateau as $piece_testee => $coord_testes) { // on parcourt toutes les pièces
    $i_teste = $coord_testes["i"]; // récupération coordonnée i
    $j_teste = $coord_testes["j"]; // et j
    if (($i_expl==$i_teste) && ($j_expl==$j_teste)) {
      // si elle correspond aux coordonnées explorées
      // on coupe la fonction et on renvoie la pièce rencontrée
      return $piece_testee;
    }
  }
  return false;
}


?>
