class TagGraph {

  constructor() {

    this._allData = null;
    this._gzData = null;
    this._qjData = null;
    this._xwData = null;
    this._lineData = null;
    this.categories = {
      all: '全部',
      qj: '器件',
      gz: '故障',
      xw: '行为'
    };
  }

  async getData() {
    this._allData = await Util.readFile('data/全部标签统计.csv');
    this._gzData = await Util.readFile('data/故障原因标签统计.csv');
    this._qjData = await Util.readFile('data/器件原因标签统计.csv');
    this._xwData = await Util.readFile('data/行为原因标签统计.csv');
    this._lineData = await Util.readFile('data/TOP5折线图 - 日期.csv');
  }

  loadData() {
    if(!this._allData || !this._gzData || !this._qjData || !this._xwData || !this._lineData) {
      $('#loading').css('display', 'block');
      this.getData().then(this._callbackFunc.bind(this));
    }
  }

  updateWordCloud(type, elementId) {
    var origdata = null;
    if(type === 'all') {
      origdata = this._allData;
    } else if(type === 'gz') {
      origdata = this._gzData;
    } else if(type === 'qj') {
      origdata = this._qjData;
    } else if(type === 'xw') {
      origdata = this._xwData;
    }
    if(!origdata) return;
    var list = [];
    for(let i = 0, len = origdata.length; i < len; i++) {
      list.push([origdata[i].tag_name, parseInt(origdata[i].tag_count)]);
    }
    var option = {
      title: {
        text: '词云',
        left: 'center'
      },
      tooltip: {
        show: true,
        formatter: function (item) {
          return item[0];
        }
      },
      list: list,
      shape: 'circle',
      ellipticity: 1
    };
    var wc = new Js2WordCloud(document.getElementById(elementId));
    wc.setOption(option);
  }

  updatePie(type, elementId) {
    var origdata = null;
    if(type === 'all') {
      origdata = this._allData;
    } else if(type === 'gz') {
      origdata = this._gzData;
    } else if(type === 'qj') {
      origdata = this._qjData;
    } else if(type === 'xw') {
      origdata = this._xwData;
    }
    if(!origdata) return;

    var data = [];
    for(let i = 0, len = origdata.length; i < len; i++) {
      data.push({
        name: origdata[i].tag_name,
        value: parseInt(origdata[i].tag_count)
      });
    }

    //数据个数限制
    data = data.slice(0, 30);

    var option = {
      title: {
        text: '饼图',
        left: 'left'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
      },
      series: [{
        name: 'count',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    echarts.dispose(document.getElementById(elementId));
    var ect = echarts.init(document.getElementById(elementId));
    ect.setOption(option);
  }

  updateBar(type, elementId) {
    var origdata = null;
    if(type === 'all') {
      origdata = this._allData;
    } else if(type === 'gz') {
      origdata = this._gzData;
    } else if(type === 'qj') {
      origdata = this._qjData;
    } else if(type === 'xw') {
      origdata = this._xwData;
    }
    if(!origdata) return;
    var x = [],
      y = [];
    for(let i = 0, len = origdata.length; i < len; i++) {
      x.push(origdata[i].tag_name);
      y.push(parseInt(origdata[i].tag_count));
    }

    //数据个数限制
    x = x.slice(0, 30);
    y = y.slice(0, 30);

    var option = {
      title: {
        text: '柱状图',
        left: 'left'
      },
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          var name = params.name;
          var data = params.data;
          return name + '</br>' + data;
        },
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: x,
        axisTick: {
          interval: 0,
          alignWithLabel: true
        },
        axisLabel: {
          show: true,
          rotate: 80,
          interval: 0
        }
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: 'count',
        type: 'bar',
        barWidth: '60%',
        data: y
      }]
    };
    echarts.dispose(document.getElementById(elementId));
    var ect = echarts.init(document.getElementById(elementId));
    ect.setOption(option);
  }

  updateLine(type, elementId) {
    var lineType = this.categories[type];
    var filterData = this._lineData.where(o => o.line_type === lineType);
    var grby = filterData.groupBy('tag_name');
    var series = [];
    var legendData = [];
    for(let i = 0, len = grby.length; i < len; i++) {
      series.push({
        name: grby[i].key,
        type: 'line',
        data: this.getseriesData(grby[i].value)
      });
      legendData.push(grby[i].key);
    }

    var option = {
      title: {
        text: lineType,
        left: 'left'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          var name = params.name;
          var time = params.value[0];
          var count = params.value[1];
          return name + ':' + count + '\n' + time;
        },
        axisPointer: {
          animation: false
        }
      },
      legend: {
        data: legendData,
        orient: 'horizontal',
        left: 'center'
      },
      xAxis: {
        type: 'time',
        name: '时间',
        axisTick: {
          show: true,
          alignWithLabel: false,
          interval: 0
        },
        axisLabel: {
          show: true,
          interval: 0,
          formatter: function (value) {
            return Util.getTimeStrFromUnix2(value);
          }
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: '个数',
        splitLine: {
          show: true
        }
      },
      series: series
    };
    echarts.dispose(document.getElementById(elementId));
    var ect = echarts.init(document.getElementById(elementId));
    ect.setOption(option);
  }

  getTableData(type) {
    var origdata = null;
    if(type === 'all') {
      origdata = this._allData;
    } else if(type === 'gz') {
      origdata = this._gzData;
    } else if(type === 'qj') {
      origdata = this._qjData;
    } else if(type === 'xw') {
      origdata = this._xwData;
    }
    return origdata;
  }

  getseriesData(arr) {
    var data = [];
    for(let i = 0, len = arr.length; i < len; i++) {
      data.push({
        name: arr[i].tag_name,
        value: [arr[i].create_time, parseInt(arr[i].tag_count)]
      });
    }
    return data;
  }

  _callbackFunc() {
    $('#loading').css('display', 'none');
    $('.tag_container .tag_all').click();
  }


}