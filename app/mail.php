<?php

$recepient = "acubick@gmail.com";
$sitename = "Cherry";

$name = trim($_POST["name"]);
$phone = trim($_POST["daytime"]);
$email = trim($_POST["email"]);
$city = trim($_POST["city"]);
$problem = trim($_POST["problem"]);
$brand = trim($_POST["brand"]);
$message = "Имя: $name \nТелефон: $phone \nemail: $email \nГород: $city \nУстройство : $problem  \nБренд: $brand";

$pagetitle = "Новая заявка с сайта \"$sitename\"";
mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");
