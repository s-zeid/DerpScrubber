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
 function DerpScrubber(width, height, barSize, barBG, highlightBG, outerBG,
                       clickable) {
  if (typeof(width) == "object") {
   var obj = width;
   this.width = width = obj.width;
   this.height = height = obj.height;
   this.barSize = barSize = obj.barSize;
   this.barBG = barBG = obj.barBG;
   this.highlightBG = highlightBG = obj.highlightBG;
   this.outerBG = outerBG = obj.outerBG;
   this.clickable = clickable = obj.clickable;
   delete obj;
  } else {
   this.width = width;
   this.height = height;
   this.barSize = barSize;
   this.barBG = barBG;
   this.highlightBG = highlightBG;
   this.outerBG = outerBG;
   this.clickable = clickable;
  }
  
  if (typeof(this.clickable) == "undefined")
   this.clickable = clickable = true;
  
  this.highlight = $("<span></span>").addClass("DerpScrubber_highlight");
  this.highlight.css("display", "inline-block").css("position", "static");
  this.highlight.css("width", "100%").css("height", "100%");
  this.highlight.css("margin", "0")
  if (highlightBG) this.highlight.css("background", highlightBG);
  
  this.bar = $("<span></span>").addClass("DerpScrubber_bar");
  this.bar.css("display", "block").css("position", "static");
  this.bar.css("margin", "0");
  if (barBG) this.bar.css("background", barBG);
  
  this.outer = $("<span></span>").addClass("DerpScrubber_outer");
  this.outer.css("display", "inline-block").css("position", "static");
  this.outer.css("width", "100%").css("height", "100%");
  this.outer.css("margin", "0").css("overflow", "hidden");
  if (outerBG) this.outer.css("background", outerBG);
  
  this.root = $("<span></span>").addClass("DerpScrubber");
  this.root.css("display", "inline-block");
  this.root.css("width", width).css("height", height);
  
  if (this.root.width() > this.root.height()) {
   this.orientation = "horizontal";
  } else {
   this.orientation = "vertical";
  }
  
  this.highlight.css("display", "none");
  this.bar.append(this.highlight);
  this.outer.append(this.bar);
  this.root.append(this.outer);
  
  this.allBorders = {x: 0, y: 0}
  this.moveCallbacks = new Array();
  
  return this;
 }
 
 DerpScrubber.prototype = {
  adjustBox: function() {
   var outer = this.outer, bar = this.bar, root = this.root;
   if (!this.bar.width()) this.bar.css("width", "100%");
   if (!this.bar.height()) this.bar.css("height", "100%");
   if (this.root.width() > this.root.height()) {
    this.highlight.css("width", "0%");
    if (typeof(this.barSize) == "string")
     bar.css("height", this.barSize);
   } else {
    this.highlight.css("height", "0%");
    if (typeof(this.barSize) == "string")
     bar.css("width", this.barSize);
   }
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
    bar.css("margin-top", Math.max(barMarginY, 0) + "px");
    bar.css("margin-bottom", Math.max(barMarginY, 0) + "px");
    if (outerBorderX) {
     outer.css("padding-right", String(barBorderX * 2) + "px");
     root.css("padding-right", String(barBorderX * 2 + outerBorderX * 2) + "px");
    }
   } else {
    outer.css("width", String(outer.width() - outerBorderX * 2) + "px");
    if (bar.width() >= outer.width())
     bar.css("width", String(bar.width() - barBorderX * 2) + "px");
    var barMarginX = (outer.width() - bar.outerWidth()) / 2;
    bar.css("margin-left", Math.max(barMarginX, 0) + "px");
    bar.css("margin-right", Math.max(barMarginX, 0) + "px");
    //if (!barBorderX) bar.css("padding-bottom", String(outerBorderY) + "px");
    if (outerBorderY) {
     outer.css("padding-bottom", String(barBorderY * 2) + "px");
     root.css("padding-bottom", String(barBorderY * 2 + outerBorderY *2) + "px");
    }
   }
   return this;
  },
  
  appendTo: function(element) {
   $(element).append(this.root);
   return this.adjustBox();
  },
  
  disable: function() {
   if (typeof(this.dragHandler) == "function")
    this.root.unbind(this.dragHandler);
   this.highlight.css("display", "none");
   return this;
  },
 
  enable: function() {
   this.dragHandler = this.makeDragHandler();
   this.highlight.css("display", "block");
   this.root.mousedown(this.dragHandler);
   this.onMove();
   return this;
  },
  
  getCoefficient: function(position) {
   if (typeof(position) != "number" && !this.isEnabled()) return null;
   if (typeof(position) != "number") position = this.getPosition();
   return position / this.getBarSize();
  },
  
  getBarOffset: function() {
   return this.getOffsetOf(this.bar);
  },
  
  getBarSize: function() {
   return this.getSizeOf(this.bar);
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
  
  getSizeOf: function(element) {
   if (this.orientation == "horizontal")
    return $(element).width();
   return $(element).height();
  },
  
  getPercent: function(position) {
   if (typeof(position) != "number" && !this.isEnabled()) return null;
   return this.getCoefficient(position) * 100;
  },
  
  getPosition: function() {
   if (typeof(position) != "number" && !this.isEnabled()) return null;
   return this.getHighlightSize();
  },
  
  isEnabled: function() {
   if (typeof(this.highlight) != "object") return false;
   return this.highlight.css("display") != "none";
  },
  
  makeDragHandler: function() {
   var scrubber = this;
   function doMove(e) {
    if (e.which != 1) return; // Left mouse button only
    scrubber.move(null, e);
    e.preventDefault(); // Prevents text from being selected
   }
   function doUnbind(e) {
    $(window).unbind("mousemove", doMove).unbind("mouseup", doUnbind);
   }
   function handler(e) {
    if (scrubber.clickable) {
     doMove(e); // Allow clicking anywhere on the outer to move
     $(window).mousemove(doMove).mouseup(doUnbind);
    }
   }
   return handler;
  },
  
  move: function(position, event) {
   var cursor, position;
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
     position = Math.min(this.getBarSize(), Math.max(position, 0));
    }
   }
   if (this.orientation == "horizontal")
    this.highlight.css("width", String(this.getPercent(position)) + "%");
   else {
    this.highlight.css("height", String(this.getPercent(position)) + "%");
    this.highlight.css("margin-top", (this.getBarSize() - position) + "px");
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
   this.clickable = clickable;
   return this;
  },
 };
 
 return DerpScrubber;
})();
