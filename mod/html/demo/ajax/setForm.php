<?php
	$status = isset($_GET["status"])?  $_GET["status"] : 0;
	$json = Array('status'=>$status,'error'=>'人品有问题');
	echo json_encode($json);
?>


