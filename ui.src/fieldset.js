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

    var View = ns.View;

    var Legend = function (legend) {
        if (!legend) {
            legend = document.createElement('LEGEND');
        }
        View.call(this, legend);
    };
    Legend.prototype = Object.create(View.prototype);
    Legend.prototype.constructor = Legend;

    var get_legend = function () {
        var children = this.getChildren();
        var node;
        for (var i = 0; i < children.length; ++i) {
            node = children[i];
            if (node instanceof Legend) {
                return node;
            }
        }
        return null;
    };

    var FieldSet = function (fieldset) {
        if (!fieldset) {
            fieldset = document.createElement('FIELDSET');
        }
        View.call(this, fieldset);
    };
    FieldSet.prototype = Object.create(View.prototype);
    FieldSet.prototype.constructor = FieldSet;

    FieldSet.prototype.getCaption = function () {
        var legend = get_legend.call(this);
        if (legend) {
            return legend.getText();
        }
        return null;
    };
    FieldSet.prototype.setCaption = function (text) {
        var legend = get_legend.call(this);
        if (!legend) {
            legend = new Legend();
            var first = this.firstChild();
            if (first) {
                this.insertBefore(legend, first);
            } else {
                this.appendChild(legend);
            }
        }
        legend.setText(text);
    };

    //-------- namespace --------
    ns.FieldSet = FieldSet;

}(tarsier.ui);
