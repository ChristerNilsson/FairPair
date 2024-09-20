// Generated by CoffeeScript 2.7.0
import {
  g,
  print,
  range,
  scalex,
  scaley
} from './globals.js';

import {
  Page
} from './page.js';

import {
  Button,
  spread
} from './button.js';

import {
  Lista
} from './lista.js';

export var Active = class Active extends Page {
  constructor() {
    super();
    this.buttons.ArrowLeft = new Button('', '', () => {
      return g.setState(g.NAMES);
    });
    this.buttons.ArrowRight = new Button('', '', () => {
      return g.setState(g.STANDINGS);
    });
    this.buttons.p = new Button('Pair', 'P = Perform pairing now', () => {
      this.buttons.t.active = true;
      this.buttons.n.active = true;
      this.buttons.s.active = true;
      return this.t.lotta();
    });
    this.buttons[' '] = new Button('toggle', 'space = pause/activate', () => {
      return this.t.playersByName[g.pages[g.state].lista.currentRow].toggle();
    });
    this.buttons.a.active = false;
    this.buttons.a.help = this.HELP;
    this.setLista();
  }

  setLista() {
    this.lista = new Lista(this.t.playersByName, "Pause Name", this.buttons, function(p) {
      var s;
      s = p.active ? '      ' : 'pause ';
      return s + g.txtT(p.name, 25, LEFT);
    });
    spread(this.buttons, 10, this.y, this.h);
    if (g.tournament.virgin) { //round == 0
      this.buttons.t.active = false;
      this.buttons.n.active = false;
      return this.buttons.s.active = false;
    }
  }

  draw() {
    var button, key, ref, results;
    fill('white');
    this.showHeader(this.t.round);
    this.lista.draw();
    ref = this.buttons;
    results = [];
    for (key in ref) {
      button = ref[key];
      results.push(button.draw());
    }
    return results;
  }

  mouseWheel(event) {
    return this.lista.mouseWheel(event);
  }

  mousePressed(event) {
    return this.lista.mousePressed(event);
  }

  keyPressed(event) {
    if (this.buttons[key].active || (key === 'p' || key === ' ')) {
      return this.buttons[key].click();
    }
  }

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZV9hY3RpdmUuanMiLCJzb3VyY2VSb290IjoiLi5cXCIsInNvdXJjZXMiOlsiY29mZmVlXFxwYWdlX2FjdGl2ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQUE7RUFBUyxDQUFUO0VBQVcsS0FBWDtFQUFpQixLQUFqQjtFQUF1QixNQUF2QjtFQUE4QixNQUE5QjtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLElBQVQ7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxNQUFUO0VBQWdCLE1BQWhCO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsS0FBVDtDQUFBLE1BQUE7O0FBRUEsT0FBQSxJQUFhLFNBQU4sTUFBQSxPQUFBLFFBQXFCLEtBQXJCO0VBRU4sV0FBYyxDQUFBLENBQUE7U0FDYixDQUFBO0lBRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQUEsQ0FBQSxHQUFBO2FBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUMsS0FBYjtJQUFOLENBQW5CO0lBQ3RCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxHQUFzQixJQUFJLE1BQUosQ0FBVyxFQUFYLEVBQWUsRUFBZixFQUFtQixDQUFBLENBQUEsR0FBQTthQUFNLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQyxDQUFDLFNBQWI7SUFBTixDQUFuQjtJQUN0QixJQUFDLENBQUEsT0FBTyxDQUFDLENBQVQsR0FBc0IsSUFBSSxNQUFKLENBQVcsTUFBWCxFQUFrQix5QkFBbEIsRUFBNkMsQ0FBQSxDQUFBLEdBQUE7TUFDbEUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBWCxHQUFvQjtNQUNwQixJQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFYLEdBQW9CO01BQ3BCLElBQUMsQ0FBQSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQVgsR0FBb0I7YUFDcEIsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILENBQUE7SUFKa0UsQ0FBN0M7SUFLdEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFELENBQVIsR0FBc0IsSUFBSSxNQUFKLENBQVcsUUFBWCxFQUFxQix3QkFBckIsRUFDckIsQ0FBQSxDQUFBLEdBQUE7YUFBTSxJQUFDLENBQUEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFILENBQVMsQ0FBQyxLQUFLLENBQUMsVUFBeEIsQ0FBbUMsQ0FBQyxNQUFwRCxDQUFBO0lBQU4sQ0FEcUI7SUFHdEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBWCxHQUFvQjtJQUNwQixJQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFYLEdBQWtCLElBQUMsQ0FBQTtJQUNuQixJQUFDLENBQUEsUUFBRCxDQUFBO0VBZmE7O0VBaUJkLFFBQVcsQ0FBQSxDQUFBO0lBQ1YsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUosQ0FBVSxJQUFDLENBQUEsQ0FBQyxDQUFDLGFBQWIsRUFBNEIsWUFBNUIsRUFBMEMsSUFBQyxDQUFBLE9BQTNDLEVBQW9ELFFBQUEsQ0FBQyxDQUFELENBQUE7QUFDL0QsVUFBQTtNQUFHLENBQUEsR0FBTyxDQUFDLENBQUMsTUFBTCxHQUFpQixRQUFqQixHQUErQjthQUNuQyxDQUFBLEdBQUksQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFDLENBQUMsSUFBVCxFQUFlLEVBQWYsRUFBb0IsSUFBcEI7SUFGd0QsQ0FBcEQ7SUFHVCxNQUFBLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsRUFBakIsRUFBcUIsSUFBQyxDQUFBLENBQXRCLEVBQXlCLElBQUMsQ0FBQSxDQUExQjtJQUNBLElBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFoQjtNQUNDLElBQUMsQ0FBQSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQVgsR0FBb0I7TUFDcEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBWCxHQUFvQjthQUNwQixJQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFYLEdBQW9CLE1BSHJCOztFQUxVOztFQVVYLElBQU8sQ0FBQSxDQUFBO0FBQ1IsUUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQTtJQUFFLElBQUEsQ0FBSyxPQUFMO0lBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQWY7SUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTtBQUNBO0FBQUE7SUFBQSxLQUFBLFVBQUE7O21CQUNDLE1BQU0sQ0FBQyxJQUFQLENBQUE7SUFERCxDQUFBOztFQUpNOztFQU9QLFVBQWEsQ0FBQyxLQUFELENBQUE7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLFVBQVAsQ0FBa0IsS0FBbEI7RUFBWDs7RUFDYixZQUFlLENBQUMsS0FBRCxDQUFBO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxZQUFQLENBQW9CLEtBQXBCO0VBQVg7O0VBQ2YsVUFBYSxDQUFDLEtBQUQsQ0FBQTtJQUFXLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFELENBQUssQ0FBQyxNQUFkLEtBQXdCLFFBQVEsT0FBUixRQUFZLElBQXZDO2FBQWlELElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRCxDQUFLLENBQUMsS0FBZCxDQUFBLEVBQWpEOztFQUFYOztBQXRDUCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGcscHJpbnQscmFuZ2Usc2NhbGV4LHNjYWxleSB9IGZyb20gJy4vZ2xvYmFscy5qcycgXHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICcuL3BhZ2UuanMnIFxyXG5pbXBvcnQgeyBCdXR0b24sc3ByZWFkIH0gZnJvbSAnLi9idXR0b24uanMnIFxyXG5pbXBvcnQgeyBMaXN0YSB9IGZyb20gJy4vbGlzdGEuanMnIFxyXG5cclxuZXhwb3J0IGNsYXNzIEFjdGl2ZSBleHRlbmRzIFBhZ2UgXHJcblxyXG5cdGNvbnN0cnVjdG9yIDogLT5cclxuXHRcdHN1cGVyKClcclxuXHJcblx0XHRAYnV0dG9ucy5BcnJvd0xlZnQgID0gbmV3IEJ1dHRvbiAnJywgJycsICgpID0+IGcuc2V0U3RhdGUgZy5OQU1FU1xyXG5cdFx0QGJ1dHRvbnMuQXJyb3dSaWdodCA9IG5ldyBCdXR0b24gJycsICcnLCAoKSA9PiBnLnNldFN0YXRlIGcuU1RBTkRJTkdTXHJcblx0XHRAYnV0dG9ucy5wICAgICAgICAgID0gbmV3IEJ1dHRvbiAnUGFpcicsJ1AgPSBQZXJmb3JtIHBhaXJpbmcgbm93JywgKCkgPT4gXHJcblx0XHRcdEBidXR0b25zLnQuYWN0aXZlID0gdHJ1ZVxyXG5cdFx0XHRAYnV0dG9ucy5uLmFjdGl2ZSA9IHRydWVcclxuXHRcdFx0QGJ1dHRvbnMucy5hY3RpdmUgPSB0cnVlXHJcblx0XHRcdEB0LmxvdHRhKClcclxuXHRcdEBidXR0b25zWycgJ10gICAgICAgPSBuZXcgQnV0dG9uICd0b2dnbGUnLCAnc3BhY2UgPSBwYXVzZS9hY3RpdmF0ZScsIFxyXG5cdFx0XHQoKSA9PiBAdC5wbGF5ZXJzQnlOYW1lW2cucGFnZXNbZy5zdGF0ZV0ubGlzdGEuY3VycmVudFJvd10udG9nZ2xlKClcclxuXHJcblx0XHRAYnV0dG9ucy5hLmFjdGl2ZSA9IGZhbHNlXHJcblx0XHRAYnV0dG9ucy5hLmhlbHAgPSBASEVMUFxyXG5cdFx0QHNldExpc3RhKClcclxuXHJcblx0c2V0TGlzdGEgOiAtPlxyXG5cdFx0QGxpc3RhID0gbmV3IExpc3RhIEB0LnBsYXllcnNCeU5hbWUsIFwiUGF1c2UgTmFtZVwiLCBAYnV0dG9ucywgKHApIC0+XHJcblx0XHRcdHMgPSBpZiBwLmFjdGl2ZSB0aGVuICcgICAgICAnIGVsc2UgJ3BhdXNlICdcclxuXHRcdFx0cyArIGcudHh0VCBwLm5hbWUsIDI1LCAgTEVGVFxyXG5cdFx0c3ByZWFkIEBidXR0b25zLCAxMCwgQHksIEBoXHJcblx0XHRpZiBnLnRvdXJuYW1lbnQudmlyZ2luICNyb3VuZCA9PSAwXHJcblx0XHRcdEBidXR0b25zLnQuYWN0aXZlID0gZmFsc2VcclxuXHRcdFx0QGJ1dHRvbnMubi5hY3RpdmUgPSBmYWxzZVxyXG5cdFx0XHRAYnV0dG9ucy5zLmFjdGl2ZSA9IGZhbHNlXHJcblxyXG5cdGRyYXcgOiAtPlxyXG5cdFx0ZmlsbCAnd2hpdGUnXHJcblx0XHRAc2hvd0hlYWRlciBAdC5yb3VuZFxyXG5cdFx0QGxpc3RhLmRyYXcoKVxyXG5cdFx0Zm9yIGtleSxidXR0b24gb2YgQGJ1dHRvbnNcclxuXHRcdFx0YnV0dG9uLmRyYXcoKVxyXG5cclxuXHRtb3VzZVdoZWVsIDogKGV2ZW50ICktPiBAbGlzdGEubW91c2VXaGVlbCBldmVudFxyXG5cdG1vdXNlUHJlc3NlZCA6IChldmVudCkgLT4gQGxpc3RhLm1vdXNlUHJlc3NlZCBldmVudFxyXG5cdGtleVByZXNzZWQgOiAoZXZlbnQpIC0+IGlmIEBidXR0b25zW2tleV0uYWN0aXZlIG9yIGtleSBpbiBbJ3AnLCcgJ10gdGhlbiBAYnV0dG9uc1trZXldLmNsaWNrKCkiXX0=
//# sourceURL=c:\github\ELO-Pairings\coffee\page_active.coffee