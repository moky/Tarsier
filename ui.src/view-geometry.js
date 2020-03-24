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

    var Point = ns.Point;
    var Size = ns.Size;
    var Rect = ns.Rect;
    var Edges = ns.Edges;

    var View = ns.View;

    var parse_int = function (value, defaultValue) {
        if (value) {
            var i = parseInt(value);
            if (typeof i === 'number') {
                return i;
            }
        }
        return defaultValue;
    };

    //
    //  Coordinate System
    //
    View.prototype.getX = function () {
        return parse_int(this.__ie.style.left, this.__ie.offsetLeft);
    };
    View.prototype.getY = function () {
        return parse_int(this.__ie.style.top, this.__ie.offsetTop);
    };
    View.prototype.getZ = function () {
        return parse_int(this.__ie.style.zIndex, 0);
    };

    View.prototype.setX = function (left) {
        this.__ie.style.position = 'absolute';
        this.__ie.style.left = left + 'px';
        this.__ie.offsetLeft = this.__frame.origin.x = left;
        return this;
    };
    View.prototype.setY = function (top) {
        this.__ie.style.position = 'absolute';
        this.__ie.style.top = top + 'px';
        this.__ie.offsetTop = this.__frame.origin.y = top;
        return this;
    };
    View.prototype.setZ = function (zIndex) {
        this.__ie.style.zIndex = zIndex;
        return this;
    };

    //
    //  Size
    //
    View.prototype.getWidth = function () {
        return parse_int(this.__ie.style.width, this.__ie.offsetWidth);
    };
    View.prototype.getHeight = function () {
        return parse_int(this.__ie.style.height, this.__ie.offsetHeight);
    };

    View.prototype.setWidth = function (width) {
        this.__ie.style.width = width + 'px';
        this.__ie.offsetWidth = this.__frame.size.width = width;
        // update bounds
        this.__bounds.size.width = width - this.__bounds.origin.x - this.getPaddingRight();
        // layout subviews while bounds changed
        this.needsLayoutSubviews = true;
        return this;
    };
    View.prototype.setHeight = function (height) {
        this.__ie.style.height = height + 'px';
        this.__ie.offsetHeight = this.__frame.size.height = height;
        // update bounds
        this.__bounds.size.height = height - this.__bounds.origin.y - this.getPaddingBottom();
        // layout subviews while bounds changed
        this.needsLayoutSubviews = true;
        return this;
    };

    //
    //  Frame
    //
    View.prototype.getFrame = function () {
        if (this.__frame.equals(Rect.Zero)) {
            var origin = this.getOrigin();
            var size = this.getSize();
            this.__frame = new Rect(origin, size);
        }
        return this.__frame;
    };
    View.prototype.setFrame = function (frame) {
        if (this.__frame.equals(frame)) {
            // frame not change
            return this;
        }
        this.setOrigin(frame.origin);
        this.setSize(frame.size);
        return this;
    };

    View.prototype.getOrigin = function () {
        if (this.__frame.origin.equals(Point.Zero)) {
            var x = this.getX();
            var y = this.getY();
            this.__frame.origin = new Point(x, y);
        }
        return this.__frame.origin;
    };
    View.prototype.setOrigin = function (point) {
        if (arguments.length === 2) {
            point = new Point(arguments[0], arguments[1]);
        }
        if (this.__frame.origin.equals(point)) {
            // position not change
            return this;
        }
        this.setX(point.x);
        this.setY(point.y);
        return this;
    };

    View.prototype.getSize = function () {
        if (this.__frame.size.equals(Size.Zero)) {
            var width = this.getWidth();
            var height = this.getHeight();
            this.__frame.size = new Size(width, height);
        }
        return this.__frame.size;
    };
    View.prototype.setSize = function (size) {
        if (arguments.length === 2) {
            size = new Size(arguments[0], arguments[1]);
        }
        if (this.__frame.size.equals(size)) {
            // size not change
            return this;
        }
        this.setWidth(size.width);
        this.setHeight(size.height);
        return this;
    };

    //
    //  Bounds
    //
    View.prototype.getBounds = function () {
        if (this.__bounds.equals(Rect.Zero)) {
            var size = this.getSize();
            var edges = this.getPadding();
            this.__bounds.origin.x = edges.left;
            this.__bounds.origin.y = edges.top;
            this.__bounds.size.width = size.width - edges.left - edges.right;
            this.__bounds.size.height = size.height - edges.top - edges.bottom;
        }
        return this.__bounds;
    };
    View.prototype.setBounds = function (bounds) {
        if (this.__bounds.equals(bounds)) {
            // bounds not change
            return this;
        }

        // update padding for new bounds
        var frame = this.__frame;
        var left = bounds.origin.x;
        var top = bounds.origin.y;
        var right = frame.size.width - left - bounds.size.width;
        var bottom = frame.size.height - top - bounds.size.height;
        this.setPadding(new Edges(left, top, right, bottom));
        return this;
    };

}(tarsier.ui);

!function (ns) {
    'use strict';

    var Rect = ns.Rect;
    var Edges = ns.Edges;

    var View = ns.View;

    //
    //  Edges
    //
    View.prototype.getPadding = function () {
        var left = this.getPaddingLeft();
        var right = this.getPaddingRight();
        var top = this.getPaddingTop();
        var bottom = this.getPaddingBottom();
        return new Edges(left, top, right, bottom);
    };
    View.prototype.setPadding = function (padding) {
        var left, top, right, bottom;
        if (padding instanceof Edges) {
            left = padding.left;
            top = padding.top;
            right = padding.right;
            bottom = padding.bottom;
            padding = top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px';
        } else if (typeof padding === 'number') {
            left = top = right = bottom = padding;
            padding = padding + 'px';
        } else if (typeof padding === 'string') {
            var values = padding.split(' ');
            if (values.length === 1) {
                // (top, right, bottom, left)
                left = top = right = bottom = parseInt(values[0]);
            } else if (values.length === 2) {
                // (top, bottom), (left, right)
                top = bottom = parseInt(values[0]);
                left = right = parseInt(values[1]);
            } else if (values.length === 3) {
                // top, (left, right), bottom
                top = parseInt(values[0]);
                left = right = parseInt(values[1]);
                bottom = parseInt(values[2]);
            } else if (values.length === 4) {
                // top, right, bottom, left
                top = parseInt(values[0]);
                right = parseInt(values[1]);
                bottom = parseInt(values[2]);
                left = parseInt(values[3]);
            } else {
                throw Error('padding error: ' + padding);
            }
        } else {
            throw TypeError('error padding: ' + padding);
        }
        // remove useless properties
        this.__ie.style.paddingLeft = null;
        this.__ie.style.paddingRight = null;
        this.__ie.style.paddingTop = null;
        this.__ie.style.paddingBottom = null;
        // update padding
        this.__ie.style.padding = padding;

        // update bounds
        var size = this.getSize();
        var x = left;
        var y = top;
        var width = size.width - left - right;
        var height = size.height - top - bottom;
        this.__bounds = new Rect(x, y, width, height);
        // layout subviews while bounds changed
        this.needsLayoutSubviews = true;
        return this;
    };

    //
    //  Padding Left
    //
    View.prototype.getPaddingLeft = function () {
        var padding = this.__ie.style.paddingLeft;
        if (padding) {
            return parseInt(padding);
        }
        padding = this.__ie.style.padding;
        if (padding) {
            var values = padding.split(' ');
            if (values.length === 1) {
                // (top, right, bottom, left)
                return parseInt(values[0]);
            } else if (values.length === 2) {
                // (top, bottom), (left, right)
                return parseInt(values[1]);
            } else if (values.length === 3) {
                // top, (left, right), bottom
                return parseInt(values[1]);
            } else if (values.length === 4) {
                // top, right, bottom, left
                return parseInt(values[3]);
            } else {
                throw Error('padding error: ' + padding);
            }
        }
        return 0;
    };
    View.prototype.setPaddingLeft = function (left) {
        var top = this.getPaddingTop();
        var right = this.getPaddingRight();
        var bottom = this.getPaddingBottom();
        this.setPadding(new Edges(left, top, right, bottom));
        return this;
    };

    //
    //  Padding Right
    //
    View.prototype.getPaddingRight = function () {
        var padding = this.__ie.style.paddingRight;
        if (padding) {
            return parseInt(padding);
        }
        padding = this.__ie.style.padding;
        if (padding) {
            var values = padding.split(' ');
            if (values.length === 1) {
                // (top, right, bottom, left)
                return parseInt(values[0]);
            } else if (values.length === 2) {
                // (top, bottom), (left, right)
                return parseInt(values[1]);
            } else if (values.length === 3) {
                // top, (left, right), bottom
                return parseInt(values[1]);
            } else if (values.length === 4) {
                // top, right, bottom, left
                return parseInt(values[1]);
            } else {
                throw Error('padding error: ' + padding);
            }
        }
        return 0;
    };
    View.prototype.setPaddingRight = function (right) {
        var top = this.getPaddingTop();
        var bottom = this.getPaddingBottom();
        var left = this.getPaddingLeft();
        this.setPadding(new Edges(left, top, right, bottom));
        return this;
    };

    //
    //  Padding Top
    //
    View.prototype.getPaddingTop = function () {
        var padding = this.__ie.style.paddingTop;
        if (padding) {
            return parseInt(padding);
        }
        padding = this.__ie.style.padding;
        if (padding) {
            var values = padding.split(' ');
            if (values.length === 1) {
                // (top, right, bottom, left)
                return parseInt(values[0]);
            } else if (values.length === 2) {
                // (top, bottom), (left, right)
                return parseInt(values[0]);
            } else if (values.length === 3) {
                // top, (left, right), bottom
                return parseInt(values[0]);
            } else if (values.length === 4) {
                // top, right, bottom, left
                return parseInt(values[0]);
            } else {
                throw Error('padding error: ' + padding);
            }
        }
        return 0;
    };
    View.prototype.setPaddingTop = function (top) {
        var right = this.getPaddingRight();
        var bottom = this.getPaddingBottom();
        var left = this.getPaddingLeft();
        this.setPadding(new Edges(left, top, right, bottom));
        return this;
    };

    //
    //  Padding Bottom
    //
    View.prototype.getPaddingBottom = function () {
        var padding = this.__ie.style.paddingBottom;
        if (padding) {
            return parseInt(padding);
        }
        padding = this.__ie.style.padding;
        if (padding) {
            var values = padding.split(' ');
            if (values.length === 1) {
                // (top, right, bottom, left)
                return parseInt(values[0]);
            } else if (values.length === 2) {
                // (top, bottom), (left, right)
                return parseInt(values[0]);
            } else if (values.length === 3) {
                // top, (left, right), bottom
                return parseInt(values[2]);
            } else if (values.length === 4) {
                // top, right, bottom, left
                return parseInt(values[2]);
            } else {
                throw Error('padding error: ' + padding);
            }
        }
        return 0;
    };
    View.prototype.setPaddingBottom = function (bottom) {
        var top = this.getPaddingTop();
        var right = this.getPaddingRight();
        var left = this.getPaddingLeft();
        this.setPadding(new Edges(left, top, right, bottom));
        return this;
    };

}(tarsier.ui);
