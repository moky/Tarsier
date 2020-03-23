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

    var cancel_bubble = function (ev) {
        ev.cancelBubble = true;
        ev.stopPropagation();
        ev.preventDefault();
    };

    var start = function (point, controller) {
        var div = controller.__ie;
        point.x -= div.offsetLeft;
        point.y -= div.offsetTop;
        controller.__dp = point;
        // onfocus
        controller.floatToTop();
    };
    var move = function (ev, point, controller) {
        if (!controller.__dp) {
            return ;
        }
        point.x -= controller.__dp.x;
        point.y -= controller.__dp.y;
        controller.setOrigin(point);
        cancel_bubble(ev);
    };
    var end = function (ev, controller) {
        if (!controller.__dp) {
            return ;
        }
        cancel_bubble(ev);
        controller.__dp = null;
    };

    var enable = function (controller, dragAreas) {
        controller = $(controller);
        controller.__dp = null;

        var drag_start = function (ev) {
            start(new Point(ev.clientX, ev.clientY), controller);
            return true;
        };
        var drag_move = function (ev) {
            move(ev, new Point(ev.clientX, ev.clientY), controller);
        };
        var drag_end = function (ev) {
            end(ev, controller);
        };

        var touch_start = function (ev) {
            var touch = ev.touches[0];
            start(new Point(touch.clientX, touch.clientY), controller);
            return true;
        };
        var touch_move = function (ev) {
            var touch = ev.touches[0];
            move(ev, new Point(touch.clientX, touch.clientY), controller);
        };
        var touch_end = function (ev) {
            end(ev, controller);
        };

        var div;
        for (var i = 0; i < dragAreas.length; ++i) {
            div = $(dragAreas[i]).__ie;
            div.draggable = true;

            // PC
            div.ondragstart = drag_start;
            div.ondrag = div.ondragover = drag_move;
            div.ondragend = drag_end;
            // iPad, ...
            div.ontouchstart = touch_start;
            div.ontouchmove = touch_move;
            div.ontouchend = touch_end;
            div.addEventListener('touchstart', touch_start, false);
            div.addEventListener('touchmove', touch_move, false);
            div.addEventListener('touchend', touch_end, false);
        }
    };

    var disable = function (controller, dragAreas) {
        controller = $(controller);
        delete controller.__dp;

        var div;
        for (var i = 0; i < dragAreas.length; ++i) {
            div = $(dragAreas[i]).__ie;
            // PC
            div.ondragstart = null;
            div.ondrag = div.ondragover = null;
            div.ondragend = null;
            // iPad
            div.removeEventListener('touchstart', div.ontouchstart, false);
            div.removeEventListener('touchmove', div.ontouchmove, false);
            div.removeEventListener('touchend', div.ontouchend, false);
            div.ontouchstart = null;
            div.ontouchmove = null;
            div.ontouchend = null;
        }
    };

    //-------- namespace --------

    ns.Draggable = {
        enable: enable,
        disable: disable
    };

}(tarsier.ui);
