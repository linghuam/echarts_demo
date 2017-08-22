'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagGraph = function () {
  function TagGraph() {
    _classCallCheck(this, TagGraph);

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

  _createClass(TagGraph, [{
    key: 'getData',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Util.readFile('data/全部标签统计.csv');

              case 2:
                this._allData = _context.sent;
                _context.next = 5;
                return Util.readFile('data/故障原因标签统计.csv');

              case 5:
                this._gzData = _context.sent;
                _context.next = 8;
                return Util.readFile('data/器件原因标签统计.csv');

              case 8:
                this._qjData = _context.sent;
                _context.next = 11;
                return Util.readFile('data/行为原因标签统计.csv');

              case 11:
                this._xwData = _context.sent;
                _context.next = 14;
                return Util.readFile('data/TOP5折线图 - 日期.csv');

              case 14:
                this._lineData = _context.sent;

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getData() {
        return _ref.apply(this, arguments);
      }

      return getData;
    }()
  }, {
    key: 'loadData',
    value: function loadData() {
      if (!this._allData || !this._gzData || !this._qjData || !this._xwData || !this._lineData) {
        $('#loading').css('display', 'block');
        this.getData().then(this._callbackFunc.bind(this));
      }
    }
  }, {
    key: 'updateWordCloud',
    value: function updateWordCloud(type, elementId) {
      var origdata = null;
      if (type === 'all') {
        origdata = this._allData;
      } else if (type === 'gz') {
        origdata = this._gzData;
      } else if (type === 'qj') {
        origdata = this._qjData;
      } else if (type === 'xw') {
        origdata = this._xwData;
      }
      if (!origdata) return;
      var list = [];
      for (var i = 0, len = origdata.length; i < len; i++) {
        list.push([origdata[i].tag_name, parseInt(origdata[i].tag_count)]);
      }
      var option = {
        title: {
          text: '', //'词云',
          left: 'left'
        },
        tooltip: {
          show: true,
          formatter: function formatter(item) {
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
  }, {
    key: 'updatePie',
    value: function updatePie(type, elementId) {
      var origdata = null;
      var titleText = '';
      if (type === 'all') {
        origdata = this._allData;
        titleText = '';
      } else if (type === 'gz') {
        origdata = this._gzData;
        titleText = '故障现象分布';
      } else if (type === 'qj') {
        origdata = this._qjData;
        titleText = '器件质量问题分布';
      } else if (type === 'xw') {
        origdata = this._xwData;
        titleText = '操作使用原因分布';
      }
      if (!origdata) return;

      var data = [];
      for (var i = 0, len = origdata.length; i < len; i++) {
        data.push({
          name: origdata[i].tag_name,
          value: parseInt(origdata[i].tag_count)
        });
      }

      //数据个数限制
      data = data.slice(0, 30);

      var option = {
        title: {
          text: titleText,
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
  }, {
    key: 'updateBar',
    value: function updateBar(type, elementId) {
      var origdata = null;
      var titleText = '';
      if (type === 'all') {
        origdata = this._allData;
        titleText = '';
      } else if (type === 'gz') {
        origdata = this._gzData;
        titleText = '故障现象统计';
      } else if (type === 'qj') {
        origdata = this._qjData;
        titleText = '器件质量问题统计';
      } else if (type === 'xw') {
        origdata = this._xwData;
        titleText = '操作使用原因统计';
      }
      if (!origdata) return;
      var x = [],
          y = [];
      for (var i = 0, len = origdata.length; i < len; i++) {
        x.push(origdata[i].tag_name);
        y.push(parseInt(origdata[i].tag_count));
      }

      //数据个数限制
      x = x.slice(0, 30);
      y = y.slice(0, 30);

      var option = {
        title: {
          text: titleText,
          left: 'left'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          formatter: function formatter(params) {
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
  }, {
    key: 'updateLine',
    value: function updateLine(type, elementId) {
      var titleText = '';
      if (type === 'all') {
        titleText = '';
      } else if (type === 'gz') {
        titleText = '故障现象Top5走势';
      } else if (type === 'qj') {
        titleText = '器件质量问题Top5走势';
      } else if (type === 'xw') {
        titleText = '操作使用原因Top5走势';
      }
      var lineType = this.categories[type];
      var filterData = this._lineData.where(function (o) {
        return o.line_type === lineType;
      });
      var grby = filterData.groupBy('tag_name');
      var series = [];
      var legendData = [];
      for (var i = 0, len = grby.length; i < len; i++) {
        series.push({
          name: grby[i].key,
          type: 'line',
          data: this.getseriesData(grby[i].value)
        });
        legendData.push(grby[i].key);
      }

      var option = {
        title: {
          text: titleText,
          left: 'left'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function formatter(params) {
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
          top: 30,
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
            formatter: function formatter(value) {
              return Util.getTimeStrFromUnix2(value);
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '计数',
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
  }, {
    key: 'getTableData',
    value: function getTableData(type) {
      var origdata = null;
      if (type === 'all') {
        origdata = this._allData;
      } else if (type === 'gz') {
        origdata = this._gzData;
      } else if (type === 'qj') {
        origdata = this._qjData;
      } else if (type === 'xw') {
        origdata = this._xwData;
      }
      return origdata;
    }
  }, {
    key: 'getseriesData',
    value: function getseriesData(arr) {
      var data = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        data.push({
          name: arr[i].tag_name,
          value: [arr[i].create_time, parseInt(arr[i].tag_count)]
        });
      }
      return data;
    }
  }, {
    key: '_callbackFunc',
    value: function _callbackFunc() {
      $('#loading').css('display', 'none');
      $('.tag_container .tag_all').click();
    }
  }]);

  return TagGraph;
}();