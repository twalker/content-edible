content-edible
==============

A lightly sweetened api for document.execCommand in contentEditables.


### Goals:

- Expose a more discoverable [document.execCommand](https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla) api for use in contentEditables.
- Basic functionality to be controlled by a DIY WYSIWYG toolbar
- No dependencies
- ~200 lines (5k-ish uncompressed)

### Why?

There are many great wysiwyg editors out there, from the slim [bootstrap-wysiwyg](http://mindmup.github.io/bootstrap-wysiwyg/) to the full-featured [Aloha Editor](http://www.aloha-editor.org/). I found most either were not quite what I needed, or far more than I needed. I decided on a small module to make commands more memorable, and control it elsewhere.
`content-edible` calls native browser `document.execCommand` commands with little concern for the discrepancies between browser implementations (Tested in current Firefox and Chrome).


## Install

content-edible can be used with AMD, or CommonJS.

`bower install content-edible`

## Example

```javascript
var el = document.querySelector('.user-editable');
var edible = contentEdible(el);

// save the selections before losing focus
el.addEventListener('mouseout', function(e){
  edible.saveSelection();
});

// call command methods, typically in event handlers for a toolbar.
btnBold.addEventListener('click', function(e){
  e.preventDefault();
  edible
    // restore the selection if focus has been lost
    .restoreSelection().focus();
    // make the selection bold.
    .bold();
});

btnHeading.addEventListener('click', function(e){
  e.preventDefault();
  edible.restoreSelection().focus()
    // format selected as h2.
    .formatBlock('h2');
});

// content change events can be handled natively
el.addEventListener('input', function(e){
  console.log('content changed', edible.getHtml())
});

```

## API

- enable(enabled)
- bold()
- createLink(url)
- formatBlock(tagName)
- insertText(text)
- insertHTML(html)
- cmd(cmd, value)
- focus()
- saveSelection()
- restoreSelection()
- undo()
- redo()
- ... [see unit tests](test/content-edible.js) or [source](content-edible.js) for more.

### Things to remember when implementing a toolbar for edible:

- `saveSelection()` before focus leaves the editable element.
- `focus()` and/or `restoreSelection()` on editable element before calling commands.



---------------------
TODO:

- finish selection-based unit tests. How to test range related tests?


---------------------

MIT License
