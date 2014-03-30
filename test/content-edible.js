/**
 * RequireJS configuration
 */
require.config({
  paths: {
    mocha: '../bower_components/mocha/mocha',
    chai: '../bower_components/chai/chai',
    'contentEdible': '../content-edible'
  },

  shim: {
    mocha: {
      exports: 'mocha'
    }
  }
});

require(['mocha', 'chai', 'contentEdible'], function(mocha, chai, contentEdible){
  var assert = chai.assert
  mocha.setup('bdd');

  function createFixture(){
    var el = document.createElement('section');
    el.setAttribute('id', 'fixture');
    el.innerHTML = '<h1>hello</h1><p>world<i>!</i></p>';
    document.body.appendChild(el);
  }

  function getFixture(){
    return document.getElementById('fixture');
  }

  function destroyFixture(){
    var fixture = document.getElementById('fixture');
    fixture.parentNode.removeChild(fixture);
  }

  describe('edible(el)', function(){

    beforeEach(createFixture);
    afterEach(destroyFixture);

    it('should create an instance of an edible element', function(){
      var elTarget = getFixture();
      var edible = contentEdible(elTarget);

      assert.equal(edible.el, elTarget);

    });

    it('should have some chainable methods', function(){
      var elTarget = getFixture();
      var edible = contentEdible(elTarget);
      assert.equal(
        edible
          .enable()
          .focus()
          .selectElement(elTarget.querySelector('h1'))
          .saveSelection()
          .restoreSelection(), edible);

    });

    describe('.enable(enabled)', function(){
      it('should enable editing on an element', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget);

        edible.enable(false);
        assert.equal(elTarget.getAttribute('contenteditable'), 'false');

        edible.enable(true);
        assert.equal(elTarget.getAttribute('contenteditable'), 'true');

      });

    });

    describe('.cmd(value)', function(){
      it('should excute contentEditable commands', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget);
        elTarget.focus();
        edible.cmd('insertText', 'foobar');
        assert.include(elTarget.innerText, 'foobar');
      });
    });

    describe('.[command]()', function(){
      it('should provide convenence methods to execCommands (e.g. edible.insertText(text)', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget);

        ['bold', 'italic', 'copy', 'cut', 'paste', 'delete', 'forwardDelete',
        'fontName', 'fontSize', 'foreColor', 'hiliteColor', 'backColor',
        'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight',
        'strikeThrough', 'subscript', 'superscript', 'underline',
        'removeFormat', 'heading', 'formatBlock', 'indent', 'outdent', 'createLink', 'unlink',
        'insertBrOnReturn', 'insertHorizontalRule', 'insertImage', 'insertOrderedList',
        'insertUnorderedList', 'insertParagraph', 'insertText', 'insertHTML',
        'undo', 'redo', 'selectAll']
          .forEach(function(method){
            assert.isFunction(edible[method]);
          }, edible);

        elTarget.focus();
        edible.insertText('foobar');
        assert.include(elTarget.innerText, 'foobar');
      });
    });

    describe('.cmdEnabled(cmd)', function(){
      // whether or not the formating command can be executed on the current range.
      it('should be a convenient way to call document.queryCommandEnabled(String command)', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget);

        assert.isFalse(edible.cmdEnabled('bold'));
        edible.focus();
        assert.isTrue(edible.cmdEnabled('bold'));

      });
    });

    describe('.cmdState(cmd)', function(){
      // whether or not the formating command has been executed on the current range (i.e. active)
      it('should be a convenient way to call document.queryCommandState(String command)', function(){

        var elTarget = getFixture();
        var edible = contentEdible(elTarget);

        edible.selectElement(elTarget.querySelector('p'));

        assert.isFalse(edible.cmdState('bold'));
        edible.bold();
        assert.isTrue(edible.cmdState('bold'));

      });
    });

    describe.skip('.focus()', function(){
      it('should focus on the element', function(){
        assert.isTrue(true)
      });
    });

    describe('.getHtml()', function(){
      it('should get the innerHTML of the element', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget);
        assert.equal(edible.getHtml(), elTarget.innerHTML);
      });
    });

    describe('.replaceHtml(html)', function(){
      it('should replace the innerHTML of the element (maintains a history)', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget)
          .focus();
        var html = '<h2>replaced!</h2>';
        edible.replaceHtml(html)
        assert.equal(edible.getHtml(), html);
      });
    });

    describe.skip('.getCurrentRange()', function(){
      it('should return the range that is currently selected by the user', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget).focus();

        assert.isTrue(true);
      });
    });

    describe.skip('.saveSelection()', function(){
      it('should save the user\'s selection', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget).focus();

        assert.isTrue(true);
      });
    });

    describe.skip('.restoreSelection()', function(){
      it('should restore the user\'s selection', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget).focus();

        assert.isTrue(true);
      });
    });

    describe('.closestElement()', function(){
      it('should return the closest container element for the current range', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget).focus();
        edible.selectElement(elTarget.querySelector('i'));
        assert.equal(edible.closestElement(), elTarget.querySelector('i'));
      });
    });

    describe('.parents()', function(){
      it('should provide an ancestory of parent nodes for current range', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget).focus();
        edible.selectElement(elTarget.querySelector('i'));

        assert.isArray(edible.parents());
        assert.deepEqual(edible.parents(), [elTarget.querySelector('i'), elTarget.querySelector('p')]);
      });
    });

    describe('.selectElement(el)', function(){
      it('should select a specified element', function(){
        var elTarget = getFixture();
        var edible = contentEdible(elTarget).focus();
        edible.selectElement(elTarget.querySelector('h1'));

        assert.equal(elTarget, edible.closestElement());
      });
    });

  });

  mocha.run();
});
