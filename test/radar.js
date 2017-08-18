class RadarGraph {

    constructor(filename, elementIds, equipmentName) {

        this._eqname = equipmentName;
        this.categories = ["行为", "器件", "故障"];
        this._elementids = elementIds;
        this._allData = [];
        this._xwData = [];
        this._qjData = [];
        this._gzData = [];
        this.getData(filename).then(this._callbackFunc.bind(this));
    }

    async getData(filename) {
        this._allData = await Util.readFile(filename);
    }

    _update(elementId, category) {
        this._echarts = echarts.init(document.getElementById(elementId));
        if(category === this.categories[0]) { var { categoryData, countData } = this.getOptData(this._xwData);
        } else if(category === this.categories[1]) { var { categoryData, countData } = this.getOptData(this._qjData);
        } else if(category === this.categories[2]) { var { categoryData, countData } = this.getOptData(this._gzData);
        }
        if(categoryData && countData) {
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
                    left: 'center'
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

            this._echarts.setOption(option);
        }
    }

    _callbackFunc() {

        this._xwData = this._allData.where(o => o.equipment === this._eqname && o.tag_type === this.categories[0]);
        this._qjData = this._allData.where(o => o.equipment === this._eqname && o.tag_type === this.categories[1]);
        this._gzData = this._allData.where(o => o.equipment === this._eqname && o.tag_type === this.categories[2]);

        this._update(this._elementids[0], this.categories[0]);
        this._update(this._elementids[1], this.categories[1]);
        this._update(this._elementids[2], this.categories[2]);

    }

    getOptData(data) {
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
                let sum = this.getSum(obj.value);
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

    getSum(arr) {
        var sum = 0;
        for(let i = 0, len = arr.length; i < len; i++) {
            let value = parseInt(arr[i].tag_count);
            sum += value;
        }
        return sum;
    }

}