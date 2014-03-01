/**
 * content-edible
 * execCmd:
 *   https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
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
    enable: function(enable){
      this.el.setAttribute('contenteditable', enable);
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
    var instance = Object.create(proto, {
      el: {value: el}
    });
    instance.enable(true);


    return instance;
  };

  return edible;
});
