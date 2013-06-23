<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>ffBatch</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
		<meta name="generator" content="editplus" />
		<meta name="author" content="" />
		<meta name="keywords" content="" />
		<meta name="description" content="" />

		<link type="text/css" href="theme/ui.all.css" rel="Stylesheet" />	

		<style>
			table {
				width: 100%;
			}
			.start, .end {
				padding: 5px 15px 5px 15px;
			}
			.start div, .end div {
				width: 150px;
				height: 3px;
			}
		</style>

		<script type="text/javascript" src="jquery-1.3.1.js"></script>
		<script type="text/javascript" src="jquery-ui-personalized-1.6rc6.min.js"></script>
		<script type="text/javascript">
			$(function(){
				// Slider
				$(".start,.end").each(function(i,el){
					var mDiv = $("<div></div>").appendTo(this);
					var sFor = mDiv.parent().parent().attr("id");
					mDiv.attr("id",sFor+"_"+mDiv.attr("class"));
					mDiv.slider({ animate: true });
	//				range: true,
	//				values: [17, 67]
				});
			});
		</script>
	</head>
	<body id="page_1">
		<div id="page">
			<div id="head">
				<h1>ffBatch</h1>
			</div>
			<div id="body">
<?php
include_once("functions.php");

//$xCur = @simplexml_load_file("Perlin clouds.ffxml") or die ("no file loaded");
$xFFXML = @simplexml_load_file("Ammonite.ffxml") or die ("no file loaded");

$xInfo = $xFFXML->xpath("//Information");
$aInfoAttr = $xInfo[0]->attributes();
$sTitle = $aInfoAttr["name-en"];
echo "<h2>".$sTitle."</h2>";

echo "<table>";
echo "<thead><tr><th>control</th><th>type</th><th>start</th><th>end</th></tr></thead>";
echo "<tbody>";
foreach ($xFFXML->xpath("//DefaultPreset/Controls/*") as $xControl) {
	$aAttr = $xControl->attributes();
	$sType = $xControl->getName();
	$sId = $aAttr["id"];
	$aName = $xFFXML->xpath("//".$sType."[@id='".$sId."']/Name");
	$aNameAttr = $aName[0]->attributes();
	$sName = $aNameAttr["value-en"];
	echo "<tr id=\"".$aAttr["id"]."\" class=\"".$sType."\"><td><strong>".$sName."</strong></td><td>".$sType."</td><td class=\"start\"></td><td class=\"end\"></td></tr>";
}
echo "</tbody>";
echo "</table>";
//	echo "<li id=\"".$aAttr["id"]."\"><strong>".$sName."</strong>: ".$xControl->getName()."</li>";
//	$aName = $xControl->xpath("//Name");
//	$aNameAttr = $aName[0]->attributes();
//	echo "<li>".count($aName)."</li>";
//	echo "<li>".gettype($aName[0])."</li>";
//	foreach ($aName as $x) echo "<li>".$x."</li>";
//	echo $xControl->getName().": ".$aNameAttr["value-en"]." ".preg_replace("/[\<\>]/","|",$xControl->asXML())."<br/>";
//$xCur = @simplexml_load_file("Perlin clouds.ffxml") or die ("no file loaded");
//foreach ($xCms->xpath("//ul[@id='video']") as $xData) echo preg_replace("/[\n\t]/","",$xData->asXML());
//foreach ($xCur->xpath("//DefaultPreset/Controls/*") as $xData) {
//	echo $xData->getName()."<br/>";
//	foreach ($xData->children() as $xNode) echo "x ".$xNode->id."<br/>";
//	echo "x ".$xData->id."<br/>";//echo preg_replace("/[\n\t]/","",$xData->asXML());
//}
?>
			</div>
		</div>
	</body>
</html>