<?php
	

	$val = isset($_GET["val"])?  $_GET["val"] : "";

	$json = Array('status'=>1,'data'=>Array());

	$json["data"] = Array( 
		$val.'一',
		$val.'二',
		$val.'三',
		$val.'四',
		$val.'五',
		$val.'六',
		$val.'七',
		$val.'八',
		$val.'九',
		$val.'你妹'
	);
	
	echo json_encode($json);
?>


