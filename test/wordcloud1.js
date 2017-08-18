class WordCloud1 {

  constructor(filename, elementId) {

    this._worldsData = null;
    this._echarts = echarts.init(document.getElementById(elementId));
    this.getData(filename).then(this._callbackFunc.bind(this));
  }

  async getData(filename) {
    this._worldsData = await Util.readFile(filename);
  }

  _callbackFunc() {
    var words = [];
    for(let i = 0, len = this._worldsData.length; i < len; i++) {
      words.push({
        name: this._worldsData[i].tag_name,
        value: parseInt(this._worldsData[i].tag_count)
      });
    }

    var option = {
      tooltip: {},
      series: [{
        type: 'wordCloud',
        gridSize: 2,
        sizeRange: [12, 50],
        rotationRange: [-90, 90],
        shape: 'pentagon',
        width: 600,
        height: 400,
        drawOutOfBound: true,
        textStyle: {
          normal: {
            color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            }
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        data: words
      }]
    };

    this._echarts.setOption(option);

    window.onresize = this._echarts.resize;
  }

}