/**
 * content-edible
 * execCmd:
 *   https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
 */
define([], function(){

  var proto = {
    updateActive: function(){
      var links = [].slice.call(this.el.querySelectorAll('a[data-cmd]'));
      links.forEach(function(lnk){
        var cmd = lnk.getAttribute('data-cmd');
        lnk.classList.toggle('active', document.queryCommandState(cmd));
      });
    },
    updateParents: function(){
      var edible = this.edible;
      console.log('parents', edible.parents());
      var parents = edible.parents().reverse();
      var elParentNav = this.el.querySelector('.selected-parents');
      elParentNav.innerHTML = '';
      parents.forEach(function(p, i){
        if(i > 0) elParentNav.appendChild(document.createTextNode(' > '));
        var lnk = document.createElement('a');
        lnk.innerText = p.tagName.toLowerCase();
        lnk.onclick = edible.selectElement.bind(edible, p);
        elParentNav.appendChild(lnk);
      });

    },

    onClick: function(e){
      //console.log('other click', e.target, e.currentTarget.tagName)
      //e.preventDefault();
      //e.stopPropagation();
      var target = e.target;
      var cmd = target.getAttribute('data-cmd');
      while(target && !cmd && target !== e.currentTarget){
        target = target.parentNode;
        cmd = target.getAttribute('data-cmd')
      }
      if(cmd){
        e.preventDefault();
        e.stopPropagation();
        // TODO: far too procedural and internal knowledge
        this.edible.restoreSelection();
        this.edible.el.focus();
        this.edible.cmd(cmd, target.getAttribute('data-val') || '');
        this.updateActive();
        this.edible.saveSelection();
      }
    }
  };

  // constructor
  var toolbar = function toolbar(el, ce){
    var instance = Object.create(proto, {
      el: {value: el},
      edible: {value: ce}
    });
    /*
    [].slice.call(el.querySelectorAll('a')).forEach(function(lnk){
      lnk.setAttribute('tab-index', -1);
    });
    */

    el.addEventListener('click', instance.onClick.bind(instance));
    var elParents = document.createElement('nav');
    elParents.classList.add('selected-parents');
    el.appendChild(elParents);

    var updateActive = function updateActive(){
      this.edible.saveSelection();
      this.updateActive();
      this.updateParents();
    }.bind(instance)
    ce.el.addEventListener('mouseup', updateActive);
    ce.el.addEventListener('keyup', updateActive);
    ce.el.addEventListener('mouseout', updateActive);

    return instance;
  };

  return toolbar;
});
