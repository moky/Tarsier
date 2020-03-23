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

    var ScrollView = function (div) {
        View.call(this, div);
        this.setScroll(true);
    };
    ScrollView.prototype = Object.create(View.prototype);
    ScrollView.prototype.constructor = ScrollView;

    //
    //  patch View for scroll
    //
    View.prototype.setScroll = function (overflow) {
        this.setScrollX(overflow);
        this.setScrollY(overflow);
    };
    View.prototype.setScrollX = function (overflow) {
        if (overflow) {
            if (typeof overflow !== 'string') {
                overflow = 'auto';
            }
        } else {
            overflow = 'none';
        }
        this.__ie.style.overflowX = overflow;
    };
    View.prototype.setScrollY = function (overflow) {
        if (overflow) {
            if (typeof overflow !== 'string') {
                overflow = 'auto';
            }
        } else {
            overflow = 'none';
        }
        this.__ie.style.overflowY = overflow;
    };

    View.prototype.scrollToBottom = function () {
        this.__ie.scrollTop = this.__ie.scrollHeight;
    };

    //-------- namespace --------
    ns.ScrollView = ScrollView;

}(tarsier.ui);