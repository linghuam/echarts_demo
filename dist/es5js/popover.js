'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dialog = function () {
    function Dialog() {
        _classCallCheck(this, Dialog);

        this._container = $('<div></div>');
        $('body').append(this._container);
        this._container.html(this._getbody());
    }

    _createClass(Dialog, [{
        key: '_getbody',
        value: function _getbody() {
            return '<div class="modal fade" id="modal-dialog">' + '<div class="modal-dialog modal-lg">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + '<h5 class="modal-title" id="modal-title">标题</h5>' + '</div>' + '<div class="modal-body">' + '<div id="modal-text">内容</div>' + '</div>' + '<div class="modal-footer" style="display:none;">' + '<button type="button" class="btn btn-primary common_btn_ok" id="modal-todo">确认</button>' + '<button type="button" class="btn btn-primary common_btn_cancel" data-dismiss="modal" id="modal-close">取消</button>' + '</div></div></div></div>';
        }

        /**
         *信息框 只弹出信息，不显示图片
         *@method alert
         *@param title {String} 提示框标题
         *@param text {String} 提示框显示内容
         */

    }, {
        key: 'alert',
        value: function alert(title, text) {
            this._setClose(false);
            this._setDialog(title, text);
            this._show();
            $("#modal-todo").unbind();
            $("#modal-todo").bind("click", this, function (event) {
                event.data._close();
            });
        }

        /**
         *关闭提示框
         *@method _close
         *@private
         */

    }, {
        key: '_close',
        value: function _close() {
            $('#modal-dialog').modal('hide');
        }

        /**
         *显示提示框
         *@method _show
         *@private
         */

    }, {
        key: '_show',
        value: function _show() {
            $('#modal-dialog').modal("show");
        }

        /**
         *设置提示框显示
         *@method _setDialog
         *@private
         */

    }, {
        key: '_setDialog',
        value: function _setDialog(title, text) {
            $('#modal-title').html(title);
            $('#modal-text').html(text);
        }

        /**
         *设置关闭按钮显示
         *@method _setClose
         *@private
         */

    }, {
        key: '_setClose',
        value: function _setClose(visible) {
            if (visible == true) {
                $('#modal-close').css('display', '');
            } else {
                $('#modal-close').css('display', 'none');
            }
        }
    }]);

    return Dialog;
}();