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
// lien vers la base de données
$link = mysqli_connect('mysql-kevineuh.alwaysdata.net', 'kevineuh', 'root', 'kevineuh_chess_wihou');
// Vérification du lien
if (!$link) {
  echo json_encode(array("erreur" => "Erreur de connexion à la base de données"));
  die('Erreur de connexion');
} else {
  //Prévention de potentiels problèmes d'encodages
  mysqli_set_charset($link, "utf8");

  repartition_cas($link);
}


function repartition_cas($link) {
  /*
  Permet de répartir la demande du joueur vers les fonctions et les retours qui correspondent à sa requete
  */

  // on récupère les données en entrée
  $id_joueur = $_GET['id_joueur'];
  $partie = $_GET['partie'];
  $cote = $_GET['cote'];
  $tour = $_GET['tour'];
  $trait = $_GET['trait'];
  $table = 'parties'; // affectation de la table à utiliser : si on utilise les tests unitaires ou non
  if (isset($_GET['test_unit'])) {
    $table = 'parties_test_unitaire';
  }
  $coup = "null";
  if (isset($_GET['coup'])) { // si on n'a pas envoyé de coup
    if ($_GET['coup']!='undefined') { // ou qu'il a été envoyé mais non rempli
      $coup = $_GET['coup'];
    }
  }

  // on effectue toutes les vérifications avant de répartir la tache vers les différentes fonctions
  $requete = "SELECT j1,j2,tour,trait,nul,fin FROM $table WHERE id = $partie";
  if ($result_BDD = mysqli_query($link,$requete)) {
    $resultat = mysqli_fetch_assoc($result_BDD);
    // on vérifie que le joueur correspond au bon côté
    if (($id_joueur==$resultat['j1'] AND $cote==2) OR ($id_joueur==$resultat['j2'] AND $cote==1)) {
      if ($resultat['fin'] != 0) { // si la partie est terminée on renvoie le côté du gagnant
        echo json_encode(array("fin" => $resultat['fin']));
      } else { // sinon on continue
        if ($resultat['nul']==1) { // on vérifie si une demande de nul a été faite
          echo json_encode(array("nul"=>"demande"));
        } else { // sinon on continue
          // on vérifie que la partie en est au stade indiqué par les param "tour" et "trait"
          if ($tour==$resultat['tour'] AND $trait==$resultat['trait']) { // A JOUR
            // si on est à jour c'est que le joueur joue ou que c'est à l'adversaire de jouer
            if (($coup != "null")) { // le client a lancé un coup
              je_joue($_GET['coup'],$cote,$partie,$tour,$link,$table);
            } else if ($cote!=$resultat['trait']) { // si on attend le coup de l'adversaire
              echo json_encode(array("ras" => 1));
            } else if ($tour==1 AND $trait==1) { // s'il s'agit du tout début du jeu il faut renvoyer les possibilités aux blancs
              premier_coup($partie,$link,$table);
            } else {
              echo json_encode(array("erreur" => "aucune des situations ne correspond."));
            }
          } else { // si on n'est pas à jour c'est que l'adversaire a joué => MAJ
            il_joue($link,$table,$cote);
          }
        }
      }
    } else {
      echo json_encode(array("erreur" => "Le joueur ne correspond pas au cote en entree."));
    }
  } else {
    echo json_encode(array("erreur" => "Erreur de requete de base de donnees."));
  }
}


/*
Fonctions permettant de donner aux blanc les coups pour débuter la partie
*/


function premier_coup($partie,$link,$table) {
  /*
  La partie n'a pas débuté, on veut renvoyer les coups possibles par les blancs
  */
  $retour = array("coups" => [],"vues"=>[]); // initilialisation de l'array envoyé en retour
  // on met à jour les coups et les vues dans l'array $retour
  $retour = set_coups_vues($retour,$plateau,$cote,$coords_coup_adv);
  // On peut alors mettre à jour la BDD
  $histo_joueur_MAJ_str = strval(json_encode(array("histo"=>array($retour))));
  if (!(isset($_GET['test_unit']))) { // si on teste le programme, il est inutile de mettre à jour la BDD
    $requete_MAJ_histo = "UPDATE $table SET histo1 = '$histo_joueur_MAJ_str' WHERE id = $partie";
    if ($result_histos = mysqli_query($link,$requete_MAJ_histo)) {
      echo json_encode($retour); // s'il n'y a pas d'erreur de requete on peut renvoyer le json au joueur
    } else {
      echo json_encode(array("erreur" => "Erreur de requete de base de donnees 4."));
    }
  } else { // pour les tests unitaires on renvoie seulement l'histogramme mis à jour
    echo "retour :\n";
    echo json_encode($retour);
    echo "\n \nrequete BDD :\n";
    echo $requete_MAJ_histo;
  }
}


/*
Fonctions permettant de mettre en place le coup joué par le joueur
*/

function je_joue($i_coup,$cote,$partie,$tour,$link,$table) {
  /*
  Le joueur lance un coup :
    - on va récupérer les historiques des joueurs et le plateau afin de récupérer les coordonnées du coup joué
    - on met à jour le plateau
      - si le joueur met son roi en échec : on lui renvoie un message d'erreur
      - sinon :
        si le joueur met le roi adverse en échec: il gagne (retour différent)
        on utilise le plateau mis à jour pour pouvoir renvoyer les nouvelles cases vues
        on met à jour la BDD
  */
  // récupération des historiques des joueurs et du plateau
  $requete_je_joue = "SELECT histo1,histo2,plateau FROM $table WHERE id = $partie";
  if ($result_je_joue = mysqli_query($link,$requete_je_joue)) {
    $result_je_joue_array = mysqli_fetch_assoc($result_je_joue);
    $plateau = json_decode($result_je_joue_array['plateau'],true);
    $histo_joueur = json_decode($result_je_joue_array['histo'.$cote],true);
    $coord_coup_joueur = end($histo_joueur["histo"])["coups"][$i_coup]; // récupération des coordonnées du coup fait par le joueur
    // calcul du nouveau plateau
    $plateau_MAJ = plateau_MAJ($coord_coup_joueur,$plateau,$cote);
    if ($plateau_MAJ == false) { // si le coup n'est pas valide (le joueur met son roi en échec)
      echo json_encode(array("erreur" => "Coup invalide")); // on renvoie un message d'erreur
    } else { // sinon on prépare la réponse de confirmation pour le joueur
      $retour = array("je_joue" => $coord_coup_joueur,"vues" => array());
      // on calcule les nouvelles cases vues
      foreach ($plateau_MAJ as $piece => $position) { // on parcourt toutes les pièces
        $retour_piece = coups_vues_par_piece($piece,$plateau_MAJ,$cote);
        $retour["vues"] = array_merge($retour["vues"],$retour_piece["coups"]);
        $retour["vues"] = array_merge($retour["vues"],$retour_piece["vues"]);
      }
      // on met à jour l'histo du joueur et le plateau dans la BDD;
      $histo_joueur['histo'][strval(sizeof($histo_joueur['histo']))] = $retour;
      $histo_joueur_MAJ_str = strval(json_encode($histo_joueur)); // histo MAJ du joueur en string
      $plateau_MAJ_str = strval(json_encode($plateau_MAJ)); // plateau MAJ en string
      $cote_adv = 2; // on initialise le côté de l'adversaire (utile pour déterminer si le roi adverse est mis en échec)
      if ($cote==2) { // si on est du cote des noirs on va changer de tour et de trait
        $tour = intval($tour)+1; // on incrémente le tour
        $trait = 1; // le trait est à l'adversaire
        $cote_adv = 1; // si cote = 1 alors l'adversaire est du coté 2
      } else { // si on est chez les blancs on reste dans le même tour
        $trait = 2; // le trait est à l'adversaire
      }
      if (echec_au_roi($plateau_MAJ,$cote_adv)) { // si le roi adverse a été mis en échec
        // on met à jour la BDD en mettant bien fin = coté du joueur gagnant
        $requete_MAJ = "UPDATE $table SET   histo" . $cote . " = '$histo_joueur_MAJ_str',
                                            plateau = '$plateau_MAJ_str',
                                            fin = $cote,
                                            tour = $tour
                                            WHERE id = $partie";
        $retour["fin"] = $cote; // on avertit alors le joueur de sa victoire
      } else { // sinon
        // on met à jour la BDD avec le trait
        $requete_MAJ = "UPDATE $table SET   histo" . $cote . " = '$histo_joueur_MAJ_str',
                                            plateau = '$plateau_MAJ_str',
                                            trait = $trait,
                                            tour = $tour
                                            WHERE id = $partie";
      }
      if (!(isset($_GET['test_unit']))) { // si on teste le programme, il est inutile de mettre à jour la BDD
        if (mysqli_query($link,$requete_MAJ)) { // si la base de données à bien été mise à jour
          echo json_encode($retour);
        } else {
          echo json_encode(array("erreur" => "Erreur de requete de base de donnees."));
        }
      } else { // RETOUR TESTS UNITAIRES
        echo "retour :\n";
        echo json_encode($retour);
        echo "\n \nplateau MAJ :\n";
        echo json_encode($plateau_MAJ);
        echo "\n \nrequete:\n";
        echo json_encode($requete_MAJ);
      }
    }
  } else {
    echo json_encode(array("erreur" => "Erreur de requete de base de donnees."));
  }
}


function plateau_MAJ($coords_coup_joueur,$plateau,$cote) {
  /*
  lorsqu'un joueur joue, on va caluler les modifications sur le plateau
  on cherche également à savoir s'il ne met pas son roi en échec
  renvoie le nouveau plateau si le coup est valide, false sinon
  */
  foreach ($plateau as $piece => $position) { // on parcourt chaque pièce du plateau
    // si la pièce parcourue correspond à la pièce que le joueur veut bouger
    if (($position["i"]==$coords_coup_joueur[0]) && ($position["j"]==$coords_coup_joueur[1])) {
      $plateau[$piece]["i"] = $coords_coup_joueur[2];
      $plateau[$piece]["j"] = $coords_coup_joueur[3];
      if (sizeof($coords_coup_joueur) >= 5) { // si on a une ou plusieurs option
        $option = $coords_coup_joueur[sizeof($coords_coup_joueur)-1]; // on récupère l'option
        if ($option == "pp") { // s'il s'agit d'une prise en passant
          $pion_pris = occupee($plateau,$coords_coup_joueur[0],$coords_coup_joueur[3]);
          $plateau[$pion_pris]["i"] = null;
          $plateau[$pion_pris]["j"] = null;
        } elseif (substr($option,0,5) == "promo") { // s'il s'agit d'une promotion
          $plateau[substr($option,5,1) . $cote . "promu"] = array("i"=>$coords_coup_joueur[2],"j"=>$coords_coup_joueur[3]); // on ajoute une nouvelle pièce
          unset($plateau[$piece]); // on supprime alors le pion qui vient d'être promu
        } else { // on a alors un roque
          // on va prendre en compte la ligne sur laquelle s'effectue le roque (1 ou 8 selon le côté)
          $ligne = 1;
          if ($cote == 2) {
            $ligne = 8;
          }
          if ($option == "pr") { // s'il s'agit d'un petit roque
            $plateau[$piece] = ["i"=>$ligne,"j"=>7]; // le roi est placé en colonne 7
            $plateau["T".$cote."2"] = ["i"=>$ligne,"j"=>6]; // la tour est placée en colonne 6
          } elseif ($option == "gr") { // s'il s'agit d'un grand roque
            $plateau[$piece] = ["i"=>$ligne,"j"=>3]; // le roi est placé en colonne 3
            $plateau["T".$cote."1"] = ["i"=>$ligne,"j"=>4]; // la tour est placée en colonne 4
          }
        }
      }
    }
    // si la pièce parcourue correspond à la position d'arrivée de la pièce on la supprime en lui donnant des coordonnées null
    if (($position["i"]==$coords_coup_joueur[2]) && ($position["j"]==$coords_coup_joueur[3])) {
      $plateau[$piece]["i"] = null;
      $plateau[$piece]["j"] = null;
    }
  }
  // on vérifie que le joueur ne met pas son roi en echec
  if (echec_au_roi($plateau,$cote)) {
    return false; // si oui on retourne false
  } else { // si non on retourne le plateau
    return $plateau;
  }
}


function echec_au_roi($plateau,$cote) {
  /*
  on cherche à savoir si le roi du côté $cote est mis en échec
  renvoie true si oui, false sinon
  */
  $cote_adv = 1;
  if ($cote == 1) {
    $cote_adv = 2;
  }
  foreach ($plateau as $piece => $position) { // on parcourt toutes les pièces
    if ($piece[1] != $cote) { // on ne prend que celles de l'adversaire au joueur de ce côté
      // on va alors chercher si la pièce peut prendre le roi
      if ($piece[0] == 'P') { // il s'agit d'un pion
        $retour_piece = pion($piece,$plateau,$cote_adv);
      } else if ($piece[0] == 'F') { // il s'agit d'un fou
        $retour_piece = fou($piece,$plateau,$cote_adv,$retour);
      } else if ($piece[0] == 'T') { // il s'agit d'une tour
        $retour_piece = tour($piece,$plateau,$cote_adv,$retour);
      } else if ($piece[0] == 'D') { // il s'agit de la dame
        $retour_piece = dame($piece,$plateau,$cote_adv,$retour);
      } else if ($piece[0] == 'C') { // il s'agit d'un cavalier
        $retour_piece = cavalier($piece,$plateau,$cote_adv,$retour);
      } else { // il s'agit d'un roi
        $retour_piece = roi($piece,$plateau,$cote_adv,$retour);
      } // on teste si l'un des coups consiste à prendre le roi
      foreach ($retour_piece["coups"] as $coup) {
        if (sizeof($coup) == 5) {
          if ($coup[4] == "R") {
            return true;
          }
        }
      }
    }
  }
  return false;
}

/*
Fonctions permettant de mettre en place le coup joué par l'adversaire
*/

function il_joue($link,$table,$cote) {
  /*
  L'adversaire a joué, on veut renvoyer le coup de l'adversaire selon sa visibilité
  ainsi que les coups possibles par le joueur et les cases vues
  */
  $retour = array("coups" => [],"vues"=>[],"il_joue" => [0,0,0,0],"pion pris" => 0); // initilialisation de l'entité envoyé en retour
  $partie = $_GET['partie'];
  $requete_histos = "SELECT histo1,histo2,plateau FROM $table WHERE id = $partie";
  if ($result_histos = mysqli_query($link,$requete_histos)) {
    // récupération des historiques des joueurs
    $histos = mysqli_fetch_assoc($result_histos);
    if ($cote == 1) {
      $cle_histo_joueur = 'histo1';
      $cle_histo_adv = 'histo2';
    } else {
      $cle_histo_joueur = 'histo2';
      $cle_histo_adv = 'histo1';
    }
    $histo_joueur = json_decode($histos[$cle_histo_joueur],true);
    $histo_adv = json_decode($histos[$cle_histo_adv],true);
    $plateau = json_decode($histos["plateau"],true);
    // récupération des coordonnées du dernier coup de l'adversaire
    $coords_coup_adv = end($histo_adv["histo"])["je_joue"];
    // on met à jour les coups et les vues dans l'array $retour
    $retour = set_coups_vues($retour,$plateau,$cote,$coords_coup_adv);
    // on teste alors si on peut ajouter les coordonnées et la nature ou si elles restent cachées
    if (sizeof($coords_coup_adv) == 5) {
      $retour["pion pris"] = json_encode(array("i"=>$coords_coup_adv[2],"j"=>$coords_coup_adv[3],"pion"=>$coords_coup_adv[4]));
    }
    $retour = verif_coords_depart_vues($coords_coup_adv,$retour,$plateau);
    $retour = verif_coords_fin_vues($coords_coup_adv,$retour,$plateau);
  } else {
    echo json_encode(array("erreur" => "Erreur de requete de base de donnees"));
  }
  // on met à jour la colonne histo du joueur dans la base de données
  $histo_joueur['histo'][strval(sizeof($histo_joueur['histo']))] = $retour;
  $histo_joueur_MAJ_str = strval(json_encode($histo_joueur));
  $requete_MAJ_histo = "UPDATE $table SET $cle_histo_joueur = '$histo_joueur_MAJ_str' WHERE id = $partie";
  if (!(isset($_GET['test_unit']))) {
    // on met à jour l'histogramme du joueur
    if ($result_histos = mysqli_query($link,$requete_MAJ_histo)) {
      echo json_encode($retour); // s'il n'y a pas d'erreur on peut renvoyer le json
    } else {
      echo json_encode(array("erreur" => "Erreur de requete de base de donnees 4."));
    }
  } else { // si on teste le programme, il est inutile de mettre à jour la BDD
    echo "retour :\n";
    echo json_encode($retour);
    echo "\n \nplateau :\n";
    echo json_encode($plateau);
    echo "\n \nrequete BDD :\n";
    echo $requete_MAJ_histo;
  }
}


function verif_coords_depart_vues($coords_coup_adv,$retour,$plateau) {
  /*
  vérifie si la position de départ du coup joué par l'adversaire est visible par le joueur,
  renvoie la variable $retour mise à jour
  exploration des cases vues par le joueur au moment courant, calculées dans le retour dans "coups" et "vues"
  */
  foreach(array("coups","vues") as $cle) {
    $vues_par_joueur = $retour[$cle];
    if (isset($vues_par_joueur)) { // on récupère une par une les listes de cases vues par le joueur actuellement
      foreach($vues_par_joueur as $case_exploree) { // on parcourt ces cases
        if ((($coords_coup_adv[0]==$case_exploree[0]) && ($coords_coup_adv[1]==$case_exploree[1]))
        || (($cle=="coups") && ($coords_coup_adv[0]==$case_exploree[2]) && ($coords_coup_adv[1]==$case_exploree[3]))) {
          // si on retrouve les deux mêmes coords, c'est que cette case est vue
          // on peut ajouter les coordonnées au retour
          $retour["il_joue"][0] = $coords_coup_adv[0];
          $retour["il_joue"][1] = $coords_coup_adv[1];
          break 2; // il est alors inutile de parcourir les autres coordonnées
        }
      }
    }
  }
  return $retour;
}


function verif_coords_fin_vues($coords_coup_adv,$retour,$plateau) {
  /*
  vérifie si la position de fin du coup joué par l'adversaire est visible par le joueur,
  renvoie la variable $retour mise à jour
  exploration des cases vues par le joueur au moment courant, calculées dans le retour dans "coups" et "vues"
  */
  foreach(array("coups","vues") as $cle) {
    $vues_par_joueur = $retour[$cle];
    if (isset($vues_par_joueur)) { // on récupère une par une les listes de cases vues par le joueur actuellement
      foreach($vues_par_joueur as $case_exploree) { // on parcourt ces cases
        if ((($coords_coup_adv[2]==$case_exploree[0]) && ($coords_coup_adv[3]==$case_exploree[1]))
        || (($cle=="coups") && ($coords_coup_adv[2]==$case_exploree[2]) && ($coords_coup_adv[3]==$case_exploree[3]))) {
          // si on retrouve les deux mêmes coords, c'est que cette case est vue
          // s'il s'agit d'une liste "coords" il faut prendre en compte les coords d'index 2 et 3
          // on peut ajouter les coordonnées au retour
          $retour["il_joue"][2] = $coords_coup_adv[2];
          $retour["il_joue"][3] = $coords_coup_adv[3];
          $retour["nature"] = occupee($plateau,$coords_coup_adv[2],$coords_coup_adv[3])[0]; // on ajoute la valeur de la pièce
          break 2; // il est alors inutile de parcourir les autres coordonnées
        }
      }
    }
  }
  return $retour;
}


function set_coups_vues($retour,$plateau,$cote,$coords_coup_adv) {
  /*
  permet de mettre à jour l'array $retour, notamment les listes de coordonnées de clés 'coups' et 'vues'
  Pour cela on va parcourir toutes les pièces du joueur
  retourne $retour mis à jour
  */
  foreach ($plateau as $piece => $position) { // on parcourt toutes les pièces
    $retour_piece = coups_vues_par_piece($piece,$plateau,$cote);
    // et on ajoute les possibilités dans la liste des possibilités
    $retour["coups"] = array_merge($retour["coups"],$retour_piece["coups"]);
    $retour["vues"] = array_merge($retour["vues"],$retour_piece["vues"]);
  }
  // on rajoute les prises en passant
  $retour = prise_en_passant($retour,$plateau,$cote,$coords_coup_adv);
  return $retour;
}


function prise_en_passant($retour,$plateau,$cote,$coords_coup_adv) {
  /*
  permet de prendre en compte une prise en passant si l'adversaire a avancé son pion de deux cases et si on a un pion placé à côté
  renvoie $retour mis à jour
  */
  if ($cote == 1) { // s'il s'agit d'un pion blanc
    $sens = +1; // on va 'avancer' dans le sens i positif
  } else { // si on est du côté des noirs
    $sens = -1; // on va 'avancer' dans le sens i négatif
  }
  // on récupère quelques informations liées au coup joué par l'adversaire
  $i_dep_coup_adv = $coords_coup_adv[0];
  $i_fin_coup_adv = $coords_coup_adv[2];
  $j_fin_coup_adv = $coords_coup_adv[3];
  $piece_jouee_par_adv = occupee($plateau,$i_fin_coup_adv,$j_fin_coup_adv);
  if (($piece_jouee_par_adv[0]=="P") and (abs($i_dep_coup_adv-$i_fin_coup_adv)==2)) {
    // l'adversaire a bien avancé un pion de deux cases
    foreach (array($j_fin_coup_adv-1,$j_fin_coup_adv+1) as $j_expl) { // on parcourt ses deux cases voisines
      if (occupee($plateau,$i_fin_coup_adv,$j_expl)[0]=="P") { // si la case contient un pion
        if (occupee($plateau,$i_fin_coup_adv,$j_expl)[2]==$cote) { // et qu'il appartient au joueur
          $coup_par_pion = array([$i_fin_coup_adv,$j_expl,$i_fin_coup_adv+1*$sens,$j_fin_coup_adv,"pp"]);
          $retour["coups"] = array_merge($retour["coups"],$coup_par_pion);
        }
      }
    }
  }
  return $retour;
}


/*
Fonctions permettant de renvoyer les coups et les vues pour une pièce dans un sitution particulière
*/

function coups_vues_par_piece($piece,$plateau,$cote) {
  /*
  Renvoie les coups possibles par la pièce et les cases vues
  */
  $retour_piece = array("coups" => array(),"vues" => array());
  if (($plateau[$piece]["i"] != null) && ($plateau[$piece]["j"] != null)) { // on vérifie que la pièce n'a pas été prise
    if ($piece[1] == $cote) { // on ne prend que celles du côté du joueur courant
      // on va alors calculer les possibilités de chaque pièce selon sa valeur
      if ($piece[0] == 'P') { // il s'agit d'un pion
        $retour_piece = pion($piece,$plateau,$cote);
      } else if ($piece[0] == 'F') { // il s'agit d'un fou
        $retour_piece = fou($piece,$plateau,$cote);
      } else if ($piece[0] == 'T') { // il s'agit d'une tour
        $retour_piece = tour($piece,$plateau,$cote);
      } else if ($piece[0] == 'D') { // il s'agit de la dame
        $retour_piece = dame($piece,$plateau,$cote);
      } else if ($piece[0] == 'C') { // il s'agit d'un cavalier
        $retour_piece = cavalier($piece,$plateau,$cote);
      } else { // il s'agit d'un roi
        $retour_piece = roi($piece,$plateau,$cote);
      }
    }
  }
  return $retour_piece;
}


function pion($piece,$plateau,$cote) {
  $coups_par_pion = array();
  $vues_par_pion = array();
  $i_p = $plateau[$piece]["i"]; // on récupère la coord i du pion
  $j_p = $plateau[$piece]["j"]; // et sa coordonnée j
  $incr = 1; // il s'agit du nombre de cases que peut parcourir le pion
  // on va tester la couleur du pion
  // et on vérifie si le pion peut avancer de deux cases ou d'une seulement
  if ($cote == 1) { // s'il s'agit d'un pion blanc
    $sens = +1; // on va 'avancer' dans le sens i positif
    if ($i_p == 2) {$incr = 2;} // le pion peut parcourir deux cases
  } else { // si on est du côté des noirs
    $sens = -1; // on va 'avancer' dans le sens i négatif
    if ($i_p == 7) {$incr = 2;} // le pion peut parcourir deux cases
  }
  // on va parcourir les cases devant le pion
  foreach (array($i_p+1*$sens,$i_p+$incr*$sens) as $i_expl) { // on teste les cases devant le pion
    $occupee = occupee($plateau,$i_expl,$j_p);
    if ($occupee == false) { // s'il n'y a rien sur le chemin
      if (($i_expl==8 && $cote==1) || ($i_expl==1 && $cote==2)) { // si on a une promotion
        $coups_par_pion[] = [$i_p,$j_p,$i_expl,$j_p,"promoF"];
        $coups_par_pion[] = [$i_p,$j_p,$i_expl,$j_p,"promoT"];
        $coups_par_pion[] = [$i_p,$j_p,$i_expl,$j_p,"promoC"];
        $coups_par_pion[] = [$i_p,$j_p,$i_expl,$j_p,"promoD"];
      } else { // si on n'a pas encore atteint la dernière ligne
        $coups_par_pion[] = [$i_p,$j_p,$i_expl,$j_p];
      }
    } else { // si on rencontre un obstacle
      if ($occupee[1]!=$cote) { // si l'obstacle n'est pas de la couleur du joueur
        $vues_par_pion[] = [$i_p,$j_p,$i_expl,$j_p,$occupee[0]]; // on enregistre cet obstacle dans la valeur "vues"
      }
      break; // puis on coupe la trajectoire
    }
  }
  // enfin on teste les cases en diagonale
  foreach (array($j_p-1,$j_p+1) as $j_expl) {
    $occupee = occupee($plateau,$i_p+1*$sens,$j_expl);
    if ($occupee != false) { // s'il y a bien une pièce sur cette case
      if ($occupee[1]!=$cote) { // si elle n'est pas de la couleur du joueur
        if (($i_expl==8 && $cote==1) || ($i_expl==1 && $cote==2)) { // si on a une promotion
          $coups_par_pion[] = [$i_p,$j_p,$i_p+1*$sens,$j_expl,$occupee[0],"promoC"];
          $coups_par_pion[] = [$i_p,$j_p,$i_p+1*$sens,$j_expl,$occupee[0],"promoD"];
          $coups_par_pion[] = [$i_p,$j_p,$i_p+1*$sens,$j_expl,$occupee[0],"promoF"];
          $coups_par_pion[] = [$i_p,$j_p,$i_p+1*$sens,$j_expl,$occupee[0],"promoT"];
        } else { // si on n'a pas atteint la dernière ligne
          $coups_par_pion[] = [$i_p,$j_p,$i_p+1*$sens,$j_expl,$occupee[0]];
        }
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
  return array("coups"=>$coups_par_cavalier,"vues"=>array()); // on renvoie alors le résultat
}


function roi($piece,$plateau,$cote) {
  $coups_par_roi = array();
  $i_r = $plateau[$piece]["i"];
  $j_r = $plateau[$piece]["j"];
  // on va parcourir les cases atteintes par le roi
  foreach(array(array($i_r-1,$j_r-1),array($i_r,$j_r-1),array($i_r+1,$j_r-1),
                array($i_r-1,$j_r+1),array($i_r,$j_r+1),array($i_r+1,$j_r+1),
                array($i_r-1,$j_r),array($i_r+1,$j_r)) as $coord_expl) {
    $i_expl = $coord_expl[0];
    $j_expl = $coord_expl[1];
    if (!(($i_expl<=0)||($i_expl>=9)||($j_expl<=0)||($j_expl>=9))) { // si la case explorée est bien sur l'échiquier
      $occupee = occupee($plateau,$i_expl,$j_expl); // on recherche si elle est occupée
      if ($occupee == false) { // s'il n'y a rien sur cette case
        $coups_par_roi[] = [$i_r,$j_r,$i_expl,$j_expl];
      } else { // si on rencontre un obstacle
        if ($occupee[1]!=$cote) { // si l'obstacle n'est pas de la couleur du joueur
          $coups_par_roi[] = [$i_r,$j_r,$i_expl,$j_expl,$occupee[0]]; // la pièce peut prendre celle sur la case explorée
        }
      }
    }
  }
  // la suite prend en compte le roque
  if (($j_r==5) and (($i_r==1 and $cote=1)or($i_r==8 and $cote=2))) { // si le roi est bien à sa place d'origine
    // on commence par le grand roque
    if ($plateau["T" . $cote . "1"]["j"] == 1) { // si la tour 1 est bien en place (grand roque)
      foreach(array(2,3,4) as $j_expl) { // on parcourt les cases entre la tour 1 et le roi
        $grand_roque = true;
        if (occupee($plateau,$i_r,$j_expl)!=false) { // si l'une d'elle est prise
          $grand_roque = false; // on annule le grand roque
          break;
        }
      }
    }
    // puis le petit roque
    if ($plateau["T" . $cote . "2"]["j"] == 8) { // si la tour 2 est bien en place (petit roque)
      foreach(array(6,7) as $j_expl) { // on parcourt les cases entre la tour 2 et le roi
        $petit_roque = true;
        if (occupee($plateau,$i_r,$j_expl)!=false) { // si l'une d'elle est prise
          $petit_roque = false; // on annule le petit roque
          break;
        }
      }
    }
    // enfin, on donne les coups possibles
    if ($grand_roque) { // si le grand roque est bien possible
      $coups_par_roi[] = [$i_r,$j_r,$i_r,3,"gr"];
    }
    if ($petit_roque) { // si le petit roque est bien possible
      $coups_par_roi[] = [$i_r,$j_r,$i_r,7,"pr"];
    }
  }
  return array("coups"=>$coups_par_roi,"vues"=>array()); // on renvoie alors le résultat
}


function fou($piece,$plateau,$cote) {
  $coups_par_fou = array();
  // on va parcourir les cases en diagonale
  foreach (array(array(-1,-1),array(+1,-1),array(-1,+1),array(+1,+1)) as $direction) {
    // on a 4 directions disponibles à tester
    $coups_par_fou = array_merge($coups_par_fou,explore_direction($direction,$plateau,$cote,$piece));
  }
  return array("coups"=>$coups_par_fou,"vues"=>array()); // on renvoie alors le résultat
}


function tour($piece,$plateau,$cote) {
  $coups_par_tour = array();
  // on va parcourir les cases atteintes par la tour
  foreach (array(array(-1,0),array(+1,0),array(0,-1),array(0,+1)) as $direction) {
    // on a 4 directions disponibles
    $coups_par_tour = array_merge($coups_par_tour,explore_direction($direction,$plateau,$cote,$piece));
  }
  return array("coups"=>$coups_par_tour,"vues"=>array()); // on renvoie alors le résultat
}


function dame($piece,$plateau,$cote) {
  $coups_par_dame = array();
  // on va parcourir les cases atteintes par la tour
  foreach (array(array(-1,0),array(+1,0),array(0,-1),array(0,+1),array(-1,-1),array(+1,-1),array(-1,+1),array(+1,+1)) as $direction) {
    // on a 8 directions disponibles
    $coups_par_dame = array_merge($coups_par_dame,explore_direction($direction,$plateau,$cote,$piece));
  }
  return array("coups"=>$coups_par_dame,"vues"=>array()); // on renvoie alors le résultat
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
