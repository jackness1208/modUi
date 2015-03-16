<?php
	

	$type = isset($_GET["type"])?  $_GET["type"] : "";
	$val = isset($_GET["val"])?  $_GET["val"] : "";

	$json = Array('status'=>1,'data'=>Array());

	switch($type){
		case "0":
			$json["data"] = array(
				Array(
					'text' => '男生',
					'value' => '男生'
				),
				Array(
					'text' => '女生',
					'value' => '女生'
				)
			);

			
			break;

		case "1":
			switch($val){
				case "男生":
					$json["data"] = array(
						Array(
							'text' => '男神',
							'value' => '男神'
						),
						Array(
							'text' => '屌丝',
							'value' => '屌丝'
						)
					);
					break;

				case "女生":
					$json["data"] = array(
						Array(
							'text' => '女神',
							'value' => '女神'
						),
						Array(
							'text' => '熟女',
							'value' => '熟女'
						),
						Array(
							'text' => '萝莉',
							'value' => '萝莉'
						),
						Array(
							'text' => '汉子',
							'value' => '汉子'
						)
					);
					break;

				default:
					break;

			}
			

		case "2":
			switch($val){
				case "男神":
					$json["data"] = array(
						Array(
							'text' => '高富帅',
							'value' => '高富帅'
						),
						Array(
							'text' => '矮富帅',
							'value' => '矮富帅'
						),
						Array(
							'text' => '高富丑',
							'value' => '高富丑'
						),
						Array(
							'text' => '矮富丑',
							'value' => '矮富丑'
						)
					);
					break;

				case "屌丝":
					$json["data"] = array(
						Array(
							'text' => '矮挫穷',
							'value' => '矮挫穷'
						),
						Array(
							'text' => '高挫穷',
							'value' => '高挫穷'
						),
						Array(
							'text' => '矮帅穷',
							'value' => '矮帅穷'
						),
						Array(
							'text' => '高帅穷',
							'value' => '高帅穷'
						)
					);
					break;

				case "女神":
					$json["data"] = array(
						Array(
							'text' => '白富美',
							'value' => '白富美'
						),
						Array(
							'text' => '白穷美',
							'value' => '白穷美'
						)
					);
					break;

				case "熟女":
					$json["data"] = array(
						Array(
							'text' => '黑富美',
							'value' => '黑富美'
						),
						Array(
							'text' => '黑穷美',
							'value' => '黑穷美'
						),
						Array(
							'text' => '白富美',
							'value' => '白富美'
						),
						Array(
							'text' => '白穷美',
							'value' => '白穷美'
						)
					);
					break;

				case "萝莉":
					$json["data"] = array(
						Array(
							'text' => '幼女',
							'value' => '幼女'
						),
						Array(
							'text' => '伪娘',
							'value' => '伪娘'
						)
					);
					$json["data"] = Array('幼女','伪娘');
					break;

				case "汉子":
					$json["data"] = array(
						Array(
							'text' => '伪爷',
							'value' => '伪爷'
						),
						Array(
							'text' => '纯爷',
							'value' => '纯爷'
						)
					);
					break;


				default:
					break;

			}
			break;
		default:
			break;
	}
	
	echo json_encode($json);
?>


