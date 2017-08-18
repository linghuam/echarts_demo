class TagLine {

    constructor(filename, elementId, lineType) {

        this._allData = null;
        this._lineType = lineType;
        this._echarts = echarts.init(document.getElementById(elementId));
        this.getData(filename).then(this._callbackFunc.bind(this));
    }

    async getData(filename) {
        this._allData = await Util.readFile(filename);
    }

    _callbackFunc() {
        var filterData = this._allData.where(o => o.line_type === this._lineType);
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
                text: this._lineType,
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
        this._echarts.setOption(option);
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

}