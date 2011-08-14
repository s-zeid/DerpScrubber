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
 
 function DerpScrubber(width, height, barSize, barBG, highlightBG, outerBG,
                       handle, clickable) {
  if (typeof(width) == "object") {
   var obj = width;
   this.width = width = obj.width;
   this.height = height = obj.height;
   this.barSize = barSize = obj.barSize;
   this.barBG = barBG = obj.barBG;
   this.highlightBG = highlightBG = obj.highlightBG;
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
  this.highlight.css("display", "inline-block").css("position", "static");
  this.highlight.css("width", "100%").css("height", "100%");
  this.highlight.css("margin", "0")
  if (highlightBG) this.highlight.css("background", highlightBG);
  
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
  
  this.bar.append(this.highlight);
  this.handleOuterContainer.append(this.handleContainer);
  this.outer.append(this.handleOuterContainer);
  this.outer.append(this.bar);
  this.root.append(this.outer);
  
  this.allBorders = {x: 0, y: 0};
  this.enabled = false;
  this.moveCallbacks = new Array();
  
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
  
  disable: function() {
   this.setEnabled(false);
   return this;
  },
 
  enable: function() {
   this.setEnabled(true);
   return this;
  },
  
  getCoefficient: function(position) {
   if (typeof(position) != "number" && !this.enabled) return null;
   if (typeof(position) != "number") position = this.getPosition();
   return position / this.getBarSize();
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
   function doMove(e) {
    // Left mouse button only
    if (e.which != 1)
     return;
    if (scrubber.clickable && scrubber.enabled)
     scrubber.move(null, e);
    e.preventDefault(); // Prevents text from being selected
   }
   function doUnbind(e) {
    $(window).unbind("mousemove", doMove).unbind("mouseup", doUnbind);
   }
   function handler(e) {
    if (scrubber.clickable && scrubber.enabled)
     doMove(e); // Allow clicking anywhere on outer to move
    // Always do this to prevent text selection even when the scrubber is not
    // clickable or disabled
    $(window).mousemove(doMove).mouseup(doUnbind);
    e.preventDefault(); // Prevents text from being selected
   }
   return handler;
  },
  
  move: function(position, event) {
   var cursor, percent, position;
   if (typeof(position) == "string" && position.match(/^[0-9.]+\%$/g))
    position = (Number(position.replace("%", "")) / 100) * this.getBarSize();
   if (typeof(position) != "number") {
    if (typeof(event) != "object")
     position = 0;
    else {
     if (this.orientation == "horizontal")
      position = event.pageX - this.getBarOffset();
     else
      position = this.getOffsetOf(this.outer) + this.getBarSize() - event.pageY;
    }
   }
   position = Math.min(this.getBarSize(), Math.max(position, 0));
   percent = this.getPercent(position);
   if (this.orientation == "horizontal") {
    this.highlight.css("width", String(percent) + "%");
    if (this.handle) {
     this.handleContainer.css("padding-left", String(percent) + "%");
    }
   } else {
    this.highlight.css("height", String(percent) + "%");
    this.highlight.css("margin-top", (this.getBarSize() - position) + "px");
    if (this.handle) {
     this.handleContainer.css("padding-top", String(percent) + "%");
    }
   }
   this.onMove();
   return this;
  },
  
  onMove: function(callback) {
   if (typeof(callback) == "undefined") {
    var info = {
                scrubber: this, position: this.getPosition(),
                coefficient: this.getCoefficient(), percent: this.getPercent()
               };
    for (var i = 0; i < this.moveCallbacks.length; i++) {
     this.moveCallbacks[i](info);
    }
   } else {
    this.onMoveBind(callback);
   }
   return this;
  },
  
  onMoveBind: function(callback) {
   this.moveCallbacks.push(callback);
   return this;
  },
  
  onMoveUnbind: function(callback) {
   if (typeof(callback) == "undefined")
    this.moveCallbacks.splice(0);
   else {
    for (var i = 0; i < this.moveCallbacks.length; i++) {
     if (this.moveCallbacks[i] == callback)
      this.moveCallbacks.splice(i, 1);
    }
   }
   return this;
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
 };
 
 return DerpScrubber;
})();
