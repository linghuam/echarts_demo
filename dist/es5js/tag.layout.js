'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagLayout = function () {
  function TagLayout(containerClass) {
    _classCallCheck(this, TagLayout);

    this._contanier = $('.' + containerClass);
    this._tagGraph = new TagGraph();
    this._tagSingle = new TagSingle('tag_single_container');
    this._initEvt();
  }

  _createClass(TagLayout, [{
    key: 'start',
    value: function start() {
      this._contanier.css('display', 'block');
      this._tagGraph.loadData();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._contanier.css('display', 'none');
    }
  }, {
    key: '_initEvt',
    value: function _initEvt() {
      var self = this;
      this._contanier.find('.tag_select').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        if ($(this).hasClass('tag_all')) {
          self._update('all');
        } else if ($(this).hasClass('tag_gz')) {
          self._update('gz');
        } else if ($(this).hasClass('tag_qj')) {
          self._update('qj');
        } else if ($(this).hasClass('tag_xw')) {
          self._update('xw');
        }
      });
    }
  }, {
    key: '_update',
    value: function _update(type) {
      this._tagGraph.updateWordCloud(type, 'tag_wordcloud');
      this._tagGraph.updatePie(type, 'tag_pie');
      this._tagGraph.updateBar(type, 'tag_bar');
      this._tagGraph.updateLine(type, 'tag_line');
      this._updateTable(type, 'tag_table');
    }
  }, {
    key: '_updateTable',
    value: function _updateTable(type, tableId) {
      var self = this;
      var data = this._tagGraph.getTableData(type);
      if (data && data.length) {
        $('#' + tableId).bootstrapTable('destroy');
        $('#' + tableId).bootstrapTable({
          columns: [{
            field: 'tag_name',
            title: '内容'
          }, {
            field: 'tag_count',
            title: '计数'
          }],
          onClickRow: function onClickRow(row, $element, field) {
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
  }]);

  return TagLayout;
}();