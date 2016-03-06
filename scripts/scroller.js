(function (window) {

  var requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback){
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();


  var scrollToReach, timer;

  function smoothScrollTo (elementToReach) {
    scrollToReach = getScrollTopElement(elementToReach);
    if (!timer) {
      updateScroll();
    }
  }

  function updateScroll () {
    var currentTopDocument = getScrollTopDocument();
    var gap = scrollToReach - currentTopDocument;

    if (Math.abs(gap) < 2) {
      window.scrollTo(0, scrollToReach);
      timer = null;
      return;
    }
    
    if (Math.abs(currentTopDocument - scrollToReach) < 10) {
      window.scrollTo(0, currentTopDocument + (scrollToReach > currentTopDocument ? 1 : -1));
    }
    else {
      window.scrollTo(0, currentTopDocument + (scrollToReach - currentTopDocument) / 7);
    }
    timer = requestAnimFrame(updateScroll);
  }

  function getScrollTopElement (e) {
    var top = 0;
    while (e.offsetParent !== undefined && e.offsetParent !== null)
    {
      top += e.offsetTop + (e.clientTop !== null ? e.clientTop : 0);
      e = e.offsetParent;
    }
    return top;
  }

  function getScrollTopDocument () {
    return document.documentElement.scrollTop + document.body.scrollTop;
  }

  window.smoothScrollTo = smoothScrollTo;

})(window);