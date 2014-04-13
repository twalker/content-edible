content-edible
==============

A lightly sweetened api for contentEditable's execCommand.


### Goals:

- Expose a more discoverable api for contentEditable's [execCommand](https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla)
- Basic functionality to be controlled by a DIY WYSIWYG toolbar
- No dependencies
- ~200 lines (5k-ish uncompressed)

### Why?

There are many great wysiwyg editors out there, from the slim [bootstrap-wysiwyg](http://mindmup.github.io/bootstrap-wysiwyg/) to the full-featured [Aloha Editor](http://www.aloha-editor.org/). I found most either were not quite what I needed, or far more than I needed. I decided on a small module to make execCommand more memorable, and control it elsewhere.
`content-edible` calls native browser document.execCommands with flagrant disregard for implementation descrepencies between browsers.

## Install

content-edible can be used with AMD, or as a `contentEdible` global.

TODO: 
- register with bower/component

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

## Contributing

TODO


---------------------
TODO:

- finish unit tests. how to test range related tests?
- register w/bower once unit tests pass in FF and Chrome. 


---------------------

MIT License
