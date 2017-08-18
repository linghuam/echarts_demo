class MapGraph {

  constructor(filename, elementId, equipmentName) {

    this._eqname = equipmentName;
    this._allData = [];
    this._chinajson = null;
    this._echarts = echarts.init(document.getElementById(elementId));
    this.getData(filename).then(this._callbackFunc.bind(this));

  }

  async getData(filename) {
    this._allData = await Util.readFile(filename);
    this._chinajson = await Util.getJson('data/china.json');
  }

  _callbackFunc() {
    echarts.registerMap('china',this._chinajson);

    var filterData = this._allData.where(o => o.equipment === this._eqname);
    var catedata = filterData.groupBy('location');
    var data = [];
    var geoCoordMap = {};
    for(let i = 0, len = catedata.length; i < len; i++) {
      data.push({
        name: catedata[i].key,
        value: this.getSum(catedata[i].value)
      });
      geoCoordMap[catedata[i].key] = [parseFloat(catedata[i].value[0].longitude), parseFloat(catedata[i].value[0].latitude)];
    }

    var convertData = function (data) {
      var res = [];
      for(var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if(geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
    };

    var option = {
      backgroundColor: '#404a59',
      title: {
        text: '地点分布',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return params.name + ' : ' + params.value[2];
        }
      },
      // legend: {
      //   orient: 'vertical',
      //   y: 'bottom',
      //   x: 'right',
      //   data: ['count'],
      //   textStyle: {
      //     color: '#fff'
      //   }
      // },
      geo: {
        map: 'china',
        label: {
          emphasis: {
            show: false
          }
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: '#111'
          },
          emphasis: {
            areaColor: '#2a333d'
          }
        }
      },
      series: [{
          name: 'count',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: convertData(data),
          symbolSize: function (val) {
            return val[2] / 10;
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#ddb926'
            }
          }
        },
        {
          name: 'Top5',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: convertData(data.sort(function (a, b) {
            return b.value - a.value;
          }).slice(0, 6)),
          symbolSize: function (val) {
            return val[2] / 10;
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#f4e925',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          zlevel: 1
        }
      ]
    };

    this._echarts.setOption(option);
  }

  getSum(arr) {
    var sum = 0;
    for(let i = 0, len = arr.length; i < len; i++) {
      let value = parseInt(arr[i].loc_count);
      sum += value;
    }
    return sum;
  }

}