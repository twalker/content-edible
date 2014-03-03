/**
 * content-edible
 * https://github.com/mindmup/bootstrap-wysiwyg
 * execCmd:
 *   https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
 */
define([], function(){

  var proto = {
    cleanHtml: function(){

    },

    insert: function(){},

    cmd: function(cmd, val){
      console.log('TODO: command', cmd, val);
      //console.log('range', this.getCurrentRange());

      document.execCommand(cmd, false, val || '')
    },

    getCurrentRange: function (){
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    },

    enable: function(enable){
      this.el.setAttribute('contenteditable', enable);
    },

    saveSelection: function(){
      this.selectedRange = this.getCurrentRange();
    },

    restoreSelection: function(){
      var selection = window.getSelection();
      if (this.selectedRange) {
        try {
          selection.removeAllRanges();
        } catch (ex) {
          document.body.createTextRange().select();
          document.selection.empty();
        }

        selection.addRange(this.selectedRange);
      }
    },

    markSelection: function(input, color){
      this.restoreSelection();
      if (document.queryCommandSupported('hiliteColor')) {
        document.execCommand('hiliteColor', 0, color || 'transparent');
      }
      this.saveSelection();
      //input.data(options.selectionMarker, color);
    },

    // hierarchy of parent nodes of selection.
    parents: function(){
      var current = this.getCurrentRange();

      var parents = [];
      if(current){
        var parent = current.commonAncestorContainer;
        // ensure we're starting with an ELEMENT_NODE
        if(parent.nodeType !== 1) parent = parent.parentNode
        //console.log('parent', parent)
        while(parent && parent !== this.el){
          parents.push(parent);
          parent = parent.parentNode;
        }
      }
      return parents;
    },

    selectElement: function(parent){
      //console.log('select parent', parent)
      var range = document.createRange();
      range.selectNode(parent);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      this.saveSelection();
    }


  };

  // constructor
  var edible = function edible(el){
    var instance = Object.create(proto, {
      el: {value: el}
    });
    instance.enable(true);
    //instance.cmd('styleWithCSS', true);

    return instance;
  };

  return edible;
});
