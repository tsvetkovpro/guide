<? //что б не скомуниздили
$money += $_GET['saving']['sum'];
$percent += $_GET['saving']['percent'];
$month += $_GET['saving']['month'];
$pensioner += $_GET['saving']['pensioner'];
if($_GET['type'] == 'ezhemesyachnyi'){
 /* $oblagaemaya_stavka = ($percent - 13.25)*0.01;
	$neoblagaemaya_summa = $money*0.1325;
	$oblagaemaya_summa = $money*$oblagaemaya_stavka;
	$pribil_za_minusom_naloga = $oblagaemaya_summa - $oblagaemaya_summa*0.35;
	$dohod_za_god = $neoblagaemaya_summa + $pribil_za_minusom_naloga;
	$dohod_za_mesyac = $dohod_za_god/12;
	$result = $dohod_za_mesyac * $month; */
	/* $result = ($money*0.1325 + ($money*(($percent - 13.25)*0.01) - $money*(($percent - 13.25)*0.01)*0.35))/12 * $month; //в сжатом виде чебы за один присест */
	if(!$pensioner){
		if($month == 24){
			$result = (($money*$percent)/100)/12*$month-(((($percent-(10.5+5))*$money/100)*0.35)/12*$month);
		}else{
			$result = (($percent*$money)/100)/12*$month;
		}
	}else{
		if($month == 24 || $month == 12){
			$result = (($money*$percent)/100)/12*$month-(((($percent-(10.5+5))*$money/100)*0.35)/12*$month);
		}else{
			$result = (($percent*$money)/100)/12*$month;
		}
	}
	echo (round($result));
}
if($_GET['type'] == 'sberegatelnyj'){
 /* $oblagaemaya_stavka = ($percent - 13.25)*0.01;
	$neoblagaemaya_summa = $money*0.1325;
	$oblagaemaya_summa = $money*$oblagaemaya_stavka;
	$pribil_za_minusom_naloga = $oblagaemaya_summa - $oblagaemaya_summa*0.35;
	$dohod_za_god = $neoblagaemaya_summa + $pribil_za_minusom_naloga;
	$dohod_za_mesyac = $dohod_za_god/12;
	$result = $dohod_za_mesyac * $month; */
	/* $result = ($money*0.1325 + ($money*(($percent - 13.25)*0.01) - $money*(($percent - 13.25)*0.01)*0.35))/12 * $month; //в сжатом виде чебы за один присест */
	if(!$pensioner){
		if($month == 6 || $month == 12 || $month == 24){
			$result = (($money*$percent)/100)/12*$month-(((($percent-(10.5+5))*$money/100)*0.35)/12*$month);
		}else{
			$result = (($percent*$money)/100)/12*$month;
		}
	}else{
		$result = (($money*$percent)/100)/12*$month-(((($percent-(10.5+5))*$money/100)*0.35)/12*$month);
	}
	echo (round($result));
}
?>
