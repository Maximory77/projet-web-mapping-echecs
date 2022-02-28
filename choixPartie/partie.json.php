<?php
//Connection à la BDD
$link = mysqli_connect('mysql-kevineuh.alwaysdata.net', 'kevineuh', 'root', 'kevineuh_chess_wihou');

//Vérification
if (!$link) {
  die('Erreur de connexion');
} else {
  // echo 'Succès... ';
}

//Prévention de potentiels problèmes d'encodages
mysqli_set_charset($link, "utf8");


$requete = "SELECT * FROM parties";
$tab=[];
if($result=mysqli_query($link,$requete)){
  while($ligne=mysqli_fetch_assoc($result)){
    //tableau associatif
    $tab[]=$ligne;
  }
}
echo json_encode($tab);


?>
