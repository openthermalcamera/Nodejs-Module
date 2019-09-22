var mlx = {
	kVdd: -1,
	vdd25: -1,
	KvPTAT: -1,
	KtPTAT: -1,
	vPTAT25: -1,
	alphaPTAT: -1,
	gainEE: -1,
	tgc: -1,
	cpKv: -1,
	cpKta: -1,
	resolutionEE: -1,
	calibrationModeEE: -1,
	KsTa: -1,
	ksTo: new Array(4),
	ct: new Array(4),
	alpha: new Array(768),
	offset: new Array(768),
	kta: new Array(768),
	kv: new Array(768),
	cpAlpha: new Array(2),
	cpOffset: new Array(2),
	ilChessC: new Array(3),
	brokenPixels: new Array(5),
	outlierPixels: new Array(5),
};
const emissivity = 1;
const frameLength = 834
const IR_WIDTH = 32;
const IR_HEIGHT = 24;
const taShift = 8;
const SCALEALPHA = 0.000001;

function extractParameters(data){
   eeData = new Array(832)
   for(var i = 0; i < eeData.length; i++){
	   eeData[i] = ((data[i*2 + 0] & 0xFF) << 8) | ((data[i*2 + 1] & 0xFF));
   }
   // console.log('extractParameters called');
   var error = 0;

   ExtractVDD(eeData);
   ExtractPTAT(eeData);
   ExtractGain(eeData);
   ExtractTgc(eeData);
   ExtractResolution(eeData);
   ExtractKsTa(eeData);
   ExtractKsTo(eeData);
   ExtractAlpha(eeData);
   ExtractOffset(eeData);
   ExtractKtaPixel(eeData);
   ExtractKvPixel(eeData);
   ExtractCP(eeData);
   ExtractCILC(eeData);
   error = ExtractDeviatingPixels(eeData);
//    console.log(mlx)
   return error;
}

function GetTa(frameData, vdd)
{
   var ptat;
   var ptatArt;
   var ta = 0;

   ptat = frameData[800];
   if(ptat > 32767)
   {
	   ptat = ptat - 65536;
   }
   
   ptatArt = frameData[768];
   if(ptatArt > 32767)
   {
	   ptatArt = ptatArt - 65536;
   }
   ptatArt = (ptat / (ptat * mlx.alphaPTAT + ptatArt)) * Math.pow(2.0, 18.0);
   ta = (ptatArt / (1 + mlx.KvPTAT * (vdd - 3.3)) - mlx.vPTAT25);
   ta = ta / mlx.KtPTAT + 25;
   console.log(ta, ptatArt, ptat)
   return ta;
}
function GetVdd(frameData)
{
   var vdd;
   var resolutionCorrection;
   var resolutionRAM;

   vdd = frameData[810];
   if (vdd > 32767)
   {
	   vdd = vdd - 65536;
   }
  
   resolutionRAM = (frameData[832] & 0x0C00) >> 10;
   resolutionCorrection = Math.pow(2, mlx.resolutionEE) / Math.pow(2, resolutionRAM);
   vdd = (resolutionCorrection * vdd - mlx.vdd25) / mlx.kVdd + 3.3;
   return vdd;
}
//Calculate frameData varo temperatures
function getTemp(data)
{
   //Convert bytes to uint16_t
   var frameData = new Array(834);
   for(var i = 0; i < 834; i++){
	   frameData[i] = ((data[i*2 + 0] & 0xFF) << 8) | ((data[i*2 + 1] & 0xFF));
   }
   var result = new Array(768);
   var vdd;
   var ta;
   var ta4;
   var tr4;
   var taTr;
   var gain;
   var irDataCP = new Array(2);
   var irData;
   var alphaCompensated;
   var mode;
   var ilPattern;
   var chessPattern;
   var pattern;
   var conversionPattern;
   var Sx;
   var To;
   var alphaCorrR = new Array(4);
   var range;
   var subPage;

   subPage = frameData[833];
   vdd = GetVdd(frameData);
   ta = GetTa(frameData, vdd);
   var tr = ta - taShift;
   ta4 = (ta + 273.15);
   ta4 = ta4 * ta4;
   ta4 = ta4 * ta4;
   tr4 = (tr + 273.15);
   tr4 = tr4 * tr4;
   tr4 = tr4 * tr4;
   taTr = tr4 - (tr4 - ta4) / emissivity;

   alphaCorrR[0] = 1 / (1 + mlx.ksTo[0] * 40);
   alphaCorrR[1] = 1;
   alphaCorrR[2] = (1 + mlx.ksTo[1] * mlx.ct[2]);
   alphaCorrR[3] = alphaCorrR[2] * (1 + mlx.ksTo[2] * (mlx.ct[3] - mlx.ct[2]));
   console.log(subPage, vdd,ta,tr,ta4,taTr, alphaCorrR)
   //------------------------- Gain calculation -----------------------------------    
   gain = frameData[778];
   if (gain > 32767)
   {
	   gain = gain - 65536;
   }

   gain = mlx.gainEE / gain;

   //------------------------- To calculation -------------------------------------    
   mode = (frameData[832] & 0x1000) >> 5;

   irDataCP[0] = frameData[776];
   irDataCP[1] = frameData[808];
   for (var i = 0; i < 2; i++)
   {
	   if (irDataCP[i] > 32767)
	   {
		   irDataCP[i] = irDataCP[i] - 65536;
	   }
	   irDataCP[i] = irDataCP[i] * gain;
   }
   irDataCP[0] = irDataCP[0] - mlx.cpOffset[0] * (1 + mlx.cpKta * (ta - 25)) * (1 + mlx.cpKv * (vdd - 3.3));
   if (mode == mlx.calibrationModeEE)
   {
	   irDataCP[1] = irDataCP[1] - mlx.cpOffset[1] * (1 + mlx.cpKta * (ta - 25)) * (1 + mlx.cpKv * (vdd - 3.3));
   }
   else
   {
	   irDataCP[1] = irDataCP[1] - (mlx.cpOffset[1] + mlx.ilChessC[0]) * (1 + mlx.cpKta * (ta - 25)) * (1 + mlx.cpKv * (vdd - 3.3));
   }
   
   for (var pixelNumber = 0; pixelNumber < 768; pixelNumber++)
   {
	   ilPattern = pixelNumber / 32 - (pixelNumber / 64) * 2;
	   chessPattern = ilPattern ^ (pixelNumber - parseInt(pixelNumber / 2) * 2);
	   conversionPattern = (parseInt(pixelNumber + 2) / 4) - parseInt((pixelNumber + 3) / 4) + parseInt((pixelNumber + 1) / 4) - parseInt(pixelNumber / 4) * (1 - 2 * ilPattern);
	   if (mode == 0)
	   {
		   pattern = ilPattern;
	   }
	   else
	   {
		   pattern = chessPattern;
	   }
	   if (pattern === frameData[833])
	   {
		   irData = frameData[pixelNumber];
		   if (irData > 32767)
		   {
			   irData = irData - 65536;
		   }
		   irData = irData * gain;

		   irData = irData - mlx.offset[pixelNumber] * (1 + mlx.kta[pixelNumber] * (ta - 25)) * (1 + mlx.kv[pixelNumber] * (vdd - 3.3));
		   if (mode != mlx.calibrationModeEE)
		   {
			   irData = irData + mlx.ilChessC[2] * (2 * ilPattern - 1) - mlx.ilChessC[1] * conversionPattern;
		   }

		   irData = irData / emissivity;

		   irData = irData - mlx.tgc * irDataCP[subPage];

		   alphaCompensated = (mlx.alpha[pixelNumber] - mlx.tgc * mlx.cpAlpha[subPage]) * (1 + mlx.KsTa * (ta - 25));

		   Sx = Math.pow(alphaCompensated, 3.0) * (irData + alphaCompensated * taTr);
		   Sx = Math.sqrt(Math.sqrt(Sx)) * mlx.ksTo[1];

		   To = Math.sqrt(Math.sqrt(irData / (alphaCompensated * (1 - mlx.ksTo[1] * 273.15) + Sx) + taTr)) - 273.15;

		   if (To < mlx.ct[1])
		   {
			   range = 0;
		   }
		   else if (To < mlx.ct[2])
		   {
			   range = 1;
		   }
		   else if (To < mlx.ct[3])
		   {
			   range = 2;
		   }
		   else
		   {
			   range = 3;
		   }

		   To = Math.sqrt(Math.sqrt(irData / (alphaCompensated * alphaCorrR[range] * (1 + mlx.ksTo[range] * (To - mlx.ct[range]))) + taTr)) - 273.15;

		   result[pixelNumber] = To;
	   }
   }
   console.log(result)
   return result;
}

//Extract parameters from eeData:
function ExtractVDD(eeData)
{
   var kVdd;
   var vdd25;
   kVdd = eeData[51];
   
   kVdd = (eeData[51] & 0xFF00) >> 8;
   if(kVdd > 127)
   {
	   kVdd = kVdd - 256;
   }
   kVdd = 32 * kVdd;
   vdd25 = eeData[51] & 0x00FF;
   vdd25 = ((vdd25 - 256) << 5) - 8192;
   
   mlx.kVdd = kVdd;
   mlx.vdd25 = vdd25; 
}

function ExtractPTAT(eeData){
   var KvPTAT;
   var KtPTAT;
   var vPTAT25;
   var alphaPTAT;
   
   KvPTAT = (eeData[50] & 0xFC00) >> 10;
   if(KvPTAT > 31)
   {
	   KvPTAT = KvPTAT - 64;
   }
   KvPTAT = KvPTAT/4096;
   
   KtPTAT = eeData[50] & 0x03FF;
   if(KtPTAT > 511)
   {
	   KtPTAT = KtPTAT - 1024;
   }
   KtPTAT = KtPTAT/8;
   
   vPTAT25 = eeData[49];
   
   alphaPTAT = (eeData[16] & 0xF000) / Math.pow(2, 14.0) + 8.0;
   
   mlx.KvPTAT = KvPTAT;
   mlx.KtPTAT = KtPTAT;    
   mlx.vPTAT25 = vPTAT25;
   mlx.alphaPTAT = alphaPTAT;  
}
//-------------------------------
function ExtractGain(eeData)
{
   var gainEE;
   gainEE = eeData[48];
   if(gainEE > 32767)
   {
	   gainEE = gainEE - 65536;
   }
   mlx.gainEE = gainEE;    
}

//------------------------------------------------------------------------------

function ExtractTgc(eeData)
{
   var tgc;
   tgc = eeData[60] & 0x00FF;
   if(tgc > 127)
   {
	   tgc = tgc - 256;
   }
   tgc = tgc / 32.0;

   mlx.tgc = tgc;        
}

//------------------------------------------------------------------------------

function ExtractResolution(eeData)
{
   var resolutionEE;
   resolutionEE = (eeData[56] & 0x3000) >> 12;    
   mlx.resolutionEE = resolutionEE;
}

//------------------------------------------------------------------------------

function ExtractKsTa(eeData)
{
   var KsTa;
   KsTa = (eeData[60] & 0xFF00) >> 8;
   if(KsTa > 127)
   {
	   KsTa = KsTa -256;
   }
   KsTa = KsTa / 8192.0;
   mlx.KsTa = KsTa;
}

//------------------------------------------------------------------------------

function ExtractKsTo(eeData)
{
   var KsToScale;
   var step;

   step = ((eeData[63] & 0x3000) >> 12) * 10;

   mlx.ct[0] = -40;
   mlx.ct[1] = 0;
   mlx.ct[2] = (eeData[63] & 0x00F0) >> 4;
   mlx.ct[3] = (eeData[63] & 0x0F00) >> 8;

   mlx.ct[2] = mlx.ct[2]*step;
   mlx.ct[3] = mlx.ct[2] + mlx.ct[3]*step;

   KsToScale = (eeData[63] & 0x000F) + 8;
   KsToScale = 1 << KsToScale;

   mlx.ksTo[0] = eeData[61] & 0x00FF;
   mlx.ksTo[1] = (eeData[61] & 0xFF00) >> 8;
   mlx.ksTo[2] = eeData[62] & 0x00FF;
   mlx.ksTo[3] = (eeData[62] & 0xFF00) >> 8;

   for(var i = 0; i < 4; i++)
   {
	   if(mlx.ksTo[i] > 127)
	   {
		   mlx.ksTo[i] = mlx.ksTo[i] -256;
	   }
	   mlx.ksTo[i] = mlx.ksTo[i] / KsToScale;
   } 
}

//------------------------------------------------------------------------------

function ExtractAlpha(eeData)
{
   var accRow = new Array(24);
   var accColumn = new Array(32);
   var p = 0;
   var alphaRef;
   var alphaScale;
   var accRowScale;
   var accColumnScale;
   var accRemScale;


   accRemScale = eeData[32] & 0x000F;
   accColumnScale = (eeData[32] & 0x00F0) >> 4;
   accRowScale = (eeData[32] & 0x0F00) >> 8;
   alphaScale = ((eeData[32] & 0xF000) >> 12) + 30;
   alphaRef = eeData[33];

   for (var i = 0; i < 6; i++)
   {
	   p = i * 4;
	   accRow[p + 0] = (eeData[34 + i] & 0x000F);
	   accRow[p + 1] = (eeData[34 + i] & 0x00F0) >> 4;
	   accRow[p + 2] = (eeData[34 + i] & 0x0F00) >> 8;
	   accRow[p + 3] = (eeData[34 + i] & 0xF000) >> 12;
   }

   for (var i = 0; i < 24; i++)
   {
	   if (accRow[i] > 7)
	   {
		   accRow[i] = accRow[i] - 16;
	   }
   }
   for (var i = 0; i < 8; i++)
   {
	   p = i * 4;
	   accColumn[p + 0] = (eeData[40 + i] & 0x000F);
	   accColumn[p + 1] = (eeData[40 + i] & 0x00F0) >> 4;
	   accColumn[p + 2] = (eeData[40 + i] & 0x0F00) >> 8;
	   accColumn[p + 3] = (eeData[40 + i] & 0xF000) >> 12;
   }

   for (var i = 0; i < 32; i++)
   {
	   if (accColumn[i] > 7)
	   {
		   accColumn[i] = accColumn[i] - 16;
	   }
   }
   
   for (var i = 0; i < 24; i++)
   {
	   for (var j = 0; j < 32; j++)
	   {
		   p = 32 * i + j;
		   mlx.alpha[p] = (eeData[64 + p] & 0x03F0) >> 4;
		   if (mlx.alpha[p] > 31)
		   {
			mlx.alpha[p] = mlx.alpha[p] - 64;
		   }
		   mlx.alpha[p] = mlx.alpha[p] * (1 << accRemScale);
		   mlx.alpha[p] = (alphaRef + (accRow[i] << accRowScale) + (accColumn[j] << accColumnScale) + mlx.alpha[p]);
		   mlx.alpha[p] = mlx.alpha[p] / Math.pow(2, alphaScale);
	   }
   }
}

//------------------------------------------------------------------------------

function ExtractOffset(eeData)
{
   var occRow = new Array(24);
   var occColumn = new Array(32);
   var p = 0;
   var offsetRef;
   var occRowScale;
   var occColumnScale;
   var occRemScale;


   occRemScale = (eeData[16] & 0x000F);
   occColumnScale = (eeData[16] & 0x00F0) >> 4;
   occRowScale = (eeData[16] & 0x0F00) >> 8;
   offsetRef = eeData[17];
   if (offsetRef > 32767)
   {
	   offsetRef = offsetRef - 65536;
   }

   for(var i = 0; i < 6; i++)
   {
	   p = i * 4;
	   occRow[p + 0] = (eeData[18 + i] & 0x000F);
	   occRow[p + 1] = (eeData[18 + i] & 0x00F0) >> 4;
	   occRow[p + 2] = (eeData[18 + i] & 0x0F00) >> 8;
	   occRow[p + 3] = (eeData[18 + i] & 0xF000) >> 12;
   }

   for(var i = 0; i < 24; i++)
   {
	   if (occRow[i] > 7)
	   {
		   occRow[i] = occRow[i] - 16;
	   }
   }

   for(var i = 0; i < 8; i++)
   {
	   p = i * 4;
	   occColumn[p + 0] = (eeData[24 + i] & 0x000F);
	   occColumn[p + 1] = (eeData[24 + i] & 0x00F0) >> 4;
	   occColumn[p + 2] = (eeData[24 + i] & 0x0F00) >> 8;
	   occColumn[p + 3] = (eeData[24 + i] & 0xF000) >> 12;
   }

   for(var i = 0; i < 32; i ++)
   {
	   if (occColumn[i] > 7)
	   {
		   occColumn[i] = occColumn[i] - 16;
	   }
   }

   for(var i = 0; i < 24; i++)
   {
	   for(var j = 0; j < 32; j ++)
	   {
		   p = 32 * i +j;
		   mlx.offset[p] = (eeData[64 + p] & 0xFC00) >> 10;
		   if (mlx.offset[p] > 31)
		   {
			   mlx.offset[p] = mlx.offset[p] - 64;
		   }
		   mlx.offset[p] = mlx.offset[p]*(1 << occRemScale);
		   mlx.offset[p] = (offsetRef + (occRow[i] << occRowScale) + (occColumn[j] << occColumnScale) + mlx.offset[p]);
	   }
   }
}

//------------------------------------------------------------------------------

function ExtractKtaPixel(eeData)
{
   var p = 0;
   var KtaRC = new Array(4);
   var KtaRoCo;
   var KtaRoCe;
   var KtaReCo;
   var KtaReCe;
   var ktaScale1;
   var ktaScale2;
   var split;

   KtaRoCo = (eeData[54] & 0xFF00) >> 8;
   if (KtaRoCo > 127)
   {
	   KtaRoCo = KtaRoCo - 256;
   }
   KtaRC[0] = KtaRoCo;

   KtaReCo = (eeData[54] & 0x00FF);
   if (KtaReCo > 127)
   {
	   KtaReCo = KtaReCo - 256;
   }
   KtaRC[2] = KtaReCo;

   KtaRoCe = (eeData[55] & 0xFF00) >> 8;
   if (KtaRoCe > 127)
   {
	   KtaRoCe = KtaRoCe - 256;
   }
   KtaRC[1] = KtaRoCe;

   KtaReCe = (eeData[55] & 0x00FF);
   if (KtaReCe > 127)
   {
	   KtaReCe = KtaReCe - 256;
   }
   KtaRC[3] = KtaReCe;

   ktaScale1 = ((eeData[56] & 0x00F0) >> 4) + 8;
   ktaScale2 = (eeData[56] & 0x000F);
   for (var i = 0; i < 24; i++)
   {
	   for (var j = 0; j < 32; j++)
	   {
		   p = 32 * i + j;
		   split = 2 * (parseInt(p / 32) - parseInt(p / 64) * 2) + p % 2;
		   mlx.kta[p] = (eeData[64 + p] & 0x000E) >> 1;
		   if (mlx.kta[p] > 3)
		   {
			mlx.kta[p] = mlx.kta[p] - 8;
		   }
		   mlx.kta[p] = mlx.kta[p] * (1 << ktaScale2);
		   mlx.kta[p] = KtaRC[split] + mlx.kta[p];
		   mlx.kta[p] = mlx.kta[p] / Math.pow(2, ktaScale1);
		   //ktaTemp[p] = ktaTemp[p] * mlx.offset[p];
	   }
   }
}

//------------------------------------------------------------------------------

function ExtractKvPixel(eeData)
{
   var p = 0;
   var KvT = new Array(4);
   var KvRoCo;
   var KvRoCe;
   var KvReCo;
   var KvReCe;
   var kvScale;
   var split;

   KvRoCo = (eeData[52] & 0xF000) >> 12;
   if (KvRoCo > 7)
   {
	   KvRoCo = KvRoCo - 16;
   }
   KvT[0] = KvRoCo;

   KvReCo = (eeData[52] & 0x0F00) >> 8;
   if (KvReCo > 7)
   {
	   KvReCo = KvReCo - 16;
   }
   KvT[2] = KvReCo;

   KvRoCe = (eeData[52] & 0x00F0) >> 4;
   if (KvRoCe > 7)
   {
	   KvRoCe = KvRoCe - 16;
   }
   KvT[1] = KvRoCe;

   KvReCe = (eeData[52] & 0x000F);
   if (KvReCe > 7)
   {
	   KvReCe = KvReCe - 16;
   }
   KvT[3] = KvReCe;
   kvScale = (eeData[56] & 0x0F00) >> 8;
   for (var i = 0; i < 24; i++)
   {
	   for (var j = 0; j < 32; j++)
	   {
		   p = (32 * i) + j;
		   split = parseInt(2 * (parseInt(p / 32) - parseInt(p / 64) * 2) + p % 2);
		   mlx.kv[p] = KvT[split];
		   mlx.kv[p] = mlx.kv[p] / Math.pow(2, kvScale);
		   //kvTemp[p] = kvTemp[p] * mlx.offset[p];
	   }
   }
}

//------------------------------------------------------------------------------

function ExtractCP(eeData)
{
   var alphaSP = new Array(2);
   var offsetSP = new Array(2)
   var cpKv;
   var cpKta;
   var alphaScale;
   var ktaScale1;
   var kvScale;

   alphaScale = ((eeData[32] & 0xF000) >> 12) + 27;

   offsetSP[0] = (eeData[58] & 0x03FF);
   if (offsetSP[0] > 511)
   {
	   offsetSP[0] = offsetSP[0] - 1024;
   }

   offsetSP[1] = (eeData[58] & 0xFC00) >> 10;
   if (offsetSP[1] > 31)
   {
	   offsetSP[1] = offsetSP[1] - 64;
   }
   offsetSP[1] = offsetSP[1] + offsetSP[0]; 

   alphaSP[0] = (eeData[57] & 0x03FF);
   if (alphaSP[0] > 511)
   {
	   alphaSP[0] = alphaSP[0] - 1024;
   }
   alphaSP[0] = alphaSP[0] /  Math.pow(2,alphaScale);

   alphaSP[1] = (eeData[57] & 0xFC00) >> 10;
   if (alphaSP[1] > 31)
   {
	   alphaSP[1] = alphaSP[1] - 64;
   }
   alphaSP[1] = (1 + alphaSP[1]/128) * alphaSP[0];

   cpKta = (eeData[59] & 0x00FF);
   if (cpKta > 127)
   {
	   cpKta = cpKta - 256;
   }
   ktaScale1 = ((eeData[56] & 0x00F0) >> 4) + 8;    
   mlx.cpKta = cpKta / Math.pow(2, ktaScale1);

   cpKv = (eeData[59] & 0xFF00) >> 8;
   if (cpKv > 127)
   {
	   cpKv = cpKv - 256;
   }
   kvScale = (eeData[56] & 0x0F00) >> 8;
   mlx.cpKv = cpKv / Math.pow(2,kvScale);
	   
   mlx.cpAlpha[0] = alphaSP[0];
   mlx.cpAlpha[1] = alphaSP[1];
   mlx.cpOffset[0] = offsetSP[0];
   mlx.cpOffset[1] = offsetSP[1];  
}

//------------------------------------------------------------------------------

function ExtractCILC(eeData)
{
   var ilChessC = new Array(3);
   var calibrationModeEE;

   calibrationModeEE = (eeData[10] & 0x0800) >> 4;
   calibrationModeEE = calibrationModeEE ^ 0x80;

   ilChessC[0] = (eeData[53] & 0x003F);
   if (ilChessC[0] > 31)
   {
	   ilChessC[0] = ilChessC[0] - 64;
   }
   ilChessC[0] = ilChessC[0] / 16.0;

   ilChessC[1] = (eeData[53] & 0x07C0) >> 6;
   if (ilChessC[1] > 15)
   {
	   ilChessC[1] = ilChessC[1] - 32;
   }
   ilChessC[1] = ilChessC[1] / 2.0;

   ilChessC[2] = (eeData[53] & 0xF800) >> 11;
   if (ilChessC[2] > 15)
   {
	   ilChessC[2] = ilChessC[2] - 32;
   }
   ilChessC[2] = ilChessC[2] / 8.0;

   mlx.calibrationModeEE = calibrationModeEE;
   mlx.ilChessC[0] = ilChessC[0];
   mlx.ilChessC[1] = ilChessC[1];
   mlx.ilChessC[2] = ilChessC[2];
}

//------------------------------------------------------------------------------

function ExtractDeviatingPixels(eeData)
{
   var pixCnt = 0;
   var brokenPixCnt = 0;
   var outlierPixCnt = 0;
   var warn = 0;
   var i;

   for(pixCnt = 0; pixCnt<5; pixCnt++)
   {
	   mlx.brokenPixels[pixCnt] = 0xFFFF;
	   mlx.outlierPixels[pixCnt] = 0xFFFF;
   }
	   
   pixCnt = 0;    
   while (pixCnt < 768 && brokenPixCnt < 5 && outlierPixCnt < 5)
   {
	   if(eeData[pixCnt+64] == 0)
	   {
		   mlx.brokenPixels[brokenPixCnt] = pixCnt;
		   brokenPixCnt = brokenPixCnt + 1;
	   }    
	   else if((eeData[pixCnt+64] & 0x0001) != 0)
	   {
		   mlx.outlierPixels[outlierPixCnt] = pixCnt;
		   outlierPixCnt = outlierPixCnt + 1;
	   }    
	   
	   pixCnt = pixCnt + 1;
	   
   } 

   if(brokenPixCnt > 4)  
   {
	   warn = -3;
   }         
   else if(outlierPixCnt > 4)  
   {
	   warn = -4;
   }
   else if((brokenPixCnt + outlierPixCnt) > 4)  
   {
	   warn = -5;
   } 
   else
   {
	   for(pixCnt=0; pixCnt<brokenPixCnt; pixCnt++)
	   {
		   for(i=pixCnt+1; i<brokenPixCnt; i++)
		   {
			   warn = CheckAdjacentPixels(mlx.brokenPixels[pixCnt],mlx.brokenPixels[i]);
			   if(warn != 0)
			   {
				   return warn;
			   }    
		   }    
	   }
	   
	   for(pixCnt=0; pixCnt<outlierPixCnt; pixCnt++)
	   {
		   for(i=pixCnt+1; i<outlierPixCnt; i++)
		   {
			   warn = CheckAdjacentPixels(mlx.outlierPixels[pixCnt],mlx.outlierPixels[i]);
			   if(warn != 0)
			   {
				   return warn;
			   }    
		   }    
	   } 
	   
	   for(pixCnt=0; pixCnt<brokenPixCnt; pixCnt++)
	   {
		   for(i=0; i<outlierPixCnt; i++)
		   {
			   warn = CheckAdjacentPixels(mlx.brokenPixels[pixCnt],mlx.outlierPixels[i]);
			   if(warn != 0)
			   {
				   return warn;
			   }    
		   }    
	   }    
   }    
   return warn;
}

//------------------------------------------------------------------------------

function CheckAdjacentPixels(pix1, pix2)
{
   var pixPosDif;
   
   pixPosDif = pix1 - pix2;
   if(pixPosDif > -34 && pixPosDif < -30)
   {
	   return -6;
   } 
   if(pixPosDif > -2 && pixPosDif < 2)
   {
	   return -6;
   } 
   if(pixPosDif > 30 && pixPosDif < 34)
   {
	   return -6;
   }
   
   return 0;    
}
//------------------------------------------------------------------------------
function CheckEEPROMValid(eeData)  
{
   var deviceSelect;
   deviceSelect = eeData[10] & 0x0040;
   if(deviceSelect == 0)
   {
	   return 0;
   }
   return -7;
}

module.exports = {
   extractParameters: extractParameters,
   getTemp: getTemp,
   mlx: mlx
}