"use strict";

var _bluebird = require("bluebird");

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagSingleGraph = function () {
    function TagSingleGraph(elementId) {
        _classCallCheck(this, TagSingleGraph);

        this._echarts = echarts.init(document.getElementById(elementId));
        this._echarts.on('click', this._clickEvt.bind(this));

        this._chartOptions = {};

        this._selectTagName = null;
        this._categories = [{ name: "操作" }, { name: "器件" }, { name: "故障" }];

        this._nodesData = null;
        this._linkData = null;
        this._docData = null;
        this._tagDocData = null;
        this._timeData = null;
    }

    _createClass(TagSingleGraph, [{
        key: "getData",
        value: function () {
            var _ref = (0, _bluebird.coroutine)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return Util.readFile('data/标签关联点-时间戳.csv');

                            case 2:
                                this._nodesData = _context.sent;
                                _context.next = 5;
                                return Util.readFile('data/标签关联边-时间戳-无向.csv');

                            case 5:
                                this._linkData = _context.sent;
                                _context.next = 8;
                                return Util.readFile('data/标签关联文章列表.csv');

                            case 8:
                                this._tagDocData = _context.sent;
                                _context.next = 11;
                                return Util.readFile('data/文章列表.csv');

                            case 11:
                                this._docData = _context.sent;
                                _context.next = 14;
                                return Util.readFile('data/标签关联最大值最小值-时间戳.csv');

                            case 14:
                                this._timeData = _context.sent;

                            case 15:
                            case "end":
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
        key: "loadData",
        value: function loadData(callback, selectTagName) {
            var self = this;
            this._selectTagName = selectTagName;
            if (!this._nodesData || !this._linkData || !this._tagDocData || !this._docData || !this._timeData) {
                $('#loading').css('display', 'block');
                this.getData().then(function () {
                    self._callbackFunc();
                    callback();
                });
            } else {
                callback();
            }
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
        key: "getTableData",
        value: function getTableData() {
            var _this = this;

            var tagdoc = this._tagDocData.where(function (o) {
                return o.tag_name === _this._selectTagName;
            });
            return tagdoc;
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

            var _getStartEndTime = this.getStartEndTime(),
                startTime = _getStartEndTime.startTime,
                endTime = _getStartEndTime.endTime;

            this._startTime = startTime;
            this._endTime = endTime;
        }
    }, {
        key: "getStartTime",
        value: function getStartTime() {
            return this._startTime;
        }
    }, {
        key: "getEndTime",
        value: function getEndTime() {
            return this._endTime;
        }
    }, {
        key: "updateGraph",
        value: function updateGraph(startTime, endTime) {
            var nodes = this.getNodes(startTime, endTime);
            var links = this.getLinks(startTime, endTime);
            var options = this.getChartOptions(this._categories, nodes, links);
            this._echarts.setOption(options);
        }
    }, {
        key: "getStartEndTime",
        value: function getStartEndTime() {
            var _this2 = this;

            var ts = this._timeData.where(function (o) {
                return o.selected_tag_name === _this2._selectTagName;
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
        value: function getNodes(startTime, endTime) {
            var _this3 = this;

            var nodes = [];
            var select_nodes = this._nodesData.where(function (o) {
                return o.selected_tag_name === _this3._selectTagName && o.create_time <= endTime && o.create_time >= startTime;
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
                        symbol: n.p_tag_name === this._selectTagName ? 'roundRect' : 'circle',
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
        value: function getLinks(startTime, endTime) {
            var _this4 = this;

            var links = [];
            var select_links = this._linkData.where(function (o) {
                return o.selected_tag_name === _this4._selectTagName && o.create_time <= endTime && o.create_time >= startTime;
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
        value: function getChartOptions(categories, nodes, links) {
            var options = {
                title: {
                    text: this._selectTagName
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
                    name: '单标签',
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
    }, {
        key: "addChartClickCallback",
        value: function addChartClickCallback(callback) {
            this._chartClickCallback = callback;
        }
    }, {
        key: "_clickEvt",
        value: function _clickEvt(param) {
            if (this._chartClickCallback) {
                this._chartClickCallback(param);
            }
            // console.log(param.data);
        }
    }]);

    return TagSingleGraph;
}();