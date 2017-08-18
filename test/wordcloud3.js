class WordCloud3 {

  constructor(filename, elementId) {

    this._worldsData = null;
    this._elementId = elementId;
    this.getData(filename).then(this._callbackFunc.bind(this));
  }

  async getData(filename) {
    this._worldsData = await Util.readFile(filename);
  }

  _callbackFunc() {
    var list = [];
    for(let i = 0, len = this._worldsData.length; i < len; i++) {
      list.push([this._worldsData[i].tag_name, parseInt(this._worldsData[i].tag_count)]);
    }
    var option = {
      tooltip: {
        show: true,
        formatter: function (item) {
          return item[0];
        }
      },
      list: list,
      shape: 'circle',
      ellipticity: 1
    };
    var wc = new Js2WordCloud(document.getElementById(this._elementId));
    wc.setOption(option);
  }

}