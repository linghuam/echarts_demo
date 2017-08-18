class TagRect {

    constructor(filename, elementId) {

        this._worldsData = null;
        this._echarts = echarts.init(document.getElementById(elementId));
        this.getData(filename).then(this._callbackFunc.bind(this));
    }

    async getData(filename) {
        this._worldsData = await Util.readFile(filename);
    }

    _callbackFunc() {
        var x = [],
            y = [];
        for(let i = 0, len = this._worldsData.length; i < len; i++) {
            x.push(this._worldsData[i].tag_name);
            y.push(parseInt(this._worldsData[i].tag_count));
        }

        //数据个数限制
        x = x.slice(0, 30);
        y = y.slice(0, 30);

        var option = {
            title: {
                text: '柱状图',
                left: 'left'
            },
            color:['#3398DB'],
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
                    rotate:80,
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

        this._echarts.setOption(option);
    }

}