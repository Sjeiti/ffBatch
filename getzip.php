<?php
include_once("lib/functions.php");
include_once("lib/CreateZipFile.php");
$sTmp = "";
//
truce('getting zip');
//echo "<![CDATA[";
//dump($_POST);
//echo "]]></strike>";
//
$iFrames = intVal($_POST["frames"]);
$sDst = $_POST["destination"]."\\";//str_replace(array("\\\"","\\\\"),array("\"","\\"),$_POST["destination"]."\\");//stripslashes
$sRnd = $_POST["renderer"];//str_replace(array("\\\"","\\\\"),array("\"","\\"),$_POST["renderer"]);//stripslashes
$sFileName = preg_replace("/\s/","_",$_POST["filename"]);
$aRName = split("\.",$sFileName);
$sRName = $_POST["name"];//$aRName[0];
$sFile = str_replace("\\\"","\"",htmlspecialchars_decode($_POST["file"]));
//echo "<textarea>".$sFile."</textarea>";
$sFfxmlFile = "ffbatch_".$sFileName;
$aFile = split("\.",$sFfxmlFile);
$sFfxmlFile = $sTmp.$sFfxmlFile;
$sName = $aFile[0];
//dump($sName);
//
// get control post data
$aData = array();
foreach ($_POST as $k=>$v) {
	$aK = split("_",$k);
	if (count($aK)>2) {
		$sId = $aK[0]." ".$aK[1];
		if (!isset($aData[$sId])) $aData[$sId] = array();
		$aData[$sId][$aK[2]] = $v;
	}
}
//dump($aData);
//
//
if ($_POST["stype"]=="anim") { //////////////////////////////////////////////////////// animation
	//////////////////////////// create new ffxml file
	//dump($sFile);
	truce("file::\n".$sFile);
	$xDoc = new DOMDocument();
	$xDoc->loadXML($sFile);
	//
	//
	$aPreset = $xDoc->getElementsByTagName("Preset");
	for ( $i=$aPreset->length; --$i>=0; ) {
		$xPr = $aPreset->item($i);
		$xPr->parentNode->removeChild($xPr);
	}
	$aPSetting = array("variation","seamless","antialiasing","map_type","edges_only");
	$aPCheckbx = array("seamless","edges_only");
	$axDef = $xDoc->getElementsByTagName("DefaultPreset")->item(0)->childNodes;
	$xPrn = $xDoc->getElementsByTagName("Presets")->item(0);
	for ($i=0;$i<$iFrames;$i++) {
		$fPrt = $i/$iFrames;
		// copy defaultpreset
		$xNew = $xPrn->appendChild(new DOMElement("Preset"));
		for($j=0;$j<$axDef->length;$j++) $xNew->appendChild($axDef->item($j)->cloneNode(true));
		// settings
		$xSett = $xNew->getElementsByTagName("Settings")->item(0);
		foreach ($aPSetting as $v) {
			$sVal = in_array($v,$aPCheckbx)?((isset($_POST[$v])&&$_POST[$v]=="on")?"true":"false"):$_POST[$v];
			$xSett->setAttribute($v,$sVal);
		}
		$fSzSt = $_POST["sizefactor_start"];
		$fSzEd = $_POST["sizefactor_end"];
		$fSize = $fSzSt + $fPrt*($fSzEd-$fSzSt);
		$xSett->setAttribute("size_factor",$fSize);
		// lightning
		if (isset($_POST["surface"])) $xNew->getElementsByTagName("Source")->item(0)->setAttribute("value",$_POST["surface"]);
		$aLightPrp = array("Height"=>1,"Brightness"=>5,"Saturation"=>1,"Rotation"=>360);
		foreach ($aLightPrp as $p=>$v) {
			if (isset($_POST[strtolower($p)."_start"])) {
				$fPSt = $_POST[strtolower($p)."_start"];
				$fPEd = $_POST[strtolower($p)."_end"];
				$fPVl = $fPSt + $fPrt*($fPEd-$fPSt);
				$xNew->getElementsByTagName($p)->item(0)->setAttribute("value",$fPVl*$v);
			}
		}
		$xLght = $xNew->getElementsByTagName("Settings")->item(0);
		// controls
		$axCtrl = $xNew->getElementsByTagName("Controls")->item(0)->childNodes; 
		for($j=0;$j<$axCtrl->length;$j++) { 
			$xCtrl = $axCtrl->item($j);
			$sId = $xCtrl->getAttribute("id");
			if (isset($aData[$sId])) {
				$oData = $aData[$sId];
				if (isset($oData["ease"])) { // else $fPrt = linear
					switch ($oData["ease"]) {
						case 1: $fPrt = .5-.5*cos($fPrt*pi()); break; // smooth
						case 2: $fPrt = .5-.5*cos($fPrt*2*pi()); break; // circular
					}
				}
				$fSt = $aData[$sId]["start"];
				$fEd = $aData[$sId]["end"];
				if($xCtrl->nodeName=="ColorControl") {
					$aSt = hexrgb($fSt);
					$aEd = hexrgb($fEd);
					$fR = ($aSt[0]+$fPrt*($aEd[0]-$aSt[0]))/255;
					$fG = ($aSt[1]+$fPrt*($aEd[1]-$aSt[1]))/255;
					$fB = ($aSt[2]+$fPrt*($aEd[2]-$aSt[2]))/255;
					$xClr = $xCtrl->getElementsByTagName("Color")->item(0);
					$xClr->setAttribute("red",$fR);
					$xClr->setAttribute("green",$fG);
					$xClr->setAttribute("blue",$fB);
				} else {
					$fVl = $fSt + $fPrt*($fEd-$fSt);
					if($xCtrl->nodeName=="IntSliderControl") $fVl = intVal($fVl);
					$xVal = $xCtrl->getElementsByTagName("Value")->item(0);
					$xVal->setAttribute("value",$fVl);
				}
			}
		}
	}
	if ($xDoc->save($sFfxmlFile)) $sMsg = "Save succesfull";
} else { //////////////////////////////////////////////////////// preset batch
	//////////////////////////// create new ffxml file
	$xDoc = new DOMDocument();
	$xDoc->loadXML($sFile);

	$aPresets = array();
	$aPreset = $xDoc->getElementsByTagName("Preset");
	for ( $i=$aPreset->length; --$i>=0; ) {
		$xPr = $aPreset->item($i);
		$xPr->parentNode->removeChild($xPr);
		$aPresets[] = $xPr;
	}
	$axDef = $xDoc->getElementsByTagName("DefaultPreset")->item(0)->childNodes;
	$xPrn = $xDoc->getElementsByTagName("Presets")->item(0);
	$xNew =$xPrn->appendChild( new DOMElement("Preset"));
	for($j=0;$j<$axDef->length;$j++) $xNew->appendChild($axDef->item($j)->cloneNode(true));
	$aPresets[] = $xNew;
	$xPrn->removeChild($xNew); // weirdly, node cannot be manipulated without appendChild first
//	$aPresets = array_splice($aPresets,0,0,$xNew);
//dump(count($aPresets));
//dump(count($aPresets));

	$iNmPrst = 0;
	$sFilterType = $xDoc->getElementsByTagName("FilterType")->item(0)->getAttribute("value");// Filter>Components>Result>FilterType@value 0:simple 1:surface
	$aMp = $sFilterType=="0"?array("off","alpha map"):array("off","diffuse map","bump map","normal map","specular strength map","specular exponent map","metallic map","alpha map");
	foreach ($aPresets as $xNode) {
		foreach ($aMp as $i=>$sMap) {
			$xClone = $xNode->cloneNode(true);
			$xPrn->appendChild($xClone);
			$xSett = $xClone->getElementsByTagName("Settings")->item(0);
			$xSett->setAttribute("map_type",$i);
			$iNmPrst++;
		}	
	}
//dump($xDoc->saveXML());
//dump($iNmPrst);
	if ($xDoc->save($sFfxmlFile)) $sMsg = "Save succesfull";				
}
//
//
//////////////////////////// create xml file
$sXmlFile = $sTmp.$sName.".xml";
$xDoc = new DOMDocument();
$xDoc->load("batch.xml");
// globalsettings/renderoptions
$aGSetting = array("UseMultithreading","Dither","Progressive","OptimizeBlurs","AntiAliasBitmapComponentSources","Jitter","TemporaryFilesLocation","RAMUsageLimit","NormalMapFlipY");
$aCheckbox = array("UseMultithreading","Dither","Progressive","OptimizeBlurs","AntiAliasBitmapComponentSources","NormalMapFlipY");
foreach ($aGSetting as $v) {
	$xNode = $xDoc->getElementsByTagName($v)->item(0);
	$sVal = in_array($v,$aCheckbox)?((isset($_POST[$v])&&$_POST[$v]=="on")?"true":"false"):$_POST[$v];
	$xNode->setAttribute("value",$sVal);
}
// tasks
$iImgW = $_POST["width"];
$iImgH = $_POST["height"];
$sImgS = $_POST["srcimg"]==""?"":$sDst.$_POST["srcimg"];
$sFrmt = $_POST["form"];
$aTask = $xDoc->getElementsByTagName("Task");
for ( $i=$aTask->length; --$i>=0; ) {
	$xPr = $aTask->item($i);
	$xPrn = $xPr->parentNode;
	$xRem = $xPr->parentNode->removeChild($xPr);
}
if ($_POST["stype"]=="anim") { //////////////////////////////////////////////////////// animation
	$iFrLen = strlen("".$iFrames);
	$iDigits = (int)$_POST["digits"];
	$iIncrement = (int)$_POST["increment"];
	$iDigitStart = (int)$_POST["digitstart"];
	for ($i=0;$i<$iFrames;$i++) {
		$xNew = $xRem->cloneNode(true);
		// Image
		$xImg = $xNew->getElementsByTagName("Image")->item(0);
		$xImg->setAttribute("width",$iImgW);
		$xImg->setAttribute("height",$iImgH);
		$xImg->setAttribute("value",$sImgS);
		// Result
		$iImgNr = $iDigitStart+$i*$iIncrement;
		$xRes = $xNew->getElementsByTagName("Result")->item(0);
		$xRes->setAttribute("path",$sDst.$sRName.str_pad($iImgNr,max($iDigits,$iFrLen),"0",STR_PAD_LEFT).".".strtolower($sFrmt));
		$xRes->setAttribute("format",$sFrmt);
		// Filter
		$xFlt = $xNew->getElementsByTagName("Filter")->item(0);
		$xFlt->setAttribute("value",$sDst.$sFfxmlFile);
		// Preset
		$xPrs = $xNew->getElementsByTagName("Preset")->item(0);
		$xPrs->setAttribute("value",$i+1);
		//
		$xPrn->appendChild($xNew);
	}
} else { //////////////////////////////////////////////////////// preset batch
	$iFrLen = strlen("".floor($iNmPrst/count($aMp)));
	for ($i=0;$i<$iNmPrst;$i++) {
		$xNew = $xRem->cloneNode(true);
		// Image
		$xImg = $xNew->getElementsByTagName("Image")->item(0);
		$xImg->setAttribute("width",$iImgW);
		$xImg->setAttribute("height",$iImgH);
		$xImg->setAttribute("value",$sImgS);
		// Result
		$iNr = floor($i/count($aMp))+1;
		$sTpe = $aMp[$i%count($aMp)];
		$xRes = $xNew->getElementsByTagName("Result")->item(0);
		$xRes->setAttribute("path",$sDst.$sRName."_preset_".str_pad($iNr,$iFrLen,"0",STR_PAD_LEFT)."_".str_replace(" ","_",$sTpe).".".strtolower($sFrmt));
		$xRes->setAttribute("format",$sFrmt);
		// Filter
		$xFlt = $xNew->getElementsByTagName("Filter")->item(0);
		$xFlt->setAttribute("value",$sDst.$sFfxmlFile);
		// Preset
		$xPrs = $xNew->getElementsByTagName("Preset")->item(0);
		$xPrs->setAttribute("value",$i+1);
		//
		$xPrn->appendChild($xNew);
	}
}
if ($xDoc->save($sXmlFile)) $sMsg = "Save succesfull";
//
//
//////////////////////////// create bat file
$sBatFile = $sTmp.$sName.".bat";
$sBatData = "@echo off\necho ----- START BATCH -----\nCALL ".$sRnd." ".$sDst.$sName.".xml\necho ----- END BATCH -----";
//dump($sBatData);
$BatH = fopen($sBatFile,"w");
fwrite($BatH, $sBatData);
fclose($BatH);
//
//
//////////////////////////// create zip file
$sZipFile = $sTmp.$sName.".zip";
$aFiles = array($sFfxmlFile,$sXmlFile,$sBatFile);
//	dump($aFiles);
$oZip = new createZip();
//$createZip->addDirectory($sPspPath);
foreach ($aFiles as $sFile) {
	$sCnts = file_get_contents($sFile);
	$oZip->addFile($sCnts,$sFile);
}
$oZipH = fopen($sZipFile,"wb");
fwrite($oZipH, $oZip->getZippedfile());
fclose ($oZipH);
//
foreach ($aFiles as $sFile) @unlink($sFile);

$oZip->forceDownload($sZipFile);
@unlink($sZipFile);
?>