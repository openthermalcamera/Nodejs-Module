// const otc = require('../index')

function newData(data){
  console.log("new data ",data);
}

const mlx = require('../MLX90640')
var Fdata = [0xff94,0xff94,0xff96,0xff8b,0xff93,0xff8c,0xff8f,0xff81,0xff8d,0xff85,0xff8a,0xff80,0xff90,0xff89,0xff95,0xff84,0xff96,0xff86,0xff93,0xff81,0xff93,0xff89,0xff8e,0xff7f,0xff94,0xff85,0xff93,0xff82,0xff9a,0xff98,0xffb5,0xff9e,0xff8e,0xff8b,0xff86,0xff89,0xff8b,0xff82,0xff81,0xff81,0xff85,0xff7d,0xff7c,0xff7c,0xff8a,0xff82,0xff85,0xff86,0xff8e,0xff81,0xff83,0xff83,0xff8d,0xff81,0xff83,0xff7e,0xff8d,0xff82,0xff86,0xff84,0xff92,0xff92,0xffa7,0xff9f,0xff8f,0xff8e,0xff91,0xff87,0xff8e,0xff89,0xff90,0xff83,0xff8c,0xff82,0xff89,0xff79,0xff8b,0xff88,0xff91,0xff84,0xff93,0xff86,0xff93,0xff82,0xff93,0xff85,0xff92,0xff7e,0xff91,0xff85,0xff92,0xff7f,0xff95,0xff8b,0xffb1,0xff9c,0xff8a,0xff85,0xff7f,0xff86,0xff88,0xff80,0xff7e,0xff83,0xff88,0xff7a,0xff7a,0xff7b,0xff84,0xff7f,0xff7f,0xff83,0xff8d,0xff80,0xff86,0xff80,0xff8e,0xff7d,0xff83,0xff7f,0xff8c,0xff7f,0xff84,0xff81,0xff8f,0xff81,0xffa2,0xff9c,0xff93,0xff8c,0xff8f,0xff86,0xff91,0xff8a,0xff8f,0xff84,0xff8d,0xff83,0xff8a,0xff7c,0xff87,0xff84,0xff8e,0xff80,0xff94,0xff87,0xff8f,0xff81,0xff91,0xff85,0xff91,0xff7f,0xff92,0xff83,0xff90,0xff80,0xff91,0xff84,0xffa9,0xff94,0xff8c,0xff83,0xff7f,0xff86,0xff8b,0xff80,0xff7f,0xff80,0xff85,0xff79,0xff7b,0xff7d,0xff7f,0xff79,0xff7f,0xff7d,0xff8c,0xff7e,0xff80,0xff81,0xff8b,0xff7d,0xff84,0xff80,0xff8d,0xff7b,0xff84,0xff80,0xff8d,0xff7e,0xff93,0xff91,0xff91,0xff8e,0xff91,0xff85,0xff8a,0xff85,0xff8b,0xff83,0xff89,0xff84,0xff85,0xff7d,0xff88,0xff7d,0xff8e,0xff80,0xff8e,0xff84,0xff8d,0xff7f,0xff90,0xff83,0xff8f,0xff7e,0xff94,0xff86,0xff8f,0xff81,0xff91,0xff83,0xff92,0xff7e,0xff87,0xff85,0xff7e,0xff83,0xff83,0xff7c,0xff78,0xff80,0xff81,0xff78,0xff75,0xff7c,0xff80,0xff75,0xff79,0xff7e,0xff86,0xff7b,0xff7c,0xff7d,0xff87,0xff79,0xff7e,0xff7c,0xff8e,0xff7d,0xff80,0xff80,0xff89,0xff79,0xff82,0xff7a,0xff93,0xff8f,0xff8d,0xff88,0xff89,0xff88,0xff88,0xff80,0xff8a,0xff82,0xff87,0xff7a,0xff86,0xff7e,0xff87,0xff7a,0xff8f,0xff84,0xff8d,0xff7e,0xff8d,0xff84,0xff90,0xff80,0xff93,0xff84,0xff90,0xff7d,0xff8d,0xff7e,0xff8f,0xff78,0xff89,0xff81,0xff7b,0xff84,0xff83,0xff7b,0xff77,0xff7b,0xff81,0xff77,0xff75,0xff76,0xff7c,0xff74,0xff74,0xff79,0xff86,0xff7a,0xff7c,0xff7b,0xff85,0xff7a,0xff7e,0xff7d,0xff8b,0xff7b,0xff7f,0xff7d,0xff86,0xff74,0xff7d,0xff75,0xff94,0xff8e,0xff8e,0xff85,0xff90,0xff89,0xff8a,0xff7f,0xff8c,0xff84,0xff86,0xff7c,0xff87,0xff7d,0xff86,0xff7a,0xff8f,0xff82,0xff8c,0xff7c,0xff8d,0xff7f,0xff8e,0xff7d,0xff90,0xff81,0xff8b,0xff7a,0xff89,0xff7a,0xff89,0xff76,0xff88,0xff82,0xff7c,0xff80,0xff86,0xff7b,0xff75,0xff7c,0xff7f,0xff78,0xff74,0xff77,0xff7d,0xff73,0xff75,0xff76,0xff83,0xff74,0xff78,0xff79,0xff85,0xff76,0xff7c,0xff7a,0xff87,0xff76,0xff7b,0xff75,0xff80,0xff70,0xff7a,0xff74,0xff8d,0xff8f,0xff8e,0xff85,0xff89,0xff86,0xff8b,0xff7e,0xff87,0xff81,0xff87,0xff7b,0xff85,0xff7f,0xff87,0xff79,0xff84,0xff7a,0xff81,0xff73,0xff89,0xff7e,0xff88,0xff78,0xff8b,0xff7f,0xff89,0xff78,0xff87,0xff7a,0xff8e,0xff76,0xff81,0xff7e,0xff77,0xff7d,0xff7d,0xff77,0xff75,0xff78,0xff7b,0xff72,0xff71,0xff75,0xff7c,0xff72,0xff73,0xff73,0xff7b,0xff71,0xff6d,0xff6c,0xff7e,0xff70,0xff75,0xff75,0xff80,0xff72,0xff77,0xff76,0xff80,0xff71,0xff7c,0xff70,0xff8d,0xff8c,0xff8c,0xff87,0xff8b,0xff87,0xff86,0xff7e,0xff85,0xff83,0xff84,0xff7c,0xff86,0xff7e,0xff82,0xff78,0xff87,0xff7a,0xff86,0xff78,0xff84,0xff79,0xff84,0xff78,0xff8a,0xff7c,0xff88,0xff78,0xff8a,0xff80,0xff8d,0xff77,0xff7f,0xff7b,0xff76,0xff7e,0xff7c,0xff75,0xff70,0xff76,0xff79,0xff73,0xff6f,0xff73,0xff79,0xff70,0xff6f,0xff70,0xff7e,0xff6f,0xff71,0xff73,0xff7e,0xff6d,0xff74,0xff75,0xff7f,0xff71,0xff76,0xff74,0xff7f,0xff74,0xff7a,0xff73,0xff8f,0xff8e,0xff8a,0xff87,0xff8c,0xff85,0xff87,0xff7d,0xff88,0xff7e,0xff84,0xff79,0xff84,0xff7e,0xff82,0xff75,0xff84,0xff7b,0xff84,0xff75,0xff87,0xff7c,0xff85,0xff77,0xff88,0xff7e,0xff84,0xff76,0xff88,0xff7e,0xff8a,0xff74,0xff7c,0xff7c,0xff72,0xff7b,0xff7d,0xff74,0xff6f,0xff74,0xff7a,0xff6d,0xff6e,0xff72,0xff78,0xff6f,0xff6f,0xff6e,0xff7a,0xff6f,0xff6d,0xff6f,0xff7e,0xff6d,0xff71,0xff72,0xff7e,0xff71,0xff75,0xff72,0xff80,0xff73,0xff78,0xff70,0xff86,0xff8e,0xff87,0xff82,0xff84,0xff86,0xff86,0xff7d,0xff82,0xff7f,0xff81,0xff79,0xff81,0xff7c,0xff84,0xff77,0xff83,0xff7c,0xff81,0xff74,0xff87,0xff7b,0xff86,0xff76,0xff84,0xff7e,0xff86,0xff75,0xff87,0xff7c,0xff8b,0xff78,0xff76,0xff76,0xff6d,0xff77,0xff75,0xff72,0xff6d,0xff73,0xff73,0xff6c,0xff6b,0xff6f,0xff74,0xff6a,0xff6b,0xff6d,0xff77,0xff6a,0xff6b,0xff6e,0xff7b,0xff6c,0xff6f,0xff6f,0xff7a,0xff6f,0xff74,0xff73,0xff7d,0xff72,0xff76,0xff71,0xff83,0xff8d,0xff84,0xff82,0xff83,0xff85,0xff84,0xff7d,0xff83,0xff7f,0xff82,0xff78,0xff80,0xff7d,0xff81,0xff75,0xff82,0xff7d,0xff83,0xff76,0xff86,0xff7c,0xff83,0xff75,0xff87,0xff7c,0xff86,0xff77,0xff87,0xff7f,0xff89,0xff75,0xff71,0xff72,0xff6a,0xff72,0xff72,0xff6e,0xff6a,0xff70,0xff72,0xff6b,0xff69,0xff6e,0xff72,0xff68,0xff67,0xff6b,0xff74,0xff6a,0xff6c,0xff6c,0xff78,0xff6b,0xff6b,0xff6e,0xff7b,0xff6c,0xff70,0xff70,0xff7c,0xff71,0xff74,0xff70,0xff83,0xff8a,0xff85,0xff82,0xff85,0xff85,0xff83,0xff7d,0xff83,0xff7f,0xff7e,0xff78,0xff7f,0xff7e,0xff7d,0xff74,0xff81,0xff7a,0xff81,0xff72,0xff86,0xff7c,0xff81,0xff76,0xff82,0xff7c,0xff82,0xff77,0xff83,0xff7d,0xff85,0xff75,0xff67,0xff67,0xff5e,0xff6a,0xff68,0xff66,0xff5f,0xff67,0xff6a,0xff63,0xff5d,0xff64,0xff67,0xff61,0xff5b,0xff61,0xff68,0xff5e,0xff60,0xff60,0xff6f,0xff62,0xff60,0xff66,0xff6d,0xff61,0xff64,0xff64,0xff6f,0xff62,0xff6b,0xff64,0x4d9c,0x1a54,0x7fff,0x1a54,0x7fff,0x1a53,0x7fff,0x1a53,0xffa6,0xcd3f,0x16e3,0xd62f,0xfff7,0x9,0xffff,0xffff,0x1935,0x406,0x28b,0x7fff,0x1935,0x406,0x28b,0x7fff,0x1,0x1,0x1,0x1,0x1,0x1,0x1,0x1,0x695,0x7fff,0x1a54,0x7fff,0x1a54,0x7fff,0x1a53,0x7fff,0xffa9,0xf5a6,0xce72,0xd66c,0x7,0xfffd,0xfffd,0x0,0xef,0x40,0x29bf,0x3b,0xf0,0x3f,0x29bf,0x3b,0x1,0x1,0x1,0x1,0x1,0x1,0x1,0x1,0x1901,0x1 ]
var eeData =[0xa7,0x999f,0x0,0x2061,0x5,0x320,0x3e0,0x90a,0x2c45,0x1186,0x499,0x0,0x1901,0x0,0x0,0xbe33,0x4220,0xffb4,0x201,0x202,0x202,0xe1f2,0xd0e1,0x9fc0,0x1,0x102,0x102,0xf102,0xf102,0xe0f2,0xe0f2,0xc0e1,0x8895,0x3659,0xedcb,0x110f,0x3322,0x2233,0x22,0xccee,0xddcb,0xff,0x1111,0x2222,0x2233,0x1122,0xff01,0xcdee,0x173b,0x2fb7,0x2555,0x9e7b,0x7666,0xf1c9,0x3b37,0x3636,0x2452,0x892,0x17b0,0x625,0xec00,0x9797,0x9797,0x2afb,0x880,0x1770,0x2b9e,0xfc3e,0x79e,0x850,0x1ba0,0xfbde,0x80e,0xc10,0x1c3e,0xf4ae,0x45e,0x47e,0x183e,0xfc3e,0x13a0,0xff90,0x142e,0xf03e,0x810,0xbb0,0x1c7e,0xf43e,0x2,0xf840,0x146e,0xf3be,0xf4ce,0xf420,0xfe0,0xe49e,0x462,0xb5e,0xff7e,0xff0,0xff80,0x4e,0xf38c,0xbbe,0x3e2,0x3fe,0xf40c,0x460,0xfc22,0xf84e,0xf00c,0x1000,0xf62,0xf75e,0xf3fe,0x7e0,0x7e2,0xff7e,0xf83e,0xc00,0xffc2,0xf7fe,0xf43e,0x780,0xf890,0xf7e0,0xefae,0xfc60,0xf8ce,0x3f0,0x145e,0xec8e,0xf410,0x60,0xff0,0xf3ee,0x7a0,0xfca0,0xcce,0xe8ae,0xf89e,0xfc40,0x88e,0xf05e,0x3a0,0xf3ce,0xfc0,0xe83e,0x2,0xf840,0x1430,0xec5e,0xf420,0xec70,0x8a0,0xe07e,0xf490,0xe8b2,0x30,0xe090,0x90,0x7be,0xf82e,0xc5e,0xffe0,0x44e,0xf3ce,0xfb0,0xf82,0x7e,0xf0ae,0xc60,0x50,0x2,0xf06c,0x1010,0xf72,0xfb9e,0xfb9e,0x800,0xbd4,0xfc20,0xe,0x1000,0x7f2,0xf840,0xf86e,0x430,0x462,0xf490,0xf3f0,0x460,0xc60,0x10,0x1fce,0xf80e,0xbb0,0x470,0x17a0,0xf7f0,0x832,0x400,0x1030,0xec5e,0x470,0x20,0x1020,0xf46e,0xf90,0xfb90,0xc70,0xf000,0x430,0xfc20,0x1fa0,0xf7d0,0x3b2,0xecc0,0xc90,0xe430,0xf890,0xf050,0xbd0,0xe0e0,0x1030,0x7de,0xff9e,0x13c0,0xf62,0x83e,0xf76e,0xfb0,0xfe2,0x7ce,0xfbfe,0x810,0x832,0x7e0,0xf7fe,0x1040,0x1754,0xfb5e,0xf03e,0x13c0,0xbf4,0x7d0,0x77e,0x1780,0xf64,0xf480,0xfc3e,0xbe0,0x452,0xf810,0xf790,0xa0,0x4e,0xb70,0x1f8e,0xf40e,0xfbe0,0x850,0xc0e,0xf7de,0x20,0x7e0,0xc9e,0xf3ee,0x3f0,0xfc60,0x17be,0xf810,0x790,0xf790,0x86e,0xf3c0,0x3f2,0xffe0,0x1820,0xf7f0,0x732,0xf410,0x1060,0xef70,0xfc30,0xf420,0xf90,0xe490,0x82,0x7a0,0xffce,0xc40,0xfc12,0x9e,0xe84e,0x800,0xfc62,0x41e,0xecde,0x810,0x432,0xfca0,0xf7fe,0x1020,0x7d2,0xf7d0,0xe8ae,0x810,0x42,0xfc20,0xf86e,0x1030,0xf54,0xf850,0xf48e,0xfa0,0x472,0xf850,0xf7c0,0xd0,0x400,0xba2,0x1830,0xfba0,0xfbfe,0x810,0xc0e,0xf7e0,0x10,0x410,0x1060,0xec8e,0xfc80,0xfca0,0x103e,0xf83e,0xb42,0xfb70,0xff0,0xf3ce,0x22,0x3c0,0x1f90,0xf7d0,0xff62,0xf812,0x1030,0xebe0,0xf880,0xf442,0xf92,0xe870,0x432,0xffc0,0xec5e,0xfd0,0xf442,0x20,0xe44e,0x410,0xfc42,0xfc4e,0xe8ae,0xa0,0xf8b2,0xf890,0xec4e,0xc50,0xb82,0xf3b0,0xec1e,0xbe0,0xfc62,0xffe0,0xffce,0xc00,0x394,0xf430,0xf05e,0x410,0xfca2,0xf470,0xf3c0,0x90,0xfe2,0xb50,0x1f80,0xf43e,0xb70,0xfd2,0xfe0,0xf7be,0x410,0x7d0,0xc40,0xf030,0x400,0x42,0x81e,0xfbf0,0xf20,0xfb62,0x1380,0xf3a0,0x3d2,0xf7f0,0x1ba0,0xf7b0,0xff32,0xf420,0x430,0xebe0,0xf430,0xf7e2,0x3a2,0xe450,0x412,0xfb70,0xf3ae,0xfc40,0xffa2,0xfff0,0xe3fe,0x3e0,0xfc32,0xfbe0,0xe46e,0xfc50,0x22,0xf45e,0xe44e,0x810,0xb44,0xf380,0xebbe,0x7b0,0x3f4,0xfbe0,0xf7be,0xbd0,0x354,0xec40,0xe85e,0xfff0,0xf842,0xf3f0,0xe7c0,0xfc60,0xf430,0x770,0x13f0,0xec40,0xf7c0,0x462,0xbb0,0xf3d0,0xf820,0x62,0x870,0xe850,0xfc10,0x2,0xff0,0xf020,0xffe0,0xf762,0x420,0xe800,0x372,0xffa2,0x13f0,0xf3e0,0xf782,0xf022,0x810,0xe7d0,0xf060,0xf042,0x770,0xe460,0xf840,0xfb80,0xec0e,0x50,0xfbd2,0xfc70,0xebce,0xbe0,0xfc42,0xfc80,0xe88e,0x482,0x32,0x30,0xf00e,0x1040,0x7f2,0xfb60,0xec3e,0x820,0xf94,0x3c0,0xf81e,0x17f0,0x394,0xf840,0xf440,0x800,0x92,0xf860,0xf380,0x870,0x40,0x13f2,0x1810,0x3d0,0xffe0,0x1050,0xc40,0xf860,0x70,0x1042,0x10b0,0xf48e,0x440,0xc62,0x1080,0xfc90,0xf82,0x3f0,0x1030,0xf810,0x400,0xe2,0x14b0,0xfc20,0x3b0,0x42,0x1060,0xf020,0xfc90,0x422,0x13b0,0xf480,0x42,0xfc00,0xf01e,0xfe0,0xffe2,0x450,0xe84e,0x860,0x472,0x850,0xf0be,0xca0,0x862,0x470,0xf49e,0x1490,0x1794,0xfc00,0xf44e,0x1422,0x1022,0xe0,0xfcbe,0x1c20,0xfc2,0x460,0xfc80,0x1420,0xc82,0x820,0xfbc0,0x1480,0x7e0,0x16e2,0x13b0,0xfb90,0xff10,0xfd2,0xb30,0xf7a0,0xb92,0x462,0x800,0xf050,0x30,0xbe2,0xbe0,0xf820,0x790,0xff70,0x840,0xf020,0x7b2,0x32,0x1050,0xfbe0,0xfb82,0xfc02,0x40,0xe430,0xf410,0xffe2,0x360,0xec20,0xf7e2,0xfee0,0xe79e,0x780,0xfb22,0xfbd0,0xe33e,0x792,0x7a2,0xf850,0xe81e,0xfc50,0x42,0xfc00,0xebfe,0x830,0x792,0xf780,0xe84e,0x440,0xbc4,0xfc40,0xf45e,0x17f0,0x7a4,0xf800,0xf040,0x30,0x402,0xffe0,0xf340,0x800,0xf450,0x1b62,0x17c0,0xfc20,0xf7c0,0x1bd2,0x1390,0xfc00,0xfc70,0xca2,0x10c0,0xf8e0,0x90,0xce2,0x1440,0x470,0x802,0x7d2,0x1070,0xf880,0xbe2,0xc70,0x1c40,0x70,0xfc32,0x852,0x10a0,0xf470,0x60,0x462,0xfa0,0xfc10,0xe830,0xfb50,0xe7ae,0xfc00,0xebb2,0xffc0,0xe77e,0x7f0,0xf482,0xfc90,0xe4ce,0xe0,0xfc92,0xfcd0,0xec4e,0x1080,0x804,0xfbe0,0xe87e,0x880,0xfe4,0x470,0xf840,0x1470,0x22,0x50,0xf49e,0xc60,0x452,0x450,0xf78e,0x1bf0,0xe05e,0xf62,0x7c0,0xf422,0xef50,0xff2,0x39e,0xf7f0,0xf420,0x492,0x8b0,0xece0,0xf8a0,0x4e2,0x890,0xf520,0xfc10,0x3d0,0x840,0xf090,0xfc30,0x872,0x1080,0xf890,0xfbf2,0xfcc2,0x880,0xec60,0xf450,0x7f0,0x770,0xf420,0xdc42,0xfb40,0xdf9e,0xfff0,0xef42,0xfbd0,0xdf7e,0x3d0,0xf402,0xfc60,0xe49e,0x4c0,0xfc92,0xfce0,0xe88e,0xd10,0x402,0xffc0,0xec3e,0xc80,0x812,0x470,0xf870,0x1880,0xbd2,0xfc90,0xf45e,0x1030,0x822,0xbc0,0xf750,0x1800,0xec50,0x1392,0xb90,0x360,0xf75e,0x1782,0x70e,0xfb60,0xfbc0,0xc12,0x6e,0xf830,0xf8ae,0x8a0,0xbe,0xf900,0x40,0x432,0xc50,0xf4c0,0xbf2,0x1412,0x1470,0xbd0,0xf7d0,0x482,0x3e,0xf410,0xf030,0xbf2,0xfb4e,0xfff0,0xe432,0xf380,0xdb7e,0x740,0xeb30,0x360,0xdeee,0x740,0xfb92,0xffe0,0xe04e,0x10,0xfc82,0xfc80,0xe49e,0x4e0,0x432,0xf820,0xec3e,0xca0,0x13d2,0xc00,0xf86e,0x27b0,0x3c2,0xfc70,0xf02e,0x800,0x810,0x7e0,0xf730,0x1be0 ];

// otc.connect().then(function(){
//   otc.setCallbackForNewData(newData)
//   otc.sendPing(5).then(function(data){
//       otc.EE(Fdata)
//   })
// })

mlx.extractParameters(eeData);
mlx.getTemp(Fdata)