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

    var Rect = ns.Rect;

    var View = ns.View;
    var Button = ns.Button;

    var Draggable = ns.Draggable;

    var Window = function (frame) {
        View.call(this);
        this.setClassName('TSWindow');
        var vc = this;

        // init title
        var title = new View();
        title.setClassName('TSWindowTitle');
        this.appendChild(title);
        this.titleView = title;

        // close button
        var close = new Button();
        close.setClassName('TSWindowClose');
        close.onClick = function (ev) {
            if (vc.onClose(ev)) {
                vc.remove();
            }
        };
        this.appendChild(close);

        // init frame
        if (arguments.length === 4) {
            frame = new Rect(arguments[0], arguments[1], arguments[2], arguments[3]);
        } else if (arguments.length === 2) {
            frame = new Rect(arguments[0], arguments[1]);
        } else if (!(frame instanceof Rect)) {
            frame = new Rect(frame);
        }
        this.setFrame(frame);

        Draggable.enable(this, [title]);
        this.__ie.onclick = function (ev) {
            vc.floatToTop();
        };
    };
    Window.prototype = Object.create(View.prototype);
    Window.prototype.constructor = Window;

    Window.prototype.setTitle = function (title) {
        this.titleView.setText(title);
        return this;
    };

    Window.prototype.onClose = function (ev) {
        return true;
    };

    //-------- namespace --------
    ns.Window = Window;

}(tarsier.ui);
