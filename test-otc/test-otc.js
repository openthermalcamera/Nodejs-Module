const otc = require('../index')

function newData(data){
  console.log("new data: ",data)
}

otc.connect().then(function(){
  console.log('connected')
  otc.setCallbackForNewData(newData)
  otc.setRefreshRate(otc.refreshRate.HZ_1).then(function(){
    console.log('refresh rate setting:')
    setTimeout(start, 500);
  });
    otc.setAutoFrameSending(otc.autoFrameSending.ENABLED).then(function(data){
    console.log('Auto frame sending enabled');
  })
  
  

})
function start(){

  otc.getFrameData().then(function(data){
    console.log('FD',data)
  })
}
