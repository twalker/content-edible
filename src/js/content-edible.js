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
define([], function(){

  var proto = {
    cleanHtml: function(){
      console.log('not yet implemented');
    },

    getHtml: function(){
      return this.el.innerHTML;
    },

    replaceHtml: function(html){
      this.restoreSelection();
      this.cmd('selectAll');
      this.cmd('insertHTML', html);
      window.getSelection().removeAllRanges();
    },

    cmd: function(cmd, val){
      var success = document.execCommand(cmd, false, val || null);
      console.log('command', cmd, val, success ? 'succeeded': 'failed');
      return success;
    },

    getCurrentRange: function (){
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    },

    closestElement: function(){
      var range = this.getCurrentRange(),
        parent;
      if(range){
        parent = range.commonAncestorContainer;
        if(parent.nodeType !== 1) parent = parent.parentNode;
      }
      return parent;
    },

    enable: function(enable){
      this.el.setAttribute('contenteditable', enable);
    },

    focus: function(){
      this.el.focus();
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
    /*
    markSelection: function(input, color){
      this.restoreSelection();
      if (document.queryCommandSupported('hiliteColor')) {
        document.execCommand('hiliteColor', 0, color || 'transparent');
      }
      this.saveSelection();
      //input.data(options.selectionMarker, color);
    },
    */

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

    selectElement: function(el){
      var range = document.createRange();
      range.selectNode(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      this.saveSelection();
    }
  };

  // Convenience methods for the absent minded
  ['bold', 'italic', 'copy', 'cut', 'paste', 'delete', 'forwardDelete',
  'fontName', 'fontSize', 'foreColor', 'hiliteColor', 'backColor',
  'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight',
  'strikeThrough', 'subscript', 'superscript', 'underline',
  'removeFormat', 'heading', 'formatBlock', 'indent', 'outdent', 'createLink', 'unlink', 'insertBrOnReturn', 'insertHorizontalRule', 'insertImage', 'insertOrderedList',
  'insertUnorderedList', 'insertParagraph', 'insertText', 'insertHTML',
  'undo', 'redo', 'selectAll'].forEach(function(command){
    this[command] = this.cmd.bind(this, command);
  }, proto);

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

  // instance factory
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
