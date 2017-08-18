class EqpGraph {

    constructor() {

        this._eqpListData = null;
        this._nodesData = null;
        this._linkData = null;
        this._tagDocData = null;
        this._docData = null;
        this._timeData = null;
        this._radarData = null;
        this._mapData = null;
        this._chinajson = null;

        this._categories = [
            { name: "行为" },
            { name: "器件" },
            { name: "故障" },
            { name: "装备" }
        ];
        this.categories = {
            all: '全部',
            qj: '器件',
            gz: '故障',
            xw: '行为'
        };
    }

    async getData() {
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
    
    getDocDetailById (id) {
        var data = this._docData.where(o => o.id === id);
        return data;
    }

    loadData(callback) {
        var self = this;
        if(!this._eqpListData || !this._nodesData || !this._linkData || !this._tagDocData || !this._docData || !this._timeData || !this._radarData || !this._mapData || !this._chinajson) {
            $('#loading').css('display', 'block');
            this.getData().then(function () {
                self._callbackFunc();
                if(callback) callback();
            });
        } else {
            callback();
        }
    }

    getEqpListData() {
        return this._eqpListData;
    }

    updateRadar(elementIds, equipmentName) {
        this._xwData = this._radarData.where(o => o.equipment === equipmentName && o.tag_type === this.categories.xw);
        this._qjData = this._radarData.where(o => o.equipment === equipmentName && o.tag_type === this.categories.qj);
        this._gzData = this._radarData.where(o => o.equipment === equipmentName && o.tag_type === this.categories.gz);

        this._updateRadar(elementIds[0], this.categories.xw);
        this._updateRadar(elementIds[1], this.categories.qj);
        this._updateRadar(elementIds[2], this.categories.gz);
    }

    _updateRadar(elementId, category) {
        echarts.dispose(document.getElementById(elementId));
        var myecharts = echarts.init(document.getElementById(elementId));
        if(category === this.categories.xw) {
            var { categoryData, countData } = this._getRadarOptData(this._xwData);
        } else if(category === this.categories.qj) {
            var { categoryData, countData } = this._getRadarOptData(this._qjData);
        } else if(category === this.categories.gz) {
            var { categoryData, countData } = this._getRadarOptData(this._gzData);
        }
        if(categoryData.length && countData.length) {
            var max = this.getMax(countData);
            if(max) {
                categoryData = categoryData.map(function (d) {
                    d.max = max;
                    return d;
                });
            }
            var option = {
                title: {
                    text: category,
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
                        name: '行为'
                    }]
                }]
            };

            myecharts.setOption(option);
        }
    }

    _getRadarOptData(data) {
        var categoryData = [];
        var countData = [];
        if(data.length) {
            var d2 = data.groupBy('tag_name');
            for(let i = 0, len = d2.length; i < len; i++) {
                let obj = d2[i];
                let cd = {
                    name: obj.key,
                    max: 100
                };
                let sum = this.getSum(obj.value, 'tag_count');
                categoryData.push(cd);
                countData.push(sum);
            }
        }
        return {
            categoryData,
            countData
        };
    }

    getMax(arr) {
        if(arr.length) {
            var max = arr[0];
            for(let i = 0, len = arr.length; i < len; i++) {
                if(arr[i] > max) {
                    max = arr[i];
                }
            }
            return max;
        }
    }

    getSum(arr, feild) {
        var sum = 0;
        for(let i = 0, len = arr.length; i < len; i++) {
            let value = parseInt(arr[i][feild]);
            sum += value;
        }
        return sum;
    }

    updateMap(elementId, equipmentName) {
        echarts.dispose(document.getElementById(elementId));
        echarts.registerMap('china', this._chinajson);
        var myecharts = echarts.init(document.getElementById(elementId));
        var filterData = this._mapData.where(o => o.equipment === equipmentName);
        var catedata = filterData.groupBy('location');
        var data = [];
        var geoCoordMap = {};
        for(let i = 0, len = catedata.length; i < len; i++) {
            data.push({
                name: catedata[i].key,
                value: this.getSum(catedata[i].value, 'loc_count')
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
        myecharts.setOption(option);
    }

    updateLinkChart(elementId, equipmentName, startTime, endTime) {
        echarts.dispose(document.getElementById(elementId));
        var myecharts = echarts.init(document.getElementById(elementId));
        myecharts.on('click', function (params) {
            if(this._chartClickCallback) {
                this._chartClickCallback(params);
            }
        }.bind(this));
        var nodes = this.getNodes(startTime, endTime, equipmentName);
        var links = this.getLinks(startTime, endTime, equipmentName);
        var options = this.getChartOptions(this._categories, nodes, links);
        myecharts.setOption(options);

    }

    setChartClickCallback(callback) {
        this._chartClickCallback = callback;
    }

    getDocsByids(ids) {
        var filterdata = [];
        if(ids && ids.length) {
            filterdata = this._docData.where(function (o) {
                return ids.indexOf(o.id) !== -1;
            });
        }
        return filterdata;

    }

    _callbackFunc() {
        $('#loading').css('display', 'none');
    }

    getStartEndTime(equipmentName) {
        var ts = this._timeData.where(o => o.selected_equipment === equipmentName);
        if(ts.length) {
            return {
                startTime: ts[0].min_time,
                endTime: ts[0].max_time
            }
        }
    }

    getNodes(startTime, endTime, equipmentName) {
        var nodes = [];
        var select_nodes = this._nodesData.where(o => o.selected_equipment === equipmentName && o.create_time <= endTime && o.create_time >= startTime);
        for(let i = 0, len = select_nodes.length; i < len; i++) {
            let n = select_nodes[i];
            let j = 0;
            let lenj = nodes.length;
            for(; j < lenj; j++) {
                if(n.p_tag_name === nodes[j].name) {
                    nodes[j].value += 1;
                    break;
                }
            }
            if(j === lenj) {
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

    getLinks(startTime, endTime, equipmentName) {
        var links = [];
        var select_links = this._linkData.where(o => o.selected_equipment === equipmentName && o.create_time <= endTime && o.create_time >= startTime);
        for(let i = 0, len = select_links.length; i < len; i++) {
            let lnk = select_links[i];
            let j = 0;
            let lenj = links.length;
            for(; j < lenj; j++) {
                let lnkj = links[j];
                if(lnk.S_tag_name === lnkj.source && lnk.T_tag_name === lnkj.target && lnkj.docids.indexOf(lnk.doc_id) === -1) {
                    lnkj.docids.push(lnk.doc_id);
                    lnkj.value += 1;
                    break;
                }
            }
            if(j === lenj) {
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

    getChartOptions(categories, nodes, links) {
        var options = {
            title: {
                text: '装备'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} : {b}'
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
                layout: 'force', //'force', 'circular'
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
                symbolSize: 40,
                itemStyle: {
                    normal: {},
                    emphasis: {}
                },
                label: {
                    normal: {
                        show: true,
                        position: 'insideLeft'
                    },
                    emphasis: {
                        show: true
                    }
                }
            }]
        };
        return options;
    }

}