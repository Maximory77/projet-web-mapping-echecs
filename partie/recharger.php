<?php
/*
Lorsque ce fichier est appelé : la partie est rechargée
utile pour les tests et donne base de code simple afin d'initialiser la ligne d'une partie

- on envoie un nom de joueur tout seul : créée nouvelle partie avec le joueur en coté 2
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
  $partie = $_GET['partie'];
  echo $partie;
  $requete = "UPDATE parties AS p1, (	 SELECT id,tour,trait,histo1,histo2,plateau,fin,nul
              			                   FROM parties
              			                   WHERE id = 0 ) AS p2
              SET  p1.trait = p2.trait,
              	   p1.tour = p2.tour,
              	   p1.histo1 = p2.histo1,
              	   p1.histo2 = p2.histo2,
              	   p1.plateau = p2.plateau,
                   p1.fin = p2.fin,
                   p1.nul = p2.nul
              WHERE p1.id = $partie";
  echo $requete;
  if ($result = mysqli_query($link,$requete)) {
    echo "rechargé";
  } else {
    echo "erreur de BDD";
  }
}

?>
