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
    el.innerHTML = '<h1>hello</h1><p>world</p>';
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


  });

  mocha.run();
});
