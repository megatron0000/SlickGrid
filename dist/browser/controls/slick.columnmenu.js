"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: !0, configurable: !0, writable: !0, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => (__defNormalProp(obj, typeof key != "symbol" ? key + "" : key, value), value);

  // src/controls/slick.columnmenu.ts
  var BindingEventService = Slick.BindingEventService, SlickEvent = Slick.Event, Utils = Slick.Utils, SlickColumnMenu = class {
    constructor(columns, grid, options) {
      this.columns = columns;
      this.grid = grid;
      // --
      // public API
      __publicField(this, "onColumnsChanged", new SlickEvent());
      // --
      // protected props
      __publicField(this, "_gridUid");
      __publicField(this, "_columnTitleElm");
      __publicField(this, "_listElm");
      __publicField(this, "_menuElm");
      __publicField(this, "_columnCheckboxes", []);
      __publicField(this, "_bindingEventService", new BindingEventService());
      __publicField(this, "_options");
      __publicField(this, "_defaults", {
        fadeSpeed: 250,
        // the last 2 checkboxes titles
        hideForceFitButton: !1,
        hideSyncResizeButton: !1,
        forceFitTitle: "Force fit columns",
        syncResizeTitle: "Synchronous resize",
        headerColumnValueExtractor: (columnDef) => columnDef.name || ""
      });
      this._gridUid = grid.getUID(), this._options = Utils.extend({}, this._defaults, options), this.init(this.grid);
    }
    init(grid) {
      var _a, _b;
      grid.onHeaderContextMenu.subscribe(this.handleHeaderContextMenu.bind(this)), grid.onColumnsReordered.subscribe(this.updateColumnOrder.bind(this)), this._menuElm = document.createElement("div"), this._menuElm.className = `slick-columnpicker ${this._gridUid}`, this._menuElm.style.display = "none", document.body.appendChild(this._menuElm);
      let buttonElm = document.createElement("button");
      buttonElm.type = "button", buttonElm.className = "close", buttonElm.dataset.dismiss = "slick-columnpicker", buttonElm.ariaLabel = "Close";
      let spanCloseElm = document.createElement("span");
      if (spanCloseElm.className = "close", spanCloseElm.ariaHidden = "true", spanCloseElm.innerHTML = "&times;", buttonElm.appendChild(spanCloseElm), this._menuElm.appendChild(buttonElm), this._options.columnPickerTitle || (_a = this._options.columnPicker) != null && _a.columnTitle) {
        let columnTitle = this._options.columnPickerTitle || ((_b = this._options.columnPicker) == null ? void 0 : _b.columnTitle);
        this._columnTitleElm = document.createElement("div"), this._columnTitleElm.className = "slick-gridmenu-custom", this._columnTitleElm.textContent = columnTitle || "", this._menuElm.appendChild(this._columnTitleElm);
      }
      this._bindingEventService.bind(this._menuElm, "click", this.updateColumn.bind(this)), this._listElm = document.createElement("span"), this._listElm.className = "slick-columnpicker-list", this._bindingEventService.bind(document.body, "mousedown", this.handleBodyMouseDown.bind(this)), this._bindingEventService.bind(document.body, "beforeunload", this.destroy.bind(this));
    }
    destroy() {
      var _a, _b;
      this.grid.onHeaderContextMenu.unsubscribe(this.handleHeaderContextMenu.bind(this)), this.grid.onColumnsReordered.unsubscribe(this.updateColumnOrder.bind(this)), this._bindingEventService.unbindAll(), (_a = this._listElm) == null || _a.remove(), (_b = this._menuElm) == null || _b.remove();
    }
    handleBodyMouseDown(e) {
      (this._menuElm !== e.target && !(this._menuElm && this._menuElm.contains(e.target)) || e.target.className === "close") && (this._menuElm.setAttribute("aria-expanded", "false"), this._menuElm.style.display = "none");
    }
    handleHeaderContextMenu(e) {
      var _a, _b, _c, _d, _e, _f, _g;
      e.preventDefault(), Utils.emptyElement(this._listElm), this.updateColumnOrder(), this._columnCheckboxes = [];
      let columnId, columnLabel, excludeCssClass;
      for (let i = 0; i < this.columns.length; i++) {
        columnId = this.columns[i].id, excludeCssClass = this.columns[i].excludeFromColumnPicker ? "hidden" : "";
        let liElm = document.createElement("li");
        liElm.className = excludeCssClass, liElm.ariaLabel = ((_a = this.columns[i]) == null ? void 0 : _a.name) || "";
        let checkboxElm = document.createElement("input");
        checkboxElm.type = "checkbox", checkboxElm.id = `${this._gridUid}colpicker-${columnId}`, checkboxElm.dataset.columnid = String(this.columns[i].id), liElm.appendChild(checkboxElm), this._columnCheckboxes.push(checkboxElm), Utils.isDefined(this.grid.getColumnIndex(columnId)) && !this.columns[i].hidden && (checkboxElm.checked = !0), (_c = (_b = this._options) == null ? void 0 : _b.columnPicker) != null && _c.headerColumnValueExtractor ? columnLabel = this._options.columnPicker.headerColumnValueExtractor(this.columns[i], this._options) : columnLabel = this._defaults.headerColumnValueExtractor(this.columns[i], this._options);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${this._gridUid}colpicker-${columnId}`, labelElm.innerHTML = columnLabel, liElm.appendChild(labelElm), this._listElm.appendChild(liElm);
      }
      if (this._options.columnPicker && (!this._options.columnPicker.hideForceFitButton || !this._options.columnPicker.hideSyncResizeButton) && this._listElm.appendChild(document.createElement("hr")), !((_d = this._options.columnPicker) != null && _d.hideForceFitButton)) {
        let forceFitTitle = ((_e = this._options.columnPicker) == null ? void 0 : _e.forceFitTitle) || this._options.forceFitTitle, liElm = document.createElement("li");
        liElm.ariaLabel = forceFitTitle || "", this._listElm.appendChild(liElm);
        let forceFitCheckboxElm = document.createElement("input");
        forceFitCheckboxElm.type = "checkbox", forceFitCheckboxElm.id = `${this._gridUid}colpicker-forcefit`, forceFitCheckboxElm.dataset.option = "autoresize", liElm.appendChild(forceFitCheckboxElm);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${this._gridUid}colpicker-forcefit`, labelElm.textContent = forceFitTitle || "", liElm.appendChild(labelElm), this.grid.getOptions().forceFitColumns && (forceFitCheckboxElm.checked = !0);
      }
      if (!((_f = this._options.columnPicker) != null && _f.hideSyncResizeButton)) {
        let syncResizeTitle = ((_g = this._options.columnPicker) == null ? void 0 : _g.syncResizeTitle) || this._options.syncResizeTitle, liElm = document.createElement("li");
        liElm.ariaLabel = syncResizeTitle || "", this._listElm.appendChild(liElm);
        let syncResizeCheckboxElm = document.createElement("input");
        syncResizeCheckboxElm.type = "checkbox", syncResizeCheckboxElm.id = `${this._gridUid}colpicker-syncresize`, syncResizeCheckboxElm.dataset.option = "syncresize", liElm.appendChild(syncResizeCheckboxElm);
        let labelElm = document.createElement("label");
        labelElm.htmlFor = `${this._gridUid}colpicker-syncresize`, labelElm.textContent = syncResizeTitle || "", liElm.appendChild(labelElm), this.grid.getOptions().syncColumnCellResize && (syncResizeCheckboxElm.checked = !0);
      }
      this.repositionMenu(e);
    }
    repositionMenu(event) {
      var _a;
      let targetEvent = ((_a = event == null ? void 0 : event.touches) == null ? void 0 : _a[0]) || event;
      this._menuElm.style.top = `${targetEvent.pageY - 10}px`, this._menuElm.style.left = `${targetEvent.pageX - 10}px`, this._menuElm.style.maxHeight = `${window.innerHeight - targetEvent.clientY}px`, this._menuElm.style.display = "block", this._menuElm.setAttribute("aria-expanded", "true"), this._menuElm.appendChild(this._listElm);
    }
    updateColumnOrder() {
      let current = this.grid.getColumns().slice(0), ordered = new Array(this.columns.length);
      for (let i = 0; i < ordered.length; i++)
        this.grid.getColumnIndex(this.columns[i].id) === void 0 ? ordered[i] = this.columns[i] : ordered[i] = current.shift();
      this.columns = ordered;
    }
    /** Update the Titles of each sections (command, customTitle, ...) */
    updateAllTitles(pickerOptions) {
      var _a;
      (_a = this._columnTitleElm) != null && _a.innerHTML && (this._columnTitleElm.innerHTML = pickerOptions.columnTitle);
    }
    updateColumn(e) {
      if (e.target.dataset.option === "autoresize") {
        let previousVisibleColumns = this.getVisibleColumns(), isChecked = e.target.checked;
        this.grid.setOptions({ forceFitColumns: isChecked }), this.grid.setColumns(previousVisibleColumns);
        return;
      }
      if (e.target.dataset.option === "syncresize") {
        e.target.checked ? this.grid.setOptions({ syncColumnCellResize: !0 }) : this.grid.setOptions({ syncColumnCellResize: !1 });
        return;
      }
      if (e.target.type === "checkbox") {
        let isChecked = e.target.checked, columnId = e.target.dataset.columnid || "", visibleColumns = [];
        if (this._columnCheckboxes.forEach((columnCheckbox, idx) => {
          this.columns[idx].hidden !== void 0 && (this.columns[idx].hidden = !columnCheckbox.checked), columnCheckbox.checked && visibleColumns.push(this.columns[idx]);
        }), !visibleColumns.length) {
          e.target.checked = !0;
          return;
        }
        this.grid.setColumns(visibleColumns), this.onColumnsChanged.notify({ columnId, showing: isChecked, allColumns: this.columns, columns: this.columns, visibleColumns, grid: this.grid });
      }
    }
    setColumnVisibiliy(idxOrId, show) {
      let idx = typeof idxOrId == "number" ? idxOrId : this.getColumnIndexbyId(idxOrId), visibleColumns = this.getVisibleColumns(), col = this.columns[idx];
      if (show)
        col.hidden = !1, visibleColumns.splice(idx, 0, col);
      else {
        let newVisibleColumns = [];
        for (let i = 0; i < visibleColumns.length; i++)
          visibleColumns[i].id !== col.id && newVisibleColumns.push(visibleColumns[i]);
        visibleColumns = newVisibleColumns;
      }
      this.grid.setColumns(visibleColumns), this.onColumnsChanged.notify({ columnId: col.id, showing: show, allColumns: this.columns, columns: this.columns, visibleColumns, grid: this.grid });
    }
    getAllColumns() {
      return this.columns;
    }
    getColumnbyId(id) {
      for (let i = 0; i < this.columns.length; i++)
        if (this.columns[i].id === id)
          return this.columns[i];
      return null;
    }
    getColumnIndexbyId(id) {
      for (let i = 0; i < this.columns.length; i++)
        if (this.columns[i].id === id)
          return i;
      return -1;
    }
    /** visible columns, we can simply get them directly from the grid */
    getVisibleColumns() {
      return this.grid.getColumns();
    }
  };
  window.Slick && (window.Slick.Controls = window.Slick.Controls || {}, window.Slick.Controls.ColumnPicker = SlickColumnMenu);
})();
//# sourceMappingURL=slick.columnmenu.js.map
