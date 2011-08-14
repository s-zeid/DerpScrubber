DerpScrubber
============
A simple JavaScript scrubber/slider widget.

Copyright (c) 2011 Scott Zeid  
https://github.com/scottywz/DerpScrubber

Demo:  http://uploads.srwz.us/DerpScrubber/DerpScrubberDemo.html

Example
=======
    <script type="text/javascript" src="path/to/jquery.min.js"></script>
    <script type="text/javascript" src="path/to/DerpScrubber.js"></script>
    <script type="text/javascript">
     $(function() {
      var scrubber;
      scrubber = new DerpScrubber({
                  width: "100%", height: "24px",
                  fillBackground: "#CCC", highlight: "#A00",
                  handle: "#EEE"
                 }).appendTo("#scrubber").enable();
      scrubber.onMove(function(info) {
       $("#percent").text(info.percent + "%");
      });
     })
    </script>
    ...
    <p id="#scrubber"></p>
    <p>Percent: <span id="percent">Alternative text herp derp</span>%</p>

Dependencies
============
DerpScrubber depends on [jQuery](http://jquery.com/).  jQuery is not shipped
with DerpScrubber.

CSS Classes
===========
The following CSS classes are available for you to use for theming purposes:

 * `DerpScrubber` - the root element of the scrubber bar
    * `DerpScrubber_outer` - the element containing the outer background
       * `DerpScrubber_handleOuterContainer` - the outer container of the handle
          * `DerpScrubber_handleContainer` - the inner container of the handle
             * `DerpScrubber_handle` - the handle of the scrubber bar
       * `DerpScrubber_bar` - the main scrubber bar
          * `DerpScrubber_highlight` - the highlighted area

These elements are nested as shown above.

**Do not change the `position` or `display` properties of these elements.**

DerpScrubber API
================

This is a listing of all properties and methods of the DerpScrubber class which
are intended for public use.  Any properties and methods not listed here are
used internally and should be used or manipulated at your own risk.

DerpScrubber(settings)
----------------------
Returns a new DerpScrubber with the settings passed in the settings object.

Allowed settings (all are optional unless specified otherwise):

 * `width` - CSS width value for the entire widget (required)
 
 * `height` - CSS height value for the entire widget (required)
 
 * `barSize` - CSS width or height value for the scrubber bar if you want it to
               be smaller than the entire widget
 
 * `barBG` - CSS background value for the scrubber bar
 
 * `highlightBG` - CSS background value for the highlighted portion of the bar
                   (required if you want your users to see the value)
 
 * `outerBG` - CSS background value for the area outside of the scrubber bar
               (only applicable if `barSize` is less than `height`)
 
 * `handle` - CSS background value for the scrubber handle, or an already-made
              element to use as the handle, or null or any other value that
              truth-tests to false if no handle is desired
 
 * `clickable` - Boolean value specifying whether the scrubber bar will respond
                 to being clicked on or dragged (defaults to `true`)

The scrubber bar is **disabled** by default, in order to give you time to add
it to the page.

If `width` is greater than `height`, then the bar will assume that it is
horizontal, and changing the position will involve dragging any part of the
bar horizontally.  If `width` is less than or equal to `height`, then the bar
will assume that it is vertical, and changing the position will involve
dragging any part of the bar vertically.  The orientation is accessible as the
`DerpScrubber.orientation` property.

DerpScrubber(width, height, barSize, barBG, highlightBG, outerBG, handle, clickable)
------------------------------------------------------------------------------------
Returns a new DerpScrubber with the settings passed as arguments.  See
`DerpScrubber(settings)` for details about allowed settings.

DerpScrubber.allBorders
-----------------------
(Object) the total values of all border sizes on the x and y axes of the
scrubber bar and its children.

Properties:

 * `x` - total of all border sizes on the X axis
 
 * `y` - total of all border sizes on the Y axis

DerpScrubber.clickable
----------------------
(Boolean) whether the scrubber bar will respond to being clicked on or dragged
(defaults to `true`)

DerpScrubber.orientation
------------------------
(String) `horizontal` if the scrubber bar is horizontal, or `vertical` if it
is vertical.

If `width` is greater than `height` in the constructor, then the bar will
assume that it is horizontal, and changing the position will involve dragging
any part of the bar horizontally.  If `width` is less than or equal to
`height`, then the bar will assume that it is vertical, and changing the
position will involve dragging any part of the bar vertically.

DerpScrubber.appendTo(jQueryArgument) / DerpScrubber.prependTo(jQueryArgument)
------------------------------------------------------------------------------
Appends or prepends the scrubber bar to the given element.  The element can be
any valid argument to the jQuery constructor, although you should have the
scrubber bar added to only one element at a given time.

DerpScrubber.disable()
----------------------
Disables the scrubber bar, hiding the highlighted area and handle but preserving
the position.

DerpScrubber.enable()
---------------------
Enables the scrubber bar, restoring the previous position if possible.

The scrubber bar is **disabled** by default, in order to give you time to add
it to the page.

DerpScrubber.getBarSize()
-------------------------
Returns the size of the entire scrubber bar.  Useful in conjunction with
`DerpScrubber.getPosition()`.  However, try to use `DerpScrubber.getPercent()`
or `DerpScrubber.getCoefficient()` instead.

DerpScrubber.getCoefficient()
-----------------------------
Returns the percentage of the bar area that is highlighted **divided by 100.**
This is useful for mathematical operations, and this or
`DerpScrubber.getPercent()` should be used in preference to
`DerpScrubber.getPosition()`.

DerpScrubber.getPercent()
-------------------------
Returns the percentage of the bar area that is highlighted.  This or
`DerpScrubber.getCoefficient()` should be used in preference to
`DerpScrubber.getPosition()`.

DerpScrubber.getPosition()
--------------------------
Returns the current size in pixels of the highlighted area.  Try to use
`DerpScrubber.getPercent()` or `DerpScrubber.getCoefficient()` instead, **as
you will not receive `onMove` updates when the browser window is resized.**

DerpScrubber.isEnabled()
------------------------
Returns `true` if the scrubber bar is enabled or `false` otherwise.

DerpScrubber.move([position=0, [event=null]])
---------------------------------------------
Sets the size of the highlighted area to the given position, or 0 if it is
null, then calls all registered `onMove` callback functions.

If the position is a string value of the format `<decimal number>%`, then it
will be interpreted as a percentage of the entire available bar space.

If `position` is null and a JavaScript event object is passed as `event`, then
the cursor position will be used to determine the size of the highlighted area.
This is mainly intended for internal use, and is only documented here for
completeness.

DerpScrubber.onMove([callback])
-------------------------------
Registers a callback function to be called every time `DerpScrubber.move` is
called, or calls all such callback functions.

All callback functions will be passed an object with the following properties:

 * `scrubber` - the DerpScrubber that this was called on
 
 * `percent` - the percentage of the bar area that is highlighted
 
 * `coefficient` - `percent / 100`, useful for mathematical operations
 
 * `position` - the current size in pixels of the highlighted area (try to use
                `percent` or `coefficient` instead, **as you will not receive
                updates when the browser window is resized**).

DerpScrubber.onMoveBind(callback)
---------------------------------
Same as calling `DerpScrubber.onMove()` with a callback function.  This method
is indeed called by `DerpScrubber.onMove()` when registering callbacks.

DerpScrubber.onMoveUnbind([callback])
-------------------------------------
Unregisters the callback function that `callback` is a reference to, or all
callback functions if no such reference is passed.  You must pass the exact
same reference that you previously passed to `onMove` / `onMoveBind`, and not
just a different function with identical code.

DerpScrubber.removeFrom(jQueryArgument)
---------------------------------------
Removes the scrubber bar from the given element.  The element can be any valid
argument to the jQuery constructor.

DerpScrubber.reset()
--------------------
Resets the scrubber bar to its original, disabled state, with the position set
to zero.  `onMove` callbacks will be called.

DerpScrubber.setClickable(bool)
-------------------------------
Sets the `clickable` property, which decides whether the scrubber bar will
respond to being clicked on or dragged and whether the handle will be shown.
The default value is `true`.  **Always use this method instead of setting the
clickable property directly.**
