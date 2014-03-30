content-edible
==============

A lightly sweetened api for contentEditable's execCommand.


### Goals:

- Expose a more discoverable api for contentEditable's [execCommand](https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla)
- Basic functionality for DIY WYSIWYG toolbar
- No dependencies
- Under 5k

### Why?

There are many great wysiwyg editors out there, from the slim [bootstrap-wysiwyg](http://mindmup.github.io/bootstrap-wysiwyg/) to the full-featured [Aloha Editor](http://www.aloha-editor.org/). I found most either were not quite what I needed, or far more than I needed. What worked best for me was a slightly more memorable way to use execCommand, and knowing when to save/restore user selections. 

Content editable is notoriously rough--both to develop, and for users to use. `content-edible` keeps it sane (or naive, depending on your perspective), by calling native browser execCommands with flagrant disregard for browser descrepencies.

## Install

TODO: register with bower/component

## API

TODO: cherry pick some methods.

- Bold
- Italic
- (Un)Link
- Tag insertion (h1-h4)
- Text-align
- undo/redo

### When to save/restore user selections

TODO:

## Example

TODO: link to updated example.


---------------------

### TODO:

- update toolbar and example
- remove unneeded dependency
