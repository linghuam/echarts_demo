var Util = {};

// d3读取csv文件
Util.readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    d3.csv(fileName, function (error, data) {
      if(error) throw error;
      resolve(data);
    });
  });
}

// 用Paparse读取csv文件
Util.readFileByPaparse = function (fileName) {
  return new Promise(function (resolve, reject) {
    Papa.parse(fileName, {
      download: true,
      complete: function (results) {
        resolve(results.data);
      }
    });
  });
}

//获取json文件
Util.getJson = function (fileName) {
  return new Promise(function (resolve, reject) {
    d3.json(fileName, function (error, data) {
      if(error) throw error;
      resolve(data);
    });
  });
}

//将unix时间戳转化为字符串(yy-mm-dd hh:mm:ss)
Util.getTimeStrFromUnix = function (time) {
  time = parseInt(time * 1000)
  if(isNaN(time)) {
    return ''
  }
  var newDate = new Date(time)
  var year = newDate.getFullYear()
  var month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1
  var day = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()
  var hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()
  var minuts = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()
  var seconds = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds()
  var ret = year + '-' + month + '-' + day + ' ' + hours + ':' + minuts + ':' + seconds
  return ret
}

Util.getTimeStrFromUnix2 = function (time) {
  time = parseInt(time)
  if(isNaN(time)) {
    return ''
  }
  var newDate = new Date(time)
  var year = newDate.getFullYear()
  var month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1
  var day = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()
  var hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()
  var minuts = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()
  var seconds = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds()
  var ret = year + '/' + month + '/' + day 
  return ret
}

//将unix时间戳转化为字符串(yy-mm-dd)
Util.getTimeStrFromUnixYMD = function (time) {
  time = parseInt(time * 1000)
  if(isNaN(time)) {
    return ''
  }
  var newDate = new Date(time)
  var year = newDate.getFullYear()
  var month = (newDate.getMonth() + 1) < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1
  var day = newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()
  var hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()
  var minuts = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()
  var seconds = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds()
  var ret = year + '-' + month + '-' + day
  return ret
}

//得到特定格式(yy-mm-dd hh:mm:ss)时间的unix时间戳
Util.getCusUnixTime = function (sjstr) {
  var sjsplit = sjstr.split(" ");
  var ymd = sjsplit[0].split("-");
  var hms = sjsplit[1].split(":");
  var year = parseInt(ymd[0]);
  var month = parseInt(ymd[1]) > 0 ? parseInt(ymd[1]) - 1 : 0;
  var day = parseInt(ymd[2]);
  var hour = parseInt(hms[0]);
  var minutes = parseInt(hms[1]);
  var seconds = parseInt(hms[2]);
  var d = new Date(year, month, day, hour, minutes, seconds);
  return d.valueOf() / 1000;
}

Util.getCusUnixDate = function (sjstr) {
  var sjsplit = sjstr.split(" ");
  var ymd = sjsplit[0].split("-");
  var hms = sjsplit[1].split(":");
  var year = parseInt(ymd[0]);
  var month = parseInt(ymd[1]) > 0 ? parseInt(ymd[1]) - 1 : 0;
  var day = parseInt(ymd[2]);
  var hour = parseInt(hms[0]);
  var minutes = parseInt(hms[1]);
  var seconds = parseInt(hms[2]);
  var d = new Date(year, month, day, hour, minutes, seconds);
  return d
}