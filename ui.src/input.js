;
// license: https://mit-license.org
// =============================================================================
// The MIT License (MIT)
//
// Copyright (c) 2020 Albert Moky
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// =============================================================================
//

!function (ns) {
    'use strict';

    var $ = ns.$;

    var View = ns.View;

    var Input = function (input) {
        if (!input) {
            input = document.createElement('INPUT');
        }
        View.call(this, input);
    };
    Input.prototype = Object.create(View.prototype);
    Input.prototype.constructor = Input;

    Input.prototype.getValue = function () {
        return this.__ie.value;
    };
    Input.prototype.setValue = function (text) {
        this.__ie.value = text;
        return this;
    };

    //
    //  DataList
    //
    Input.prototype.getDatalist = function () {
        var dataList = this.__ie.list;
        if (typeof dataList === 'string') {
            return $(document.getElementById(dataList));
        }
        if (dataList instanceof HTMLDataListElement) {
            return $(dataList);
        }
        return null;
    };
    Input.prototype.setDataList = function (options) {
        var dataList = this.getDatalist();
        if (!dataList) {
            // create datalist with random id
            var id = '' + Math.random();
            id = 'ts_datalist_' + id.substring(2);
            dataList = new ns.DataList();
            dataList.setId(id);
            this.appendChild(dataList);
            this.__ie.setAttribute('list', id);
        }
        dataList.setOptions(options);
        return this;
    };

    //-------- namespace --------
    ns.Input = Input;

}(tarsier.ui);

!function (ns) {
    'use strict';

    var View = ns.View;

    var Option = function (option) {
        if (!option) {
            option = document.createElement('OPTION');
        }
        View.call(this, option);
    };
    Option.prototype = Object.create(View.prototype);
    Option.prototype.constructor = Option;

    var DataList = function (dataList) {
        if (!dataList) {
            dataList = document.createElement('DATALIST');
        }
        View.call(this, dataList);
    };
    DataList.prototype = Object.create(View.prototype);
    DataList.prototype.constructor = DataList;

    DataList.prototype.setOptions = function (options) {
        this.removeChildren();
        var opt, value;
        for (var i = 0; i < options.length; ++i) {
            opt = options[i];
            if (typeof opt === 'string') {
                value = opt;
                opt = new Option();
                opt.setText(value);
                this.appendChild(opt);
            }
        }
        return this;
    };

    //-------- namespace --------
    ns.DataList = DataList;
    ns.Option = Option;

}(tarsier.ui);
