content-edible
==============

A lightly sweetened api for contentEditable's execCommand.


### Goals:

- Expose a more discoverable api for contentEditable's [execCommand](https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla)
- Basic functionality to be controlled by a DIY WYSIWYG toolbar
- No dependencies
- Under 5k

### Why?

There are many great wysiwyg editors out there, from the slim [bootstrap-wysiwyg](http://mindmup.github.io/bootstrap-wysiwyg/) to the full-featured [Aloha Editor](http://www.aloha-editor.org/). I found most either were not quite what I needed, or far more than I needed. I wanted a small module to make execCommand more memorable, and control it elsewhere.
`content-edible` calls native browser execCommands with flagrant disregard for browser descrepencies.

## Install

TODO: register with bower/component

content-edible can be used with AMD, or as a `contentEdible` global.

## Example

```javascript
var el = document.querySelector('.user-editable');
var edible = contentEdible(el);

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
- cmd(value)
- focus()
- saveSelection()
- restoreSelection()
- undo()
- redo()
- ... see unit tests or source for more.

### Things to do when implementing a toolbar that uses edible:

- Save/restore user selections when focus is lost.
- `focus` on editable element before calling commands.

---------------------
TODO:

- finish unit tests. manually make range selections for selection related tests?


---------------------

MIT License
