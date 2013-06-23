<?php
include_once("lib/functions.php");
?>
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
		<link type="text/css" href="farbtastic/farbtastic.css" rel="Stylesheet" />
		<link type="text/css" href="style/screen.css" rel="Stylesheet" />

		<script type="text/javascript" src="scripts/json2.js"></script>
		<script type="text/javascript" src="scripts/jquery-1.3.1.js"></script>
		<script type="text/javascript" src="scripts/jquery-ui-personalized-1.6rc6.min.js"></script>
		<script type="text/javascript" src="farbtastic/farbtastic.js"></script>
		<script type="text/javascript" src="scripts/jquery.ffbatch.js"></script>
	</head>
	<body>
		<div id="page">
			<div id="head">
				<h1>ffBatch</h1>
			</div>
			<div id="body">
				<p><a href="http://www.filterforge.com/">Filter Forge</a>s command-line batch rendering is great but a bit too difficult for people to use. It only renders the presets of an ffxml plus you need to make an extra xml file discribing what to render exactly.</p>
				<p>FFBatch is an <a href="https://github.com/Sjeiti/ffBatch">open-source</a> online application that creates these files for you. You upload an ffxml file, set start and end values for the controls (and some additional values).<br/>When you hit the submit button you download a zip file containing three files:</p>
				<ul>
					<li>a new ffxml file with a preset for every frame</li>
					<li>an xml file describing what to render</li>
					<li>and an extra bat file you have to run (so you don't have to use the command line)</li>
				</ul>
<?php
$bChooseUp = !isset($_FILES["file"]);
if (!$bChooseUp&&(!empty($_FILES["file"]["error"])||(empty($_FILES["file"]["tmp_name"])||$_FILES["file"]["tmp_name"]=="none"))) $bChooseUp = true;
if ($bChooseUp) {
//if (!isset($_FILES["file"])) {
?>
				<p>First, upload your ffxml file. All initial values will be derived from the default preset.</p>
				<form id="fileSelect" action="" method="post" enctype="multipart/form-data">
					<fieldset><legend>choose file</legend><input type="file" name="file" /></fieldset>
				</form>
<?php
} else {
//	// do upload
//	$sErr = "";
//	$sElName = "file";
//	if (!empty($_FILES[$sElName]["error"])) {
//		switch($_FILES[$sElName]["error"]) {
//			case "1": $sErr = "LANG_UPLOAD_ERR1"; break;
//			case "2": $sErr = "LANG_UPLOAD_ERR2"; break;
//			case "3": $sErr = "LANG_UPLOAD_ERR3"; break;
//			case "4": $sErr = "LANG_UPLOAD_ERR4"; break;
//			case "6": $sErr = "LANG_UPLOAD_ERR6"; break;
//			case "7": $sErr = "LANG_UPLOAD_ERR7"; break;
//			case "8": $sErr = "LANG_UPLOAD_ERR8"; break;
//			default:  $sErr = "LANG_UPLOAD_ERR";
//		}
//	} else if (empty($_FILES["file"]["tmp_name"])||$_FILES["file"]["tmp_name"]=="none") {
//		$sErr = "No file was uploaded..";
//	} else {
		?>
		<form id="fileSelect" action="" method="post" enctype="multipart/form-data"><input type="file" name="file" /></form>
		<form id="getzip" action="getzip.php" target="_blank" method="post" class="ffxml">
			<input type="hidden" name="stype" value="anim" />
		<?php
		echo "<input type=\"hidden\" value=\"".$_FILES["file"]["name"]."\" name=\"filename\" />";
		//
		// load and delete upload
		$xFFXML = @simplexml_load_file($_FILES["file"]["tmp_name"]) or die ("no file loaded");
		@unlink($_FILES["file"]["tmp_name"]);
		//
		$sXml = htmlspecialchars(preg_replace("/[\n\t]/","",$xFFXML->asXML()));
		echo "<input type=\"hidden\" value=\"".$sXml."\" name=\"file\" />";
		//
		$xInfo = $xFFXML->xpath("//Information");
		$aInfoAttr = $xInfo[0]->attributes();
		$sTitle = $aInfoAttr["name-en"];
		echo "<h2>filter: ".$sTitle."</h2>";
		//
		////////////////////////////////////////////////////////////////////////////////////
		// SETTINGS
		//
		$axSett = $xFFXML->xpath("//DefaultPreset/Settings");
		$atSett = $xFFXML->Presets->DefaultPreset->Settings->attributes();
?>
					<fieldset id="tb_settings">
						<legend>settings</legend>
						<table cellpadding="0" cellspacing="0">
							<thead><tr><th></th><th></th><th>start</th><th>end</th></tr></thead>
							<!--input type="hidden" value="SliderControl" class="type" /><input type="hidden" value="slidercontrol 78" class="id" /><input type="hidden" value="0" class="value" /-->
							<tbody>
								<!--tr><th colspan="2">settings</th><th>start</th><th>end</th></tr-->
								<tr><td colspan="2"><strong>size_factor</strong><input type="hidden" value="sizefactor" class="id" /><input type="hidden" value="<?php echo $atSett->size_factor ?>" class="value" /></td><td class="SliderControl start"></td><td class="SliderControl end"></td></tr>
								<tr><td colspan="2"><strong>variation</strong></td><td colspan="2"><input name="variation" type="text" value="<?php echo $atSett->variation ?>" /></td></tr>
								<tr><td colspan="2"><strong>seamless</strong></td><td colspan="2"><input name="seamless" type="checkbox" <?php echo $atSett->seamless=="true"?"checked=\"checked\"":"" ?> /></td></tr>
								<tr><td colspan="2"><strong>map_type</strong></td><td colspan="2">
									<select name="map_type"><?php
										$aMp = array("off","diffuse map","bump map","normal map","specular strength map","specular exponent map","metallic map","alpha map");
										foreach ($aMp as $i=>$s) echo "<option value=\"".$i."\"".($atSett->map_type==$i?" selected=\"selected\"":"").">".$s."</option>";
									?></select>
								</td></tr>
								<tr><td colspan="2"><strong>antialiasing</strong></td><td colspan="2">
									<select name="antialiasing"><?php
										$aAa = array("off","5 samples","9 samples","17 samples","25 samples","37 samples","49 samples","65 samples");
										foreach ($aAa as $i=>$s) echo "<option value=\"".($i+1)."\"".($atSett->antialiasing==($i+1)?" selected=\"selected\"":"").">".$s."</option>";
									?></select>
								</td></tr>
								<tr><td colspan="2"><strong>edges_only</strong></td><td colspan="2"><input name="edges_only" type="checkbox" <?php echo $atSett->edges_only=="true"?"checked=\"checked\"":"" ?>/></td></tr>
							</tbody>
						</table>
					</fieldset>
<?php
		////////////////////////////////////////////////////////////////////////////////////
		// SURFACE
		//
if (count($xFFXML->xpath("//Result/SurfaceColor"))>0) {
		$atHgt = $xFFXML->Presets->DefaultPreset->Lighting->Height->attributes();
		$atSrc = $xFFXML->Presets->DefaultPreset->Lighting->Environment->Source->attributes();
		$atBrg = $xFFXML->Presets->DefaultPreset->Lighting->Environment->Brightness->attributes();
		$atSat = $xFFXML->Presets->DefaultPreset->Lighting->Environment->Saturation->attributes();
		$atRot = $xFFXML->Presets->DefaultPreset->Lighting->Environment->Rotation->attributes();
?>
					<fieldset id="tb_surface">
						<legend>surface</legend>
						<table cellpadding="0" cellspacing="0">
							<thead><tr><th></th><th></th><th>start</th><th>end</th></tr></thead>
							<tbody>
								<tr><td colspan="2"><strong>environment</strong></td><td colspan="2">
									<select name="surface"><?php
										$aEv = array("Bridge","Church","Entrance, Day","Entrance, Night","Forest","Lobby","Spring");
										foreach ($aEv as $i=>$s) echo "<option value=\"".$s."\"".($atSrc->value==$s?" selected=\"selected\"":"").">".$s."</option>";
									?></select>
								</td></tr>
								<tr><td colspan="2"><strong>height</strong><input type="hidden" value="height" class="id" /><input type="hidden" value="<?php echo $atHgt->value ?>" class="value" /></td><td class="SliderControl start"></td><td class="SliderControl end"></td></tr>
								<tr><td colspan="2"><strong>brightness</strong><input type="hidden" value="brightness" class="id" /><input type="hidden" value="<?php echo floatVal($atBrg->value)/5 ?>" class="value" /></td><td class="SliderControl start"></td><td class="SliderControl end"></td></tr>
								<tr><td colspan="2"><strong>saturation</strong><input type="hidden" value="saturation" class="id" /><input type="hidden" value="<?php echo $atSat->value ?>" class="value" /></td><td class="SliderControl start"></td><td class="SliderControl end"></td></tr>
								<tr><td colspan="2"><strong>rotation</strong><input type="hidden" value="rotation" class="id" /><input type="hidden" value="<?php echo $atRot->value ?>" class="value" /></td><td class="SliderControl start"></td><td class="SliderControl end"></td></tr>
							</tbody>
						</table>
					</fieldset>
<?php
}
		////////////////////////////////////////////////////////////////////////////////////
		// CONTROLS ?>
					<fieldset id="tb_controls">
						<legend>controls</legend>
						<table cellpadding="0" cellspacing="0">
							<thead><tr><th>name</th><th>type</th><th>start</th><th>end</th></tr></thead>
							<tbody>
<?php
		foreach ($xFFXML->xpath("//DefaultPreset/Controls/*") as $xControl) {
			$aAttr = $xControl->attributes();
			$sType = $xControl->getName();
			$sId = $aAttr["id"];
			// find name
			$aName = $xFFXML->xpath("//".$sType."[@id='".$sId."']/Name");
			$aNameAttr = $aName[0]->attributes();
			$sName = $aNameAttr["value-en"];
			//
			$sData  = "<input type=\"hidden\" value=\"".$sType."\" class=\"type\" />";
			$sData .= "<input type=\"hidden\" value=\"".$aAttr["id"]."\" class=\"id\" />";
			switch ($sType) {
				case "IntSliderControl":
					$aRangemax = $xFFXML->xpath("//".$sType."[@id='".$sId."']/RangeMax");
					$aRangemaxAttr = $aRangemax[0]->attributes();
					$sData .= "<input type=\"hidden\" value=\"".$aRangemaxAttr["value"]."\" class=\"rangemax\" />";
				case "SliderControl":
					$aDefval = $xFFXML->xpath("//DefaultPreset/Controls/".$sType."[@id='".$sId."']/Value");
					$aDefvalAttr = $aDefval[0]->attributes();
					$sData .= "<input type=\"hidden\" value=\"".$aDefvalAttr["value"]."\" class=\"value\" />";
				break;
				case "AngleControl":
					$aDefval = $xFFXML->xpath("//DefaultPreset/Controls/".$sType."[@id='".$sId."']/Value");
					$aDefvalAttr = $aDefval[0]->attributes();
					$sData .= "<input type=\"hidden\" value=\"".$aDefvalAttr["value"]."\" class=\"value\" />";
				break;
				case "ColorControl":
					$aDefval = $xFFXML->xpath("//DefaultPreset/Controls/".$sType."[@id='".$sId."']/Color");
					$aDefvalAttr = $aDefval[0]->attributes();
					$r = 255*floatVal($aDefvalAttr["red"]);
					$g = 255*floatVal($aDefvalAttr["green"]);
					$b = 255*floatVal($aDefvalAttr["blue"]);
					$sData .= "<input type=\"hidden\" value=\"".rgbhex($r,$g,$b)."\" class=\"value\" />";
				break;
				case "CheckboxControl":
					$aDefval = $xFFXML->xpath("//DefaultPreset/Controls/".$sType."[@id='".$sId."']/Checked");
					$aDefvalAttr = $aDefval[0]->attributes();
					//$sChecked = $aDefvalAttr["value"]=="true"?" checked=\"checked\"":"";
					//$sData .= "<input type=\"hidden\"".$sChecked." class=\"checkbox\" />";
					$sData .= "<input type=\"hidden\" value=\"".$aDefvalAttr["value"]."\" class=\"value\" />";
				break;

			}
			echo "<tr id=\"".$aAttr["id"]."\">\n";
			echo "\t<td><strong>".$sName."</strong></td>\n";
			echo "\t<td><small>".$sType.$sData."<small></td>\n";
			echo "\t<td class=\"".$sType." start\"></td>\n";
			echo "\t<td class=\"".$sType." end\"></td>\n";
			echo "</tr>\n";
		}
?>
							</tbody>
						</table>
					</fieldset>
<?php	////////////////////////////////////////////////////////////////////////////////////
		// LOCAL
		//
		// batch.xml GlobalSettings
		$xBatch = @simplexml_load_file("batch.xml");
		//
		$axBmpDef = $xBatch->xpath("//GlobalSettings/BitmapFormatOptions/DefaultFormat");
		$xBmpDefAttr = $axBmpDef[0]->attributes();
		$sDefVal = $xBmpDefAttr["value"];
?>
					<fieldset id="local">
						<legend>local</legend>
						<label title="for rendering with FF2 change 'Filter Forge' to 'Filter Forge 2'">renderer:</label><input type="text" name="renderer" class="wide" />
						<label title="the folder on your machine you will copy the files to">destination:</label><input type="text" name="destination" class="wide" />

						<label title="The base name of the outputted files">filename:</label><input type="text" name="name" value="<?php echo $sTitle; ?>_" />
						<label title="Minimum amount of suffixed digits: 00023">digits:</label><input type="text" name="digits" value="1" class="short" />
						<label title="Increment of the digit">increment:</label><input type="text" name="increment" value="1" class="short" />
						<label title="Starting number">digitstart:</label><input type="text" name="digitstart" value="0" class="short" />

						<label title="must be a file residing in the destination folder (do not prepend path)">source image:</label><input type="text" value="" name="srcimg" />
					</fieldset>
<?php	////////////////////////////////////////////////////////////////////////////////////
		// RENDERING ?>
					<fieldset id="rendering">
						<legend>rendering</legend>
<?php
		$aTxt = array("Jitter","TemporaryFilesLocation","RAMUsageLimit");
		foreach ($xBatch->xpath("//GlobalSettings/RenderingOptions/*") as $xSet) {
			$xRAttr = $xSet->attributes();
			$sRname = $xSet->getName();
			$sRValue = $xRAttr["value"];
			$bRType = in_array($sRname,$aTxt);
			$sRType = $bRType?"text":"checkbox";
			$sRVal = $bRType?("value=\"".$sRValue."\""):($sRValue=="true"?"checked=\"checked\"":"");
			echo "<label>".$sRname.":</label>";
			echo "<input type=\"".$sRType."\" ".$sRVal." name=\"".$sRname."\" />";
		}
?>
					</fieldset>
<?php	////////////////////////////////////////////////////////////////////////////////////
		// IMAGE ?>
					<fieldset id="image">
						<legend>image</legend>
						<label>format:</label><select name="form"><?php
							foreach ($xBatch->xpath("//GlobalSettings/BitmapFormatOptions/*") as $xBmp) {
								$sBmpName = $xBmp->getName();
								if ($sBmpName!="DefaultFormat") echo "<option value=\"".$sBmpName."\" ".($sDefVal==$sBmpName?" selected=\"selected\"":"").">".$sBmpName."</option>";
							}
						?></select>
						<label>width:</label><input type="text" value="256" name="width" />
						<label>height:</label><input type="text" value="256" name="height" /><br class="clear"/>
					</fieldset>
<?php	////////////////////////////////////////////////////////////////////////////////////
		// ANIMATION ?>
					<fieldset id="animation">
						<legend>animation</legend>
						<label>number of frames:</label><input type="text" value="100" name="frames" />
						<p><input type="button" name="anim" class="submit" value="return animation files" /></p>
					</fieldset>
<?php	////////////////////////////////////////////////////////////////////////////////////
		// PRESET RENDER MAPS ?>
					<fieldset id="rendermaps">
						<legend>preset render maps</legend>
						<?php
						$aMaps = array("result","diffuse","bump","normal","alpha","metallic","specular");
						foreach ($aMaps as $sMap) {
							echo "<label>".$sMap.":</label><input type=\"checkbox\" checked=\"checked\" name=\"map_".$sMap."\" /><input type=\"text\" value=\"".$sMap."\" name=\"mapName_".$sMap."\" />";
						}
						?>
						<p><input type="button" name="maps" class="submit" value="return render map files" /></p>
					</fieldset>
<?php	////////////////////////////////////////////////////////////////////////////////////
		// RENDER ?>
				</form>
<?php
	}
//	echo $sErr;
//}
?>
			</div>
		</div>
		<div id="picker"></div>
	</body>
</html>