/* DerpScrubber
 * A simple JavaScript scrubber/slider widget.
 *
 * Copyright (C) 2011 Scott Zeid
 * https://github.com/scottywz/DerpScrubber
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Except as contained in this notice, the name(s) of the above copyright holders
 * shall not be used in advertising or otherwise to promote the sale, use or
 * other dealings in this Software without prior written authorization.
 *
 */

var DerpScrubber = (function() {
 var $ = jQuery;
 
 function DerpScrubber(width, height, barSize, barBG, highlightBG, availableBG,
                       outerBG, handle, clickable) {
  if (typeof(width) == "object") {
   var obj = width;
   this.width = width = obj.width;
   this.height = height = obj.height;
   this.barSize = barSize = obj.barSize;
   this.barBG = barBG = obj.barBG;
   this.highlightBG = highlightBG = obj.highlightBG;
   this.availableBG = availableBG = obj.availableBG;
   this.outerBG = outerBG = obj.outerBG;
   this.handle = handle = obj.handle;
   this.clickable = clickable = obj.clickable;
   delete obj;
  } else {
   this.width = width;
   this.height = height;
   this.barSize = barSize;
   this.barBG = barBG;
   this.highlightBG = highlightBG;
   this.availableBG = availableBG;
   this.outerBG = outerBG;
   this.handle = handle;
   this.clickable = clickable;
  }
  
  if (typeof(this.clickable) == "undefined")
   this.clickable = clickable = true;
  
  this.handleContainer = $("<span></span>").css("position", "static");
  this.handleContainer.addClass("DerpScrubber_handleContainer");
  this.handleContainer.css("width", "100%").css("height", "100%");
  this.handleContainer.css("display", "block").css("margin", "0");
  
  this.handleOuterContainer = $("<span></span>");
  this.handleOuterContainer.addClass("DerpScrubber_handleOuterContainer");
  this.handleOuterContainer.css("position", "absolute");
  this.handleOuterContainer.css("top", "0").css("right", "0");
  this.handleOuterContainer.css("bottom", "0").css("left", "0");
  this.handleOuterContainer.css("width", "auto").css("height", "auto");
  this.handleOuterContainer.css("display", "block").css("margin", "0");
  this.handleOuterContainer.css("float", "left").css("z-index", "2");
  
  this.userHandle = typeof(handle) == "object";
  if (!this.userHandle) {
   if (handle && typeof(handle) == "string") {
    this.handle = $("<span></span>").addClass("DerpScrubber_handle");
    this.handle.css("background", handle);
    handle = this.handle;
   } else
    this.handle = handle = null;
  }
  if (this.handle) {
   this.handle.addClass("DerpScrubber_handle");
   this.handle.css("display", "inline-block").css("position", "static");
   this.handle.css("margin", "0").css("overflow", "hidden");
   this.handleContainer.append(this.handle);
  }
  
  this.highlight = $("<span></span>").addClass("DerpScrubber_highlight");
  this.highlight.css("display", "block").css("position", "static");
  this.highlight.css("width", "100%").css("height", "100%");
  this.highlight.css("margin", "0")
  if (highlightBG) this.highlight.css("background", highlightBG);
  
  this.availableArea =$("<span></span>").addClass("DerpScrubber_availableArea");
  this.availableArea.css("display", "block").css("position", "static");
  this.availableArea.css("width", "100%").css("height", "100%");
  this.availableArea.css("margin", "0")
  if (availableBG) this.availableArea.css("background", availableBG);
  
  this.bar = $("<span></span>").addClass("DerpScrubber_bar");
  this.bar.css("display", "block").css("position", "absolute");
  this.bar.css("top", "0").css("right", "0");
  this.bar.css("bottom", "0").css("left", "0");
  this.bar.css("width", "auto").css("height", "auto").css("margin", "0");
  if (barBG) this.bar.css("background", barBG);
  
  this.outer = $("<span></span>").addClass("DerpScrubber_outer");
  this.outer.css("display", "block").css("position", "relative");
  this.outer.css("top", "0").css("right", "0");
  this.outer.css("bottom", "0").css("left", "0");
  this.outer.css("width", "100%").css("height", "100%");
  this.outer.css("margin", "0").css("overflow", "hidden");
  
  this.root = $("<span></span>").addClass("DerpScrubber");
  this.root.css("display", "inline-block");
  this.root.css("width", width).css("height", height);
  if (outerBG) this.root.css("background", outerBG);
  
  if (this.root.width() > this.root.height())
   this.orientation = "horizontal";
  else
   this.orientation = "vertical";
  
  this.root.addClass("DerpScrubber_" + this.orientation);
  this.root.addClass("DerpScrubber_" + ((handle) ? "hasHandle" : "noHandle"));
  
  this.availableArea.append(this.highlight);
  this.bar.append(this.availableArea);
  this.handleOuterContainer.append(this.handleContainer);
  this.outer.append(this.handleOuterContainer);
  this.outer.append(this.bar);
  this.root.append(this.outer);
  
  this.allBorders = {x: 0, y: 0};
  this.callbacks = {move: new Array(),
                    moveFinished: new Array(),
                    userMove: new Array(),
                    userMoveFinished: new Array()
                    };
  
  this.setClickable(clickable).setEnabled(false);
  this.root.bind("mousedown.DerpScrubber", this.makeDragHandler());
  
  return this;
 }
 
 DerpScrubber.prototype = {
  adjustBox: function() {
   var outer = this.outer, bar = this.bar, root = this.root, center;
   var handle = this.handle, container = this.container, handleMargin;
   this.highlight.css("display", "block");
   this.handleOuterContainer.css("display", "block");
   if (this.orientation == "horizontal") {
    if (handle) {
     if (!this.userHandle) {
      handle.css("width", this.handleContainer.height() / 2);
      if (!handle.height()) this.handle.css("height", this.height);
      handleBorderX = Math.abs(handle.outerWidth() - handle.width());
      handleBorderY = Math.abs(handle.outerHeight() - handle.height());
      handle.css("width", handle.width() - handleBorderX);
      handle.css("height", handle.height() - handleBorderY);
     }
     center = this.getHandleSize() / 2;
     handleMargin = (this.outer.height() - this.handle.outerHeight()) / 2;
     handle.css("margin-top", String(Math.floor(handleMargin) + "px"));
     handle.css("margin-left", String(-center) + "px");
     bar.css("left", String(center) + "px");
     bar.css("right", String(center) + "px");
     this.handleOuterContainer.css("left", String(center) + "px");
     this.handleOuterContainer.css("right", String(center) + "px");
    }
    this.highlight.css("width", "0%");
    if (typeof(this.barSize) == "string")
     bar.css("height", this.barSize);
   } else {
    if (handle) {
     if (!this.userHandle) {
      if (!handle.width()) this.handle.css("width", this.width);
      handle.css("height", this.handleContainer.width() / 2);
      handleBorderX = Math.abs(handle.outerWidth() - handle.width());
      handleBorderY = Math.abs(handle.outerHeight() - handle.height());
      handle.css("width", handle.width() - handleBorderX);
      handle.css("height", handle.height() - handleBorderY);
     }
     center = this.getHandleSize() / 2;
     handleMargin = (this.outer.height() - this.handle.outerHeight()) / 2;
     handle.css("margin-left", String(Math.floor(handleMargin) + "px"));
     handle.css("margin-top", String(-center) + "px");
     bar.css("top", String(center) + "px");
     bar.css("bottom", String(center) + "px");
     handleOuterContainer.css("top", String(center) + "px");
     handleOuterContainer.css("bottom", String(center) + "px");
    }
    this.highlight.css("height", "0%");
    if (typeof(this.barSize) == "string")
     bar.css("width", this.barSize);
   }
   center = this.getHandleSize() / 2;
   var barBorderX = Math.abs(bar.outerWidth() - bar.width()) / 2;
   var barBorderY = Math.abs(bar.outerHeight() - bar.height()) / 2;
   var outerBorderX = Math.abs(root.width() - outer.outerWidth()) / 2;
   var outerBorderY = Math.abs(root.height() - outer.outerHeight()) / 2;
   var rootBorderX = (root.outerWidth() - root.width()) / 2;
   var rootBorderY = (root.outerHeight() - root.height()) / 2;
   var rootPaddingX = (outer.outerWidth() - root.width()) / 2;
   var rootPaddingY = (outer.outerHeight() - root.height()) / 2;
   this.allBorders.x = (barBorderX + outerBorderX + rootBorderX) * 2;
   this.allBorders.y = (barBorderY + outerBorderY + rootBorderY) * 2;
   if (this.orientation == "horizontal") {
    outer.css("height", String(outer.height() - outerBorderY * 2) + "px");
    if (bar.height() >= outer.height())
     bar.css("height", String(bar.height() - barBorderY * 2) + "px");
    var barMarginY = (outer.height() - bar.outerHeight()) / 2;
    bar.css("top", Math.max(barMarginY, 0) + "px");
    bar.css("bottom", Math.max(barMarginY, 0) + "px");
    bar.css("left", String(center - barBorderX) + "px");
    bar.css("right", String(center - barBorderX) + "px");
   } else {
    outer.css("width", String(outer.width() - outerBorderX * 2) + "px");
    if (bar.width() >= outer.width())
     bar.css("width", String(bar.width() - barBorderX * 2) + "px");
    var barMarginX = (outer.width() - bar.outerWidth()) / 2;
    bar.css("top", String(center - barBorderX) + "px");
    bar.css("bottom", String(center - barBorderX) + "px");
    bar.css("left", Math.max(barMarginX, 0) + "px");
    bar.css("right", Math.max(barMarginX, 0) + "px");
   }
   if (this.enabled) {
    this.handleOuterContainer.css("display",(this.clickable)? "block" : "none");
    this.highlight.css("display", "none");
   }
   return this;
  },
  
  appendTo: function(element) {
   $(element).append(this.root);
   return this.adjustBox();
  },
  
  bind: function(eventType, callback) {
   if (typeof(eventType) == "object") {
    for (type in eventType)
     this.bind(type, eventType[type]);
    return this;
   }
   this.callbacks[eventType].push(callback);
   return this;
  },
  
  disable: function() {
   this.setEnabled(false);
   return this;
  },
 
  enable: function() {
   this.setEnabled(true);
   return this;
  },
  
  getAvailableSize: function() {
   return this.getSizeOf(this.availableArea);
  },
  
  getAvailableCoefficient: function() {
   return this.getSizeOf(this.availableArea) / this.getSizeOf(this.bar);
  },
  
  getAvailablePercent: function() {
   return this.getAvailableCoefficient() * 100;
  },
  
  getCoefficient: function(position) {
   if (typeof(position) != "number" && !this.enabled) return null;
   if (typeof(position) != "number") position = this.getPosition();
   return position / this.getAvailableSize();
  },
  
  getBarOffset: function() {
   return this.getOffsetOf(this.bar);
  },
  
  getBarSize: function() {
   return this.getSizeOf(this.bar);
  },
  
  getHandleSize: function() {
   if (typeof(this.handle) == "undefined") return 0;
   return this.getOuterSizeOf(this.handle);
  },
  
  getHighlightOffset: function() {
   return this.getOffsetOf(this.highlight);
  },
  
  getHighlightSize: function() {
   return this.getSizeOf(this.highlight);
  },
  
  getOffsetOf: function(element) {
   var offset, root;
   element = $(element);
   root = this.root;
   // All this shit is necessary to account for borders
   if (this.orientation == "horizontal") {
    offset = element.offset().left;
    offset += (element.outerWidth(true) - element.width()) / 2;
   } else {
    offset = element.offset().top;
    offset += (element.outerHeight(true) - element.height()) / 2;
   }
   return offset;
  },
  
  getOuterSizeOf: function(element) {
   if (this.orientation == "horizontal")
    return $(element).outerWidth();
   return $(element).outerHeight();
  },
  
  getSizeOf: function(element) {
   if (this.orientation == "horizontal")
    return $(element).width();
   return $(element).height();
  },
  
  getPercent: function(position) {
   if (typeof(position) != "number" && !this.enabled) return null;
   return this.getCoefficient(position) * 100;
  },
  
  getPosition: function() {
   if (typeof(position) != "number" && !this.enabled) return null;
   return this.getHighlightSize();
  },
  
  makeDragHandler: function() {
   var scrubber = this;
   function doMove(event, last) {
    // Left mouse button only
    if (scrubber.clickable && scrubber.enabled && event.which == 1)
     scrubber.moveUser(event, last);
    // Prevents text from being selected
    event.preventDefault();
   }
   function doUnbind(event) {
    doMove(event, true);
    $(window).unbind("mousemove", doMove).unbind("mouseup", doUnbind);
   }
   function handler(event) {
    // Allow clicking anywhere on outer to move
    doMove(event);
    $(window).mousemove(doMove).mouseup(doUnbind);
   }
   return handler;
  },
  
  move: function(position, user, last) {
   var cursor, percent, position, extra;
   user = Boolean(user);
   last = Boolean((user) ? last : true);
   if (typeof(position) == "string" && position.match(/^[0-9.]+\%$/g))
    position = (Number(position.replace("%","")) / 100)*this.getAvailableSize();
   if (typeof(position) == "string" && position != "" && Number(position) !=NaN)
    position = Number(position);
   if (typeof(position) != "number")
    position = 0;
   position = Math.min(this.getAvailableSize(), Math.max(position, 0));
   percent = this.getPercent(position);
   if (this.orientation == "horizontal") {
    this.highlight.css("width", String(percent) + "%");
   } else {
    this.highlight.css("height", String(percent) + "%");
    this.highlight.css("margin-top", (this.getBarSize() - position) + "px");
   }
   this.moveHandle(percent);
   extra = {user: user, last: last};
   this.onMove(extra);
   if (last) this.onMoveFinished(extra);
   if (user) {
    this.onUserMove(extra);
    if (last) this.onUserMoveFinished(extra);
   }
   return this;
  },
  
  moveUser: function(event, last) {
   if (this.orientation == "horizontal")
    position = event.pageX - this.getBarOffset();
   else
    position = this.getOffsetOf(this.outer) + this.getBarSize() - event.pageY;
   this.move(position, true, last);
   return this;
  },
  
  moveHandle: function(percent) {
   if (!this.handle)
    return this;
   if (typeof(percent) != "number") {
    if (typeof(percent) == "string" && percent.match(/^[0-9.]+\%$/g))
     percent = percent.replace("%", "");
    else
     percent = this.getPercent();
   }
   if (this.orientation == "horizontal") {
    percent *= this.getAvailableCoefficient();
    this.handleContainer.css("padding-left", String(percent) + "%");
   } else {
    percent *= this.getAvailableCoefficient();
    this.handleContainer.css("padding-top", String(percent) + "%");
   }
   return this;
  },
  
  moveToCoefficient: function(coeff) {
   return this.moveToPercent(Number(coeff) * 100);
  },
  
  moveToPercent: function(percent) {
   if (typeof(percent) == "number")
    percent = String(Math.max(0, Math.min(percent, 100))) + "%";
   if (typeof(percent) != "string" || !percent.match(/^[0-9.]+\%?$/g))
    if (percent == null || percent == "" || Number(percent) == NaN)
     percent = "100%";
   if (!percent.match(/^[0-9.]+\%$/g)) percent = percent + "%";
   return this.move(percent);
  },
  
  _onEvent: function(eventType, callback) {
   if (typeof(callback) != "function")
    this.trigger(eventType, callback);
   else
    this.bind(eventType, callback);
   return this;
  },
  
  onMove: function(callback) {
   return this._onEvent("move", callback);
  },
  
  onMoveFinished: function(callback) {
   return this._onEvent("moveFinished", callback);
  },
  
  onUserMove: function(callback) {
   return this._onEvent("userMove", callback);
  },
  
  onUserMoveFinished: function(callback) {
   return this._onEvent("userMoveFinished", callback);
  },
  
  prependTo: function(element) {
   $(element).prepend(this.root);
   return this.adjustBox();
  },
  
  removeFrom: function(element) {
   $(element).remove(this.root);
   return this;
  },
  
  reset: function() {
   this.disable();
   this.move(0);
   return this;
  },
  
  setAvailableCoefficient: function(coeff) {
   coeff = Math.max(0, Math.min(coeff, 1));
   return this.setAvailableSize(String(Number(coeff) * 100) + "%");
  },
  
  setAvailablePercent: function(percent) {
   if (typeof(percent) == "number")
    percent = String(Math.max(0, Math.min(percent, 100))) + "%";
   if (typeof(percent) != "string" || !percent.match(/^[0-9.]+\%?$/g))
    if (percent == null || percent == "" || Number(percent) == NaN)
     percent = "100%";
   if (!percent.match(/^[0-9.]+\%$/g)) percent = percent + "%";
   return this.setAvailableSize(percent);
  },
  
  setAvailableSize: function(size) {
   if (typeof(size) == "number")
    size = String(Math.min(0, Math.max(size / this.getBarSize(), 1))) + "%";
   else if (typeof(size) != "string" || !size.match(/^[0-9.]+\%$/g))
    if (percent == null || percent == "" || Number(size) == NaN)
     size = "100%";
   var percent = this.getPercent();
   if (this.orientation == "horizontal")
    this.availableArea.css("width", size);
   else
    this.availableArea.css("height", size);
   this.moveHandle(String(percent) + "%");
   return this;
  },
  
  setClickable: function(clickable) {
   this.clickable = Boolean(clickable);
   if (clickable) {
    this.handleOuterContainer.css("display", (this.enabled) ? "block" : "none");
    this.root.removeClass("DerpScrubber_notClickable");
    this.root.addClass("DerpScrubber_clickable");
   } else {
    this.handleOuterContainer.css("display", "none");
    this.root.removeClass("DerpScrubber_clickable");
    this.root.addClass("DerpScrubber_notClickable");
   }
   return this;
  },
  
  setEnabled: function(enabled) {
   this.enabled = Boolean(enabled);
   if (enabled) {
    if (this.clickable) this.handleOuterContainer.css("display", "block");
    this.highlight.css("display", "block");
    this.onMove();
    this.root.removeClass("DerpScrubber_disabled");
    this.root.addClass("DerpScrubber_enabled");
   } else {
    this.highlight.css("display", "none");
    this.handleOuterContainer.css("display", "none");
    this.root.removeClass("DerpScrubber_enabled");
    this.root.addClass("DerpScrubber_disabled");
   }
   return this;
  },
  
  trigger: function(eventType, extra) {
   if ($.isArray(eventType)) {
    for (var i = 0; i < eventType.length; i++)
     this.trigger(eventType[i]);
    return this;
   }
   var info = {
               scrubber: this, position: this.getPosition(),
               coefficient: this.getCoefficient(), percent: this.getPercent(),
               user: false, last: true
              };
   if (typeof(extra) == "object") {
    for (key in extra)
     info[key] = extra[key];
   }
   for (var i = 0; i < this.callbacks[eventType].length; i++) {
    this.callbacks[eventType][i](info);
   }
  },
  
  unbind: function(eventType, callback) {
   if ($.isArray(eventType)) {
    for (var i = 0; i < eventType.length; i++)
     this.trigger(eventType[i]);
    return this;
   }
   if (typeof(eventType) == "object") {
    for (type in eventType)
     this.unbind(type, eventType[type]);
    return this;
   }
   if (typeof(callback) == "undefined")
    this.callbacs[eventType].splice(0);
   else {
    for (var i = 0; i < this.callbacks[eventType].length; i++) {
     if (this.callbacks[eventType][i] == callback)
      this.callbacks[eventType].splice(i, 1);
    }
   }
   return this;
  }
 };
 
 return DerpScrubber;
})();
