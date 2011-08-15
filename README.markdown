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
                  barBG: "#CCC", highlightBG: "#A00",
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

DerpScrubber should work in all modern, standards-compliant Web browsers.  It
has not yet been tested in any version of Internet Explorer.


CSS Classes
===========

The following CSS classes are available for you to use for theming purposes:

 * `DerpScrubber` - the root element of the scrubber bar
    * `DerpScrubber_outer` - the element containing the main bar and handle
      containers
       * `DerpScrubber_handleOuterContainer` - the outer container of the handle
          * `DerpScrubber_handleContainer` - the inner container of the handle
             * `DerpScrubber_handle` - the handle of the scrubber bar
       * `DerpScrubber_bar` - the main scrubber bar
          * `DerpScrubber_availableArea` - the portion of the bar which is
            available to use
             * `DerpScrubber_highlight` - the highlighted portion of the
               available area

These elements are nested as shown above.  **Do not change the `position` or
`display` properties of these elements.**

The following classes are available depending on the state of the scrubber bar:
 * `DerpScrubber_enabled`
 * `DerpScrubber_disabled`
 * `DerpScrubber_clickable`
 * `DerpScrubber_notClickable`
 * `DerpScrubber_horizontal`
 * `DerpScrubber_vertical`


Events
======

DerpScrubber supports the following events:

 * `move` - triggered whenever the scrubber bar is moved
 
 * `moveFinished` - triggered when the user is finished moving the scrubber
   bar using the mouse, or every time `DerpScrubber.move()` is called if the
   user did not move it using the mouse
 
 * `userMove` - triggered whenever the user moves the scrubber bar using the
   mouse
 
 * `userMoveFinished` - triggered when the user is finished moving the scrubber
   bar using the mouse

You can use the `DerpScrubber.bind()` and `DerpScrubber.unbind()` methods to
bind or unbind callbacks to any of these events, respectively, and
`DerpScrubber.trigger()` to trigger an event.  Shortcut methods in the format
of `DerpScrubber.on<EventName>()` (note the capitalized event name) are
available to bind a callback to an event, or to trigger the event if no
callback is passed.

All callback functions will be passed an object with the following properties:

 * `scrubber` - the DerpScrubber that this was called on
 
 * `percent` - the percentage of the bar area that is highlighted
 
 * `coefficient` - `percent / 100`, useful for mathematical operations
 
 * `position` - the current size in pixels of the highlighted area (try to use
   `percent` or `coefficient` instead, **as you will not receive updates when
   the browser window is resized**).
 
 * `user` - Boolean value specifying whether or not the scrubber bar was moved
   by the user using the mouse
 
 * `last` - Boolean value specifying whether or not the user is finished moving
   the scrubber bar, or `true` if the user did not move the scrubber bar using
   the mouse


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
   (only applicable if `barSize` is less than `height`) (applied to the root
   element with the `DerpScrubber` class, not to `.DerpScrubber_outer`)
 
 * `availableBG` - CSS background value for the available portion of the bar,
   if you want it to be different from the bar background
 
 * `handle` - CSS background value for the scrubber handle, or an already-made
   element to use as the handle, or null or any other value that truth-tests to
   false if no handle is desired
 
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


DerpScrubber(width, height, ...)
--------------------------------
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
(Boolean) Whether or not the scrubber bar will respond to being clicked on or
dragged.  (Defaults to `true`.)


DerpScrubber.enabled
--------------------
(Boolean) Whether or not the scrubber bar is enabled.  (Defaults to `false`.)


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


DerpScrubber.bind(eventType, callback)
--------------------------------------
Registers a callback function to be called every time the given event is
triggered.  `eventType` can also be an object with each property being the name
of an event, and each value being the callback.

See the **Events** section for more info about events.


DerpScrubber.disable()
----------------------
Disables the scrubber bar, hiding the highlighted area and handle but preserving
the position.


DerpScrubber.enable()
---------------------
Enables the scrubber bar, restoring the previous position if possible.

The scrubber bar is **disabled** by default, in order to give you time to add
it to the page.


DerpScrubber.getAvailableCoefficient()
--------------------------------------
Returns the percentage of the bar size which is available to use, **divided by
100.**  This is useful for mathematical operations.  Defaults to 1.


DerpScrubber.getAvailablePercent()
----------------------------------
Returns the percentage of the bar size which is available to use.  Defaults to
100.


DerpScrubber.getAvailableSize()
-------------------------------
Returns the size of the available area.  Useful in conjunction with
`DerpScrubber.getBarSize()`.  However, try to use
`DerpScrubber.getAvailablePercent()` or `DerpScrubber.getAvailableCoefficient()`
instead.


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


DerpScrubber.move([position=0, [event=null]])
---------------------------------------------
Sets the size of the highlighted area to the given position, or 0 if it is
null, then calls all registered `onMove` callback functions.

If the position is a string value of the format `<decimal number>%`, then it
will be interpreted as a percentage of the **available** bar space, not the
entire bar space.

If `position` is null and a JavaScript event object is passed as `event`, then
the cursor position will be used to determine the size of the highlighted area.
This is mainly intended for internal use, and is only documented here for
completeness.


DerpScrubber.moveToCoefficient(coeff)
-------------------------------------
Sets the size of the highlighted area to the given number, **times 100,** as a
percentage of the available bar space.


DerpScrubber.moveToPercent(percent)
-----------------------------------
Sets the size of the highlighted area to the given percentage of the available
bar space.  You may include a percent sign at the end of the number if it is a
string.


DerpScrubber.onMove([callback])
-------------------------------
Registers a callback function to be called every time the `move` event is
triggered, or calls all such callback functions if no callback is given.

See the **Events** section for more info about events.


DerpScrubber.onMoveFinished([callback])
---------------------------------------
Registers a callback function to be called every time the `moveFinished` event
is triggered, or calls all such callback functions if no callback is given.

See the **Events** section for more info about events.


DerpScrubber.onUserMove([callback])
-----------------------------------
Registers a callback function to be called every time the `userMove` event is
triggered, or calls all such callback functions if no callback is given.

See the **Events** section for more info about events.


DerpScrubber.onUserMoveFinished([callback])
-------------------------------------------
Registers a callback function to be called every time the `userMoveFinished`
event is triggered, or calls all such callback functions if no callback is
given.

See the **Events** section for more info about events.


DerpScrubber.removeFrom(jQueryArgument)
---------------------------------------
Removes the scrubber bar from the given element.  The element can be any valid
argument to the jQuery constructor.


DerpScrubber.reset()
--------------------
Resets the scrubber bar to its original, disabled state, with the position set
to zero.  `onMove` callbacks will be called.


DerpScrubber.setAvailableCoefficient(coeff)
-------------------------------------------
Sets the percentage of the bar which is available to use to the given value
**times 100.**  The highlighted area will be adjusted to reflect this change.
`onMove` callbacks are **not** called.  Defaults to 1.

Useful for cases when only part of the bar should be useable, such as when only
part of a video or song has been loaded.  


DerpScrubber.setAvailablePercent(percent)
-----------------------------------------
Sets the percentage of the bar which is available to use to the given value.
You may include a percent sign at the end of the number if it is a string.  The
highlighted area will be adjusted to reflect this change. `onMove` callbacks
are **not** called.  Defaults to 1.

Useful for cases when only part of the bar should be useable, such as when only
part of a video or song has been loaded.


DerpScrubber.setAvailableSize(size)
-----------------------------------
Sets the size of the bar which is available to use to the given value.  The
highlighted area will be adjusted to reflect this change.  `onMove`
callbacks are **not** called.  Defaults to 100%.

Useful for cases when only part of the bar should be useable, such as when only
part of a video or song has been loaded.

`DerpScrubber.setAvailableCoefficient()` and
`DerpScrubber.setAvailablePercent()` are preferred to this method.

Size can be of one of the following formats:

 * `<decimal number>%` - percentage of the entire bar's size
 * JavaScript number type - size in pixels; will be converted to a percentage
 * anything else (including null) - 100%


DerpScrubber.setClickable(bool)
-------------------------------
Sets the `clickable` property, which decides whether the scrubber bar will
respond to being clicked on or dragged and whether the handle will be shown.
The default value is `true`.  **Always use this method.  NEVER set the
`clickable` property directly.**


DerpScrubber.setEnabled(bool)
-----------------------------
Enables or disables the scrubber bar based on the boolean value given.  The
default value is `false`.  **Always use this method or `DerpScrubber.enable()`
and `DerpScrubber.disable()`.  NEVER set the `enabled` property directly.**


DerpScrubber.trigger(eventType)
-------------------------------
Triggers the given event.  `eventType` can also be an array of all event names
you want to trigger.

See the **Events** section for more info about events.


DerpScrubber.unbind(eventType[, callback])
------------------------------------------
Unregisters the callback function that `callback` is a reference to for the
given event, or all callback functions for the event if no such reference is
passed.  `eventType` can also be an object with each property being the name of
an event, and each value being the callback (or null to remove all callbacks
for the event), or an array of events for which you want to unregister all
callbacks.

You must pass the exact same reference that you previously passed when you
registered the event, and not just a different function with identical code.

See the **Events** section for more info about events.
