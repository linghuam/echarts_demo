class GraphAnalysis {

    constructor(elementId, selectTagName) {
        this._echarts = echarts.init(document.getElementById(elementId));
        this._echarts.on('click', this._clickEvt.bind(this));

        this._chartOptions = {};

        this._selectTagName = selectTagName;
        this._categories = [
            { name: "行为" },
            { name: "器件" },
            { name: "故障" }
        ];

        this._nodesData = null;
        this._linkData = null;
        this._docData = null;
        this._tagDocData = null;
        this._timeData = null;

        this.getData().then(this._callbackFunc.bind(this));
    }

    async getData() {
        this._nodesData = await Util.readFile('data/标签关联点-时间戳.csv');
        this._linkData = await Util.readFile('data/标签关联边-时间戳-无向.csv');
        this._tagDocData = await Util.readFile('data/标签关联文章列表.csv');
        this._docData = await Util.readFile('data/文章列表.csv');
        this._timeData = await Util.readFile('data/标签关联最大值最小值-时间戳.csv');
    }

    _callbackFunc() {
        let {startTime, endTime } = this.getStartEndTime();
        this._startTime = startTime;
        this._endTime = endTime;
        this.update(startTime, endTime);
    }

    update(startTime, endTime) {
        var nodes = this.getNodes(startTime, endTime);
        var links = this.getLinks(startTime, endTime);
        var options = this.getChartOptions(this._categories, nodes, links);
        this._echarts.setOption(options);
    }

    getStartEndTime () {
        var ts = this._timeData.where(o => o.selected_tag_name === this._selectTagName);
        if (ts.length) {
            return {
                startTime: ts[0].min_time,
                endTime: ts[0].max_time
            }
        }
    }

    getNodes(startTime, endTime) {
        var nodes = [];
        var select_nodes = this._nodesData.where(o => o.selected_tag_name === this._selectTagName && o.create_time <= endTime && o.create_time >= startTime);
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
                    symbol: n.p_tag_name === this._selectTagName ? 'roundRect' : 'circle',
                    category: Config.categories.indexOf(n.p_tag_type),
                    name: n.p_tag_name,
                    value: 1
                });
            }
        }
        console.log(nodes);
        return nodes;
    }

    getLinks(startTime, endTime) {
        var links = [];
        var select_links = this._linkData.where(o => o.selected_tag_name === this._selectTagName && o.create_time <= endTime && o.create_time >= startTime);
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
        console.log(links);
        return links;
    }

    getChartOptions(categories, nodes, links) {
        var options = {
            title: {
                text: '单标签'
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
                name: '单标签',
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
                focusNodeAdjacency: true,
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

    _clickEvt(param) {
        console.log(param.data);
    }
}