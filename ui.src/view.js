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

    var Rect = ns.Rect;

    var Color = ns.Color;

    var View = function (div) {
        Object.call(this);
        if (!div) {
            div = document.createElement('DIV');
        }
        div.__vc = this;  // view controller
        this.__ie = div;  // inner element
        this.__frame = Rect.Zero.clone();
        this.__bounds = Rect.Zero.clone();

        // this.setScroll(false);
        // indicates whether need to layout childNodes
        this.needsLayoutSubviews = false;
    };
    View.prototype = Object.create(Object.prototype);
    View.prototype.constructor = View;

    View.prototype.getId = function () {
        return this.__ie.id;
    };
    View.prototype.setId = function (id) {
        this.__ie.id = id;
        return this;
    };

    View.prototype.getClassName = function () {
        return this.__ie.className;
    };
    View.prototype.setClassName = function (clazz) {
        var name = this.__ie.className;
        if (name) {
            this.__ie.className = name + ' ' + clazz;
        } else {
            this.__ie.className = clazz;
        }
        return this;
    };

    View.prototype.setBackgroundColor = function (color) {
        if (color instanceof Color) {
            color = color.toString();
        }
        this.__ie.style.backgroundColor = color;
        return this;
    };

    View.prototype.remove = function () {
        var parent = this.getParent();
        if (!parent) {
            throw Error('parent node empty');
        }
        parent.removeChild(this);
        return this;
    };

    View.prototype.floatToTop = function () {
        var parent = this.getParent();
        if (!parent) {
            console.error('parent node empty');
            return null;
        }
        var siblings = parent.getChildren();
        var pos = siblings.indexOf(this);
        var zIndex = 0, z;
        var i = 0, total = siblings.length;
        for (; i < pos; ++i) {
            z = siblings[i].getZ();
            if (zIndex < z) {
                zIndex = z;
            }
        }
        for (++i; i < total; ++i) {
            z = siblings[i].getZ();
            if (zIndex <= z) {
                zIndex = z + 1;
            }
        }
        this.setZ(zIndex);
        return this;
    };

    View.prototype.layoutSubviews = function () {
        if (!this.needsLayoutSubviews) {
            return ;
        }
        var children = this.getChildren();
        for (var i = 0; i < children.length; ++i) {
            children[i].layoutSubviews();
        }
        this.needsLayoutSubviews = false;
        return this;
    };

    //
    //  Events
    //

    View.prototype.onEnter = null;
    View.prototype.onExit = null;

    //
    //  Children
    //
    View.prototype.appendChild = function (child) {
        child = $(child);
        insert.call(this, child.__ie, null);
        return this;
    };
    View.prototype.insertBefore = function (newChild, existingChild) {
        newChild = $(newChild);
        existingChild = $(existingChild);
        insert.call(this, newChild.__ie, existingChild.__ie);
        return this;
    };
    View.prototype.insertAfter = function (newChild, existingChild) {
        newChild = $(newChild);
        existingChild = $(existingChild);
        // NOTICE: next sibling maybe not a HTMLElement
        insert.call(this, newChild.__ie, existingChild.__ie.nextSibling);
        return this;
    };
    var insert = function (new_node, existing_node) {
        if (existing_node) {
            this.__ie.insertBefore(new_node, existing_node);
        } else {
            this.__ie.appendChild(new_node);
        }
        var newChild = $(new_node);
        if (typeof newChild.onEnter === 'function') {
            newChild.onEnter();
        }
    };

    View.prototype.removeChild = function (child) {
        child = $(child);
        if (typeof child.onExit === 'function') {
            child.onExit();
        }
        // 1. remove child node from parent node
        this.__ie.removeChild(child.__ie);
        // 2. remove child node from node controller
        //    (to break circular reference)
        delete child.__ie;
        return this;
    };
    View.prototype.removeChildren = function () {
        var children = this.getChildren();
        var index = children.length;
        while (--index >= 0) {
            this.removeChild(children[index]);
        }
        return this;
    };

    View.prototype.replaceChild = function (newChild, oldChild) {
        newChild = $(newChild);
        oldChild = $(oldChild);
        // 1. exit old child
        if (typeof oldChild.onExit === 'function') {
            oldChild.onExit();
        }
        // 2. replace old node with new node
        this.__ie.replaceChild(newChild.__ie, oldChild.__ie);
        // 3. enter new child
        if (typeof newChild.onEnter === 'function') {
            newChild.onEnter();
        }
        // 4. remove old node from node controller
        //    (to break circular reference)
        delete oldChild.__ie;
        return this;
    };

    //-------- namespace --------
    ns.View = View;
    ns.Div = View;

}(tarsier.ui);

!function (ns) {
    'use strict';

    var $ = ns.$;
    var View = ns.View;

    //
    //  View Hierarchy
    //

    View.prototype.getParent = function () {
        return $(this.__ie.parentNode);
    };

    View.prototype.previousSibling = function () {
        // NOTICE: previous sibling maybe not a HTMLElement
        var parent = this.getParent();
        if (parent) {
            var siblings = parent.getChildren();
            var index = siblings.indexOf(this);
            if (index > 0) {
                return siblings[index - 1];
            }
        }
        return null;
        // return $(this.__ie.previousSibling);
    };
    View.prototype.nextSibling = function () {
        // NOTICE: next sibling maybe not a HTMLElement
        var parent = this.getParent();
        if (parent) {
            var siblings = parent.getChildren();
            var index = siblings.indexOf(this);
            if (index < 0) {
                throw Error('Hierarchy error: ' + siblings);
            }
            index += 1;
            if (index < siblings.length) {
                return siblings[index];
            }
        }
        return null;
        // return $(this.__ie.nextSibling);
    };

    View.prototype.getChildren = function () {
        var children = [];
        var nodes = this.__ie.childNodes;
        var item;
        for (var i = 0; i < nodes.length; ++i) {
            item = nodes[i];
            if (item instanceof HTMLElement) {
                children.push($(item));
            }
        }
        return children;
    };
    View.prototype.firstChild = function () {
        var children = this.getChildren();
        if (children.length > 0) {
            return children[0];
        } else {
            return null;
        }
        // return $(this.__ie.firstChild);
    };
    View.prototype.lastChild = function () {
        var children = this.getChildren();
        if (children.length > 0) {
            return children[children.length - 1];
        } else {
            return null;
        }
        // return $(this.__ie.lastChild);
    };

    View.prototype.contains = function (child) {
        child = $(child);
        return this.__ie.contains(child.__ie);
    };

}(tarsier.ui);
