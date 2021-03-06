/**
 * content-edible
 * A lightly sweetened api for contentEditable's execCommand.
 *
 * source: https://github.com/twalker/content-edible
 * inspired by: https://github.com/mindmup/bootstrap-wysiwyg
 *
 */

// Helpers for working around browser differences in selecting a single node. See Tim Down's answer at:
// http://stackoverflow.com/questions/15867542/range-object-get-selection-parent-node-chrome-vs-firefox
function rangeSelectsSingleNode (range){
  var startNode = range.startContainer;
  return startNode === range.endContainer &&
   startNode.hasChildNodes() &&
   range.endOffset === range.startOffset + 1;
}

function getSelectedElement(range) {
  var selectedElement;
  if (rangeSelectsSingleNode(range)) {
    // Selection encompasses a single element
    selectedElement = range.startContainer.childNodes[range.startOffset];
  } else if (range.startContainer.nodeType === 3) {
    // Selection range starts inside a text node, so get its parent
    selectedElement = range.startContainer.parentNode;
  } else {
    // Selection starts inside an element
    selectedElement = range.startContainer;
  }
  return selectedElement;
}

var proto = {

  // calls to the browser's execCommand, returns success or failure.
  cmd(command, val){
    var success = document.execCommand(command, false, val || null);
    //console.log('command', cmd, val, success ? 'succeeded': 'failed');
    return success;
  },

  // whether or not the formating command can be executed on the current range
  cmdEnabled(cmd){
    return document.queryCommandEnabled(cmd);
  },

  // whether or not the formating command has been executed on the current range (i.e. active)
  cmdState(cmd){
    return document.queryCommandState(cmd);
  },

  // toggle whether or not the element is editable
  enable(enable){
    this.el.setAttribute('contenteditable', enable);
    return this;
  },

  // give focus back to the element
  focus(){
    this.el.focus();
    return this;
  },

  // get the html of the element
  getHtml(){
    return this.el.innerHTML;
  },

  // replace the innerHTML of the element (maintains a history)
  replaceHtml(html){
    this.restoreSelection();
    this.cmd('selectAll');
    this.cmd('insertHTML', html);
    window.getSelection().removeAllRanges();
  },

  // get the currently selected range
  getCurrentRange(){
    var sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    }
  },

  // save the user selection
  saveSelection(){
    //console.log('saveSelection');
    this.savedRange = this.getCurrentRange();
    return this;
  },

  // restore the user selection
  restoreSelection(){
    var selection = window.getSelection();
    if (this.savedRange) {
      try {
        selection.removeAllRanges();
      } catch (ex) {
        document.body.createTextRange().select();
        document.selection.empty();
      }

      selection.addRange(this.savedRange);
    }
    return this;
  },

  // whether or not there is a selection
  hasSelection(){
    return (this.savedRange !== undefined) && !this.savedRange.collapsed;
  },

  // get the nearest container element for the current range.
  getElement(){
    var el, range = this.getCurrentRange();
    if(range) {
      // normalize Firefox & Chrome tag selection
      el = getSelectedElement(range);
      if(el.nodeType !== 1) el = range.commonAncestorContainer;
    }
    return el;
  },

  // find the closest element of selection for selector.
  closest(selector){
    var el = this.getElement();
    if(!el) return;
    var matches = el.matches  || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while(el && el !== this.el && this.el.contains(el)){
      if(matches.call(el, selector)) break;
      el = el.parentNode;
    }
    return (el !== this.el) ? el : undefined;
  },

  // gets the selections element hierarchy
  parents(){
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
  selectElement(el){
    var sel = window.getSelection();
    sel.removeAllRanges();
    var range = document.createRange();
    range.selectNode(el);
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

export function create(el){
  var instance = Object.create(proto, {
    el: {value: el}
  });
  instance.enable(true);
  return instance;
}
// return edible instance factory
export default create;
