/**
 * content-edible
 */
define([], function(){

  var proto = {
    cleanHtml: function(){

    },

    insert: function(){},
    cmd: function(){},
    getCurrentRange: function (){
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    },
    /*
    saveSelection: function(){
      selectedRange = getCurrentRange();
    },

    restoreSelection: function(){
      var selection = window.getSelection();
      if (selectedRange) {
        try {
          selection.removeAllRanges();
        } catch (ex) {
          document.body.createTextRange().select();
          document.selection.empty();
        }

        selection.addRange(selectedRange);
      }
    },

    markSelection: function(input, color){
      restoreSelection();
      if (document.queryCommandSupported('hiliteColor')) {
        document.execCommand('hiliteColor', 0, color || 'transparent');
      }
      saveSelection();
      input.data(options.selectionMarker, color);
    },
    */
  };

  // constructor
  var edible = function edible(el){
    var instance = Object.create(proto);
    instance.el = el;
    return instance;
  };

  return edible;
});
