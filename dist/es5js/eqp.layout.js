"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EquipMentLayout = function () {
    function EquipMentLayout(containerClass) {
        _classCallCheck(this, EquipMentLayout);

        this._contanier = $('.' + containerClass);
        this._eqpGraph = new EqpGraph();
        this._months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    }

    _createClass(EquipMentLayout, [{
        key: "start",
        value: function start() {
            this._contanier.css('display', 'block');
            this._eqpGraph.loadData(this._loadDataCallback.bind(this));
        }
    }, {
        key: "stop",
        value: function stop() {
            this._contanier.css('display', 'none');
        }
    }, {
        key: "_loadDataCallback",
        value: function _loadDataCallback() {
            this._updateEqList('eqp_list_all_table');
        }
    }, {
        key: "_updateEqList",
        value: function _updateEqList(tableId) {
            var data = this._eqpGraph.getEqpListData();
            var self = this;
            if (data && data.length) {
                $('#' + tableId).bootstrapTable('destroy');
                $('#' + tableId).bootstrapTable({
                    columns: [{
                        field: 'equipment',
                        title: '装备列表'
                    }],
                    onClickRow: function (row, $element, field) {
                        $element.addClass('activeRow').siblings().removeClass('activeRow');
                        this._updateTimeSlider(row.equipment);
                        this._eqpGraph.updateRadar(['eqp_xw_chart', 'eqp_qj_chart', 'eqp_gz_chart'], row.equipment);
                        this._eqpGraph.updateMap('eqp_map_chart', row.equipment);
                        this._eqpGraph.setChartClickCallback(this._chartClickCallBack.bind(this));
                    }.bind(this),
                    data: data,
                    sortable: true,
                    height: 500
                });
            }
        }
    }, {
        key: "_updateTimeSlider",
        value: function _updateTimeSlider(eqpName) {
            var self = this;

            var _eqpGraph$getStartEnd = this._eqpGraph.getStartEndTime(eqpName),
                startTime = _eqpGraph$getStartEnd.startTime,
                endTime = _eqpGraph$getStartEnd.endTime;

            endTime = new Number(endTime) + 24 * 3600;
            // 时间轴
            if (this._dateSilderObj) {
                this._dateSilderObj.dateRangeSlider("destroy");
            }
            this._dateSilderObj = $('#eqp_timeslider').dateRangeSlider({
                arrows: false, //是否显示左右箭头
                bounds: { min: new Date(startTime * 1000), max: new Date(endTime * 1000) }, //最大 最少日期
                defaultValues: { min: new Date(startTime * 1000), max: new Date(endTime * 1000) }, //默认选中区域
                scales: [{
                    first: function first(value) {
                        return value;
                    },
                    end: function end(value) {
                        return value;
                    },
                    next: function next(val) {
                        var next = new Date(val);
                        return new Date(next.setMonth(next.getMonth() + 1));
                    },
                    label: function label(val) {
                        return self._months[val.getMonth()];
                    },
                    format: function format(tickContainer, tickStart, tickEnd) {
                        tickContainer.addClass("myCustomClass");
                    }
                }]
            });

            //拖动完毕后的事件
            this._dateSilderObj.bind("valuesChanged", function (e, data) {
                var val = data.values;
                var stime = val.min.getFullYear() + "-" + (val.min.getMonth() + 1) + "-" + val.min.getDate();
                var etime = val.max.getFullYear() + "-" + (val.max.getMonth() + 1) + "-" + val.max.getDate();
                self._eqpGraph.updateLinkChart('eqp_relation_chart', eqpName, Util.getCusUnixTime(stime + ' 00:00:00'), Util.getCusUnixTime(etime + ' 00:00:00'));
                // console.log("起止时间：" + stime + " 至 " + etime);
            });

            self._eqpGraph.updateLinkChart('eqp_relation_chart', eqpName, startTime, endTime);
        }
    }, {
        key: "_updateLinkDocTable",
        value: function _updateLinkDocTable(tableId, data) {
            var self = this;
            if (data && data.length) {
                $('#' + tableId).bootstrapTable('destroy');
                $('#' + tableId).bootstrapTable({
                    columns: [{
                        field: 'id',
                        title: '序号'
                    }, {
                        field: 'title',
                        title: '标题'
                    }, {
                        field: 'create_time',
                        title: '时间'
                    }],
                    onClickRow: function onClickRow(row, $element, field) {
                        var docdata = self._eqpGraph.getDocDetailById(row.id);
                        window.dialogPopover.alert('文章详情', self.getDocContent(docdata));
                    },
                    data: data,
                    sortable: true,
                    height: 500
                });
            }
        }
    }, {
        key: "_chartClickCallBack",
        value: function _chartClickCallBack(param) {
            var docData = this._eqpGraph.getDocsByids(param.data.docids);
            this._updateLinkDocTable('eqp_doc_table', docData);
        }
    }, {
        key: "getDocContent",
        value: function getDocContent(data) {
            var html = [];
            html.push('<table>');
            for (var i = 0, len = data.length; i < len; i++) {
                html.push('<tr>');
                html.push('<td width="20%">标题</td>');
                html.push('<td width="80%">' + data[i].title + '</td>');
                html.push('</tr>');

                html.push('<tr>');
                html.push('<td>原因</td>');
                html.push('<td>' + data[i].reason + '</td>');
                html.push('</tr>');

                html.push('<tr>');
                html.push('<td>说明</td>');
                html.push('<td>' + data[i].description + '</td>');
                html.push('</tr>');

                html.push('<tr>');
                html.push('<td>时间</td>');
                html.push('<td>' + data[i].create_time + '</td>');
                html.push('</tr>');

                html.push('<tr>');
                html.push('<td>装备</td>');
                html.push('<td>' + data[i].equipment + '</td>');
                html.push('</tr>');

                html.push('<tr>');
                html.push('<td>地点</td>');
                html.push('<td>' + data[i].location + '</td>');
                html.push('</tr>');

                html.push('<tr>');
                html.push('<td>故障标签</td>');
                html.push('<td>' + data[i].gz_tag + '</td>');
                html.push('</tr>');

                html.push('<tr>');
                html.push('<td>器件标签</td>');
                html.push('<td>' + data[i].qj_tag + '</td>');
                html.push('</tr>');

                html.push('<tr>');
                html.push('<td>行为标签</td>');
                html.push('<td>' + data[i].xw_tag + '</td>');
                html.push('</tr>');
            }
            html.push('</table>');
            return html.join('');
        }
    }]);

    return EquipMentLayout;
}();