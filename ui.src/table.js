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

    var IndexPath = function (section, row) {
        this.row = row;
        this.section = section;
    };

    IndexPath.prototype.toString = function () {
        return '(' + this.row + ',' + this.section + ')';
    };

    var TableViewDataSource = function () {
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get section count
     *
     * @param {TableView} tableView
     * @returns {Number}
     */
    TableViewDataSource.prototype.numberOfSections = function (tableView) {
        return 1;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get title of section header
     *
     * @param {Number} section
     * @param {TableView} tableView
     * @returns {String}
     */
    TableViewDataSource.prototype.titleForHeaderInSection = function (section, tableView) {
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Get title of section footer
     *
     * @param {Number} section
     * @param {TableView} tableView
     * @returns {String}
     */
    TableViewDataSource.prototype.titleForFooterInSection = function (section, tableView) {
        return null;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get row count in section
     *
     * @param {Number} section
     * @param {TableView} tableView
     * @returns {Number}
     */
    TableViewDataSource.prototype.numberOfRowsInSection = function (section, tableView) {
        console.assert(false, 'implement me!');
        return 0;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get table cell view
     *
     * @param {IndexPath} indexPath
     * @param {TableView} tableView
     * @returns {TableViewCell}
     */
    TableViewDataSource.prototype.cellForRowAtIndexPath = function (indexPath, tableView) {
        console.assert(false, 'implement me!');
        return null;
    };

    //-------- namespace --------
    ns.IndexPath = IndexPath;
    ns.TableViewDataSource = TableViewDataSource;

}(tarsier.ui);

!function (ns) {
    'use strict';

    var TableViewDelegate = function () {
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get header height in section
     *
     * @param {Number} section
     * @param {TableView} tableView
     * @returns {Number}
     */
    TableViewDelegate.prototype.heightForHeaderInSection = function (section, tableView) {
        return 16;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Get footer height in section
     *
     * @param {Number} section
     * @param {TableView} tableView
     * @returns {Number}
     */
    TableViewDelegate.prototype.heightForFooterInSection = function (section, tableView) {
        return 16;
    };

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get header view in section
     *
     * @param {Number} section
     * @param {TableView} tableView
     * @returns {View}
     */
    TableViewDelegate.prototype.viewForHeaderInSection = function (section, tableView) {
        return null;
    };
    // noinspection JSUnusedLocalSymbols
    /**
     *  Get footer view in section
     *
     * @param {Number} section
     * @param {TableView} tableView
     * @returns {View}
     */
    TableViewDelegate.prototype.viewForFooterInSection = function (section, tableView) {
        return null;
    };

    //
    //  Rows
    //

    // noinspection JSUnusedLocalSymbols
    /**
     *  Get row height
     *
     * @param {IndexPath} indexPath
     * @param {TableView} tableView
     * @returns {Number}
     */
    TableViewDelegate.prototype.heightForRowAtIndexPath = function (indexPath, tableView) {
        return 64;
    };

    /**
     *  Callback for row selected
     *
     * @param {IndexPath} indexPath
     * @param {TableView} tableView
     */
    TableViewDelegate.prototype.didSelectRowAtIndexPath = function (indexPath, tableView) {
    };

    //-------- namespace --------
    ns.TableViewDelegate = TableViewDelegate;

}(tarsier.ui);

!function (ns) {
    'use strict';

    var View = ns.View;

    var TableViewCell = function (cell) {
        View.call(this, cell);
    };
    TableViewCell.prototype = Object.create(View.prototype);
    TableViewCell.prototype.constructor = TableViewCell;

    //-------- namespace --------
    ns.TableViewCell = TableViewCell;

}(tarsier.ui);

!function (ns) {
    'use strict';

    var $ = ns.$;
    var View = ns.View;
    var ScrollView = ns.ScrollView;

    var IndexPath = ns.IndexPath;

    var TableView = function (table) {
        ScrollView.call(this, table);

        this.setScrollX(false);
        this.setScrollY(true);

        this.dataSource = null;
        this.delegate = null;
    };
    TableView.prototype = Object.create(ScrollView.prototype);
    TableView.prototype.constructor = TableView;

    TableView.prototype.reloadData = function () {
        // clear table
        this.removeChildren();
        // add sections one by one
        var count = this.dataSource.numberOfSections(this);
        for (var section = 0; section < count; ++section) {
            show_section.call(this, section);
        }
    };

    var show_section = function (section) {
        var clazz;
        // 1. show section header
        var header = section_header.call(this, section);
        if (header) {
            this.appendChild(header);
        }
        // 2. show cells
        var indexPath, cell;
        var count = this.dataSource.numberOfRowsInSection(section, this);
        for (var row = 0; row < count; ++row) {
            indexPath = new IndexPath(section, row);
            cell = this.dataSource.cellForRowAtIndexPath(indexPath, this);
            this.appendChild(cell);
        }
        // 3. show section footer
        var footer = section_footer.call(this, section);
        if (footer) {
            this.appendChild(footer);
        }
    };
    var section_header = function (section) {
        var header = this.delegate.viewForHeaderInSection(section, this);
        if (header) {
            return $(header);
        }
        var title = this.delegate.titleForHeaderInSection(section, this);
        if (title) {
            header = new ns.View();
            header.setClassName('ts_table_header');
            header.setText(title);
        }
        return header;
    };
    var section_footer = function (section) {
        var footer = this.delegate.viewForFooterInSection(section, this);
        if (footer) {
            return $(footer);
        }
        var title = this.delegate.titleForFooterInSection(section, this);
        if (title) {
            footer = new ns.View();
            footer.setClassName('ts_table_footer');
            footer.setText(title);
        }
        return footer;
    };

    //
    //  patch View for clear all children
    //
    View.prototype.removeChildren = function () {
        var children = this.getChildren();
        for (var i = 0; i < children.length; ++i) {
            this.removeChild(children[i]);
        }
    };

    //-------- namespace --------
    ns.TableView = TableView;

}(tarsier.ui);
