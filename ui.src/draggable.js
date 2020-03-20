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
    var Point = ns.Point;

    var touch_point = function (ev) {
        if (ev.touches) {
            var touch = ev.touches[0];
            return new Point(touch.clientX, touch.clientY);
        } else {
            return new Point(ev.clientX, ev.clientY);
        }
    };

    var enable = function (div) {
        div.draggable = true;
        div.__dp = null;

        var drag_start = function (ev) {
            var point = touch_point(ev);
            point.x -= div.offsetLeft;
            point.y -= div.offsetTop;
            div.__dp = point;
            $(div).floatToTop();
            return true
        };
        var drag_move = function (ev) {
            ev.preventDefault();
            var delta = div.__dp;
            if (delta) {
                var point = touch_point(ev);
                point.x -= delta.x;
                point.y -= delta.y;
                $(div).setOrigin(point);
            }
        };
        var drag_end = function (ev) {
            ev.preventDefault();
            div.__dp = null;
        };

        div.ondragstart = drag_start;
        div.ondrag = div.ondragover = drag_move;
        div.ondragend = drag_end;
        // iPad
        div.addEventListener('touchstart', drag_start);
        div.addEventListener('touchmove', drag_move);
        div.addEventListener('touchend', drag_end);
    };

    var disable = function (div) {
        div.draggable = false;
    };

    //-------- namespace --------

    ns.Draggable = {
        enable: enable,
        disable: disable
    };

}(tarsier.ui);
