class TagLayout {

  constructor(containerClass) {
    this._contanier = $('.' + containerClass);
    this._tagGraph = new TagGraph();
    this._tagSingle = new TagSingle('tag_single_container');
    this._initEvt();
  }

  start() {
    this._contanier.css('display', 'block');
    this._tagGraph.loadData();
  }

  stop() {
    this._contanier.css('display', 'none');
  }

  _initEvt() {
    var self = this;
    this._contanier.find('.tag_select').on('click', function () {
      $(this).addClass('active').siblings().removeClass('active');
      if($(this).hasClass('tag_all')) {
        self._update('all');

      } else if($(this).hasClass('tag_gz')) {
        self._update('gz');

      } else if($(this).hasClass('tag_qj')) {
        self._update('qj');

      } else if($(this).hasClass('tag_xw')) {
        self._update('xw');

      }
    });
  }

  _update(type) {
    this._tagGraph.updateWordCloud(type, 'tag_wordcloud');
    this._tagGraph.updatePie(type, 'tag_pie');
    this._tagGraph.updateBar(type, 'tag_bar');
    this._tagGraph.updateLine(type, 'tag_line');
    this._updateTable(type, 'tag_table');
  }

  _updateTable(type, tableId) {
    var self = this;
    var data = this._tagGraph.getTableData(type);
    if(data && data.length) {
      $('#' + tableId).bootstrapTable('destroy');
      $('#' + tableId).bootstrapTable({
        columns: [{
          field: 'tag_name',
          title: '标签'
        }, {
          field: 'tag_count',
          title: '计数项'
        }],
        onClickRow: function (row, $element, field) {
          self._contanier.css('display', 'none');
          self._tagSingle.start(row.tag_name);
          // console.log(row);
        },
        data: data,
        sortable: true,
        height: 400
      });
    }
  }

}