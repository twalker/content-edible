/**
 * edible adds contentEditable behavior to an element
 *
 * uses a subset of contenteditable API:
 *   https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
 *
 * inspired by
 *   https://github.com/mindmup/bootstrap-wysiwyg
 *
 * execCmd:
 *   https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
 *
 * TODO:
 *   - clean and document
 */
// UMD's amdWeb pattern
(function (root, factory) {
  if (typeof define === 'function' && define.amd){
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.contentEdible = factory();
  }
}(this, function(){

  var proto = {

    // calls to the browser's execCommand, returns success or failure.
    cmd: function(cmd, val){
      var success = document.execCommand(cmd, false, val || null);
      console.log('command', cmd, val, success ? 'succeeded': 'failed');
      return success;
    },

    // whether or not the formating command can be executed on the current range
    cmdEnabled: function(cmd){
      return document.queryCommandEnabled(cmd);
    },

    // whether or not the formating command has been executed on the current range (i.e. active)
    cmdState: function(cmd){
      return document.queryCommandState(cmd);
    },

    // toggle whether or not the element is editable
    enable: function(enable){
      this.el.setAttribute('contenteditable', enable);
      return this;
    },

    // give focus back to the element
    focus: function(){
      this.el.focus();
      return this;
    },

    // get the html of the element
    getHtml: function(){
      return this.el.innerHTML;
    },

    // replace the innerHTML of the element (maintains a history)
    replaceHtml: function(html){
      this.restoreSelection();
      this.cmd('selectAll');
      this.cmd('insertHTML', html);
      window.getSelection().removeAllRanges();
    },

    // get the currently selected range
    getCurrentRange: function (){
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    },

    // save the user selection
    saveSelection: function(){
      this.selectedRange = this.getCurrentRange();
      return this;
    },

    // restore the user selection
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
      return this;
    },

    // find the closest parent element of user selection
    closestElement: function(){
      var range = this.getCurrentRange(),
        parent;
      if(range){
        parent = range.commonAncestorContainer;
        if(parent.nodeType !== 1) parent = parent.parentNode;
      }
      return parent;
    },

    // hierarchy of parent nodes of selection.
    parents: function(){
      var current = this.getCurrentRange();

      var parents = [];
      if(current){
        var parent = current.commonAncestorContainer;
        // ensure we're starting with an ELEMENT_NODE
        if(parent.nodeType !== 1) parent = parent.parentNode
        while(parent && parent !== this.el && this.el.contains(parent)){
          parents.push(parent);
          parent = parent.parentNode;
        }
      }
      return parents;
    },

    // selects an element
    selectElement: function(el){
      var range = document.createRange();
      range.selectNode(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      this.saveSelection();
      return this;
    }
  };

  // Convenience methods for the absent minded
  ['bold', 'italic', 'copy', 'cut', 'paste', 'delete', 'forwardDelete',
  'fontName', 'fontSize', 'foreColor', 'hiliteColor', 'backColor',
  'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight',
  'strikeThrough', 'subscript', 'superscript', 'underline',
  'removeFormat', 'heading', 'formatBlock', 'indent', 'outdent', 'createLink', 'unlink',
  'insertBrOnReturn', 'insertHorizontalRule', 'insertImage', 'insertOrderedList',
  'insertUnorderedList', 'insertParagraph', 'insertText', 'insertHTML',
  'undo', 'redo', 'selectAll'].forEach(function(command){
    this[command] = this.cmd.bind(this, command);
  }, proto);

  /*
  // YAGNI?
  // Convenience format block, or optionally insert a tag with text.
  'p pre h4 h3 h2 h1'
    .split(' ').forEach(function(tag){
      // format methods. e.g. formatH1()
      var capTag = tag.charAt(0).toUpperCase() + tag.slice(1)
      this['format' + capTag] = this.cmd.bind(this, 'formatBlock', tag);
      // insert methods. e.g. insertH1('hello world')
      this['insert' + capTag] = function insertTag(text){
        var el = document.createElement(tag);
        el.textContent = text;
        return this.cmd('insertHTML', el.outerHTML);
      };
    }, proto);
  */
  // return edible instance factory
  return function edible(el){
    var instance = Object.create(proto, {
      el: {value: el}
    });
    instance.enable(true);
    //instance.cmd('styleWithCSS', true);
    return instance;
  };

}));
