"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EqpGraph = function () {
    function EqpGraph() {
        _classCallCheck(this, EqpGraph);

        this._eqpListData = null;
        this._nodesData = null;
        this._linkData = null;
        this._tagDocData = null;
        this._docData = null;
        this._timeData = null;
        this._radarData = null;
        this._mapData = null;
        this._chinajson = null;

        this._categories = [{ name: "操作" }, { name: "器件" }, { name: "故障" }, { name: "装备" }];
        this.categories = {
            all: '全部',
            qj: '器件',
            gz: '故障',
            xw: '行为'
        };
    }

    _createClass(EqpGraph, [{
        key: "getData",
        value: async function getData() {
            this._eqpListData = await Util.readFile('data/装备列表.csv');
            this._nodesData = await Util.readFile('data/装备关联点-时间戳.csv');
            this._linkData = await Util.readFile('data/装备关联边-时间戳-无向.csv');
            this._tagDocData = await Util.readFile('data/装备关联文章列表.csv');
            this._docData = await Util.readFile('data/文章列表.csv');
            this._timeData = await Util.readFile('data/装备关联最大值最小值-时间戳.csv');
            this._radarData = await Util.readFile('data/装备雷达-总.csv');
            this._mapData = await Util.readFile('data/装备故障地点-经纬度.csv');
            this._chinajson = await Util.getJson('data/china.json');
        }
    }, {
        key: "getDocDetailById",
        value: function getDocDetailById(id) {
            var data = this._docData.where(function (o) {
                return o.id === id;
            });
            return data;
        }
    }, {
        key: "loadData",
        value: function loadData(callback) {
            var self = this;
            if (!this._eqpListData || !this._nodesData || !this._linkData || !this._tagDocData || !this._docData || !this._timeData || !this._radarData || !this._mapData || !this._chinajson) {
                $('#loading').css('display', 'block');
                this.getData().then(function () {
                    self._callbackFunc();
                    if (callback) callback();
                });
            } else {
                callback();
            }
        }
    }, {
        key: "getEqpListData",
        value: function getEqpListData() {
            return this._eqpListData;
        }
    }, {
        key: "updateRadar",
        value: function updateRadar(elementIds, equipmentName) {
            var _this = this;

            this._xwData = this._radarData.where(function (o) {
                return o.equipment === equipmentName && o.tag_type === _this.categories.xw;
            });
            this._qjData = this._radarData.where(function (o) {
                return o.equipment === equipmentName && o.tag_type === _this.categories.qj;
            });
            this._gzData = this._radarData.where(function (o) {
                return o.equipment === equipmentName && o.tag_type === _this.categories.gz;
            });

            this._updateRadar(elementIds[0], this.categories.xw);
            this._updateRadar(elementIds[1], this.categories.qj);
            this._updateRadar(elementIds[2], this.categories.gz);
        }
    }, {
        key: "_updateRadar",
        value: function _updateRadar(elementId, category) {
            var titleText = '';
            echarts.dispose(document.getElementById(elementId));
            var myecharts = echarts.init(document.getElementById(elementId));
            if (category === this.categories.xw) {
                var _getRadarOptData2 = this._getRadarOptData(this._xwData),
                    categoryData = _getRadarOptData2.categoryData,
                    countData = _getRadarOptData2.countData;

                titleText = '操作使用原因';
            } else if (category === this.categories.qj) {
                var _getRadarOptData3 = this._getRadarOptData(this._qjData),
                    categoryData = _getRadarOptData3.categoryData,
                    countData = _getRadarOptData3.countData;

                titleText = '器件质量问题';
            } else if (category === this.categories.gz) {
                var _getRadarOptData4 = this._getRadarOptData(this._gzData),
                    categoryData = _getRadarOptData4.categoryData,
                    countData = _getRadarOptData4.countData;

                titleText = '故障现象';
            }
            if (categoryData.length && countData.length) {
                var max = this.getMax(countData);
                if (max) {
                    categoryData = categoryData.map(function (d) {
                        d.max = max;
                        return d;
                    });
                }
                var option = {
                    title: {
                        text: titleText,
                        left: 'left'
                    },
                    tooltip: {},
                    radar: {
                        indicator: categoryData
                    },
                    series: [{
                        name: '装备',
                        type: 'radar',
                        data: [{
                            value: countData,
                            name: titleText
                        }]
                    }]
                };

                myecharts.setOption(option);
            }
        }
    }, {
        key: "_getRadarOptData",
        value: function _getRadarOptData(data) {
            var categoryData = [];
            var countData = [];
            if (data.length) {
                var d2 = data.groupBy('tag_name');
                for (var i = 0, len = d2.length; i < len; i++) {
                    var obj = d2[i];
                    var cd = {
                        name: obj.key,
                        max: 100
                    };
                    var sum = this.getSum(obj.value, 'tag_count');
                    categoryData.push(cd);
                    countData.push(sum);
                }
            }
            return {
                categoryData: categoryData,
                countData: countData
            };
        }
    }, {
        key: "getMax",
        value: function getMax(arr) {
            if (arr.length) {
                var max = arr[0];
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i] > max) {
                        max = arr[i];
                    }
                }
                return max;
            }
        }
    }, {
        key: "getSum",
        value: function getSum(arr, feild) {
            var sum = 0;
            for (var i = 0, len = arr.length; i < len; i++) {
                var value = parseInt(arr[i][feild]);
                sum += value;
            }
            return sum;
        }
    }, {
        key: "updateMap",
        value: function updateMap(elementId, equipmentName) {
            echarts.dispose(document.getElementById(elementId));
            echarts.registerMap('china', this._chinajson);
            var myecharts = echarts.init(document.getElementById(elementId));
            var filterData = this._mapData.where(function (o) {
                return o.equipment === equipmentName;
            });
            var catedata = filterData.groupBy('location');
            var data = [];
            var geoCoordMap = {};
            for (var i = 0, len = catedata.length; i < len; i++) {
                data.push({
                    name: catedata[i].key,
                    value: this.getSum(catedata[i].value, 'loc_count')
                });
                geoCoordMap[catedata[i].key] = [parseFloat(catedata[i].value[0].longitude), parseFloat(catedata[i].value[0].latitude)];
            }

            var convertData = function convertData(data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
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
                    formatter: function formatter(params) {
                        return params.name + ' : ' + params.value[2];
                    }
                },
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
                    symbolSize: function symbolSize(val) {
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
                }, {
                    name: 'Top5',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: convertData(data.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 6)),
                    symbolSize: function symbolSize(val) {
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
                }]
            };
            myecharts.setOption(option);
        }
    }, {
        key: "updateLinkChart",
        value: function updateLinkChart(elementId, equipmentName, startTime, endTime) {
            echarts.dispose(document.getElementById(elementId));
            var myecharts = echarts.init(document.getElementById(elementId));
            myecharts.on('click', function (params) {
                if (this._chartClickCallback) {
                    this._chartClickCallback(params);
                }
            }.bind(this));
            var nodes = this.getNodes(startTime, endTime, equipmentName);
            var links = this.getLinks(startTime, endTime, equipmentName);
            var options = this.getChartOptions(this._categories, nodes, links, equipmentName);
            myecharts.setOption(options);
        }
    }, {
        key: "setChartClickCallback",
        value: function setChartClickCallback(callback) {
            this._chartClickCallback = callback;
        }
    }, {
        key: "getDocsByids",
        value: function getDocsByids(ids) {
            var filterdata = [];
            if (ids && ids.length) {
                filterdata = this._docData.where(function (o) {
                    return ids.indexOf(o.id) !== -1;
                });
            }
            return filterdata;
        }
    }, {
        key: "_callbackFunc",
        value: function _callbackFunc() {
            $('#loading').css('display', 'none');
        }
    }, {
        key: "getStartEndTime",
        value: function getStartEndTime(equipmentName) {
            var ts = this._timeData.where(function (o) {
                return o.selected_equipment === equipmentName;
            });
            if (ts.length) {
                return {
                    startTime: ts[0].min_time,
                    endTime: ts[0].max_time
                };
            }
        }
    }, {
        key: "getNodes",
        value: function getNodes(startTime, endTime, equipmentName) {
            var nodes = [];
            var select_nodes = this._nodesData.where(function (o) {
                return o.selected_equipment === equipmentName && o.create_time <= endTime && o.create_time >= startTime;
            });
            for (var i = 0, len = select_nodes.length; i < len; i++) {
                var n = select_nodes[i];
                var j = 0;
                var lenj = nodes.length;
                for (; j < lenj; j++) {
                    if (n.p_tag_name === nodes[j].name) {
                        nodes[j].value += 1;
                        break;
                    }
                }
                if (j === lenj) {
                    nodes.push({
                        symbol: n.p_tag_name === equipmentName ? 'roundRect' : 'circle',
                        category: Config.categories.indexOf(n.p_tag_type),
                        name: n.p_tag_name,
                        value: 1
                    });
                }
            }
            // console.log(nodes);
            return nodes;
        }
    }, {
        key: "getLinks",
        value: function getLinks(startTime, endTime, equipmentName) {
            var links = [];
            var select_links = this._linkData.where(function (o) {
                return o.selected_equipment === equipmentName && o.create_time <= endTime && o.create_time >= startTime;
            });
            for (var i = 0, len = select_links.length; i < len; i++) {
                var lnk = select_links[i];
                var j = 0;
                var lenj = links.length;
                for (; j < lenj; j++) {
                    var lnkj = links[j];
                    if (lnk.S_tag_name === lnkj.source && lnk.T_tag_name === lnkj.target && lnkj.docids.indexOf(lnk.doc_id) === -1) {
                        lnkj.docids.push(lnk.doc_id);
                        lnkj.value += 1;
                        break;
                    }
                }
                if (j === lenj) {
                    links.push({
                        source: lnk.S_tag_name,
                        target: lnk.T_tag_name,
                        value: 1,
                        docids: [lnk.doc_id]
                    });
                }
            }
            // console.log(links);
            return links;
        }
    }, {
        key: "getChartOptions",
        value: function getChartOptions(categories, nodes, links, equipmentName) {
            var options = {
                title: {
                    text: equipmentName,
                    left: 'left'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}'
                },
                toolbox: {
                    show: true,
                    feature: {
                        restore: { show: true },
                        magicType: { show: true, type: ['force', 'chord'] },
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    data: categories
                },
                series: [{
                    name: '装备',
                    type: 'graph',
                    layout: 'circular', //'force', 'circular'
                    categories: categories,
                    nodes: nodes,
                    links: links,
                    roam: true,
                    force: { //force -start
                        repulsion: 100,
                        edgeLength: [80, 400]
                    },
                    focusNodeAdjacency: false,
                    draggable: true, // forec-end               
                    symbolSize: 20,
                    itemStyle: {
                        normal: {},
                        emphasis: {}
                    },
                    lineStyle: {
                        normal: { color: "black",
                            width: 1 },
                        emphasis: { color: "black",
                            width: 1 }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'left'
                        },
                        emphasis: {
                            show: true
                        }
                    }
                }]
            };
            return options;
        }
    }]);

    return EqpGraph;
}();