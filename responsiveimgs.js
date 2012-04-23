/*!
 * Responsive Images: Mobile-First images that scale responsively and responsibly
 * Copyright 2011, Scott Jehl, Filament Group, Inc
 * Dual licensed under the MIT or GPL Version 2 licenses.
*/
/*jslint browser: true, sloppy: true, plusplus: true, indent: 2 */
(function (win) {
  // defaults / mixins
  var rwdi            = win.rwd_images || {},
    widthBreakPoint   = rwdi.widthBreakPoint || 480,
    htmlClass         = "rwd-imgs-lrg",
    wideload          = win.screen.availWidth > widthBreakPoint,
    filePath          = location.href,
    dirPath           = filePath.substring(0, filePath.lastIndexOf("/")) + "/",
    doc               = win.document,
    head              = doc.getElementsByTagName("head")[0],
    cookieTime        = rwdi.cookieTime || 365, // Defaults to one year, 365 days
    timeCalc          = cookieTime * 24 * 60 * 60 * 1000,
    date              = new Date();

  // set cookie
  date.setTime(date.getTime() + timeCalc);
  doc.cookie = "rwd-resolution=" + screen.width + ";expires=" + date.toGMTString() + "; path=/";

  // if wideload is false quit now
  if (!wideload) {
    return;
  }

  // base tag support test (returns base tag for use if support test passes) creds: jQuery Mobile, hasJS
  var base = (function () {
    var backup,
      baseAdded = false,
      a = doc.createElement("a"),
      supported = false,
      base = head.getElementsByTagName("base")[0] || (function () {
        baseAdded = true;
        return head.insertBefore(doc.createElement("base"), head.firstChild);
      }());

    backup = !baseAdded && base.href;

    // test base support before using
    base.href = location.protocol + "//" + "x/";
    a.href = "y";

    // if dynamic base tag is unsupported (Firefox)
    if (a.href.indexOf("x/y") < 0) {
      if (backup) {
        base.href = backup;
      } else {
        head.removeChild(base);
      }
      base = null;
    } else {
      base.href = dirPath +  "rwd-router/";
    }

    //return
    return base;
  }()),

    //find and replace img elements
    findrepsrc = function () {
      var i, imgs, il;
      for (i = 0, imgs = doc.getElementsByTagName("img"), il = imgs.length; i < il; i++) {
        var img = imgs[i],
          src = img.getAttribute("src"),
          full = src.match(/(\?|&)full=(.*)&?/) && RegExp.$2;
        if (full) {
          img.src = full;
        }
      }
    },

    //flag for whether loop has run already
    complete = false,

    //remove base if present, find/rep image srcs if wide enough (maybe make this happen at domready?)
    readyCallback = function () {
      if (complete) {
        return;
      }
      complete = true;

      if (!base) {
        findrepsrc();
      } else {
        head.removeChild(base);
      }
    };

  // DOM-ready or onload handler
  // W3C event model
  if (doc.addEventListener) {
    win.addEventListener("load", readyCallback, false);
  } else if (doc.attachEvent) {
    // If IE event model is used
    win.attachEvent("onload", readyCallback);
  }
}(this));