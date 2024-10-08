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

export var Names = class Names extends Page {
  constructor() {
    super();
    this.buttons.n.active = false;
    this.buttons.ArrowLeft = new Button('', '', () => {
      return g.setState(g.TABLES);
    });
    this.buttons.ArrowRight = new Button('', '', () => {
      return g.setState(g.ACTIVE);
    });
  }

  setLista() {
    this.lista = new Lista(this.t.playersByName, "Table Name", this.buttons, (p) => {
      var r, s;
      r = this.t.round - 1;
      if (p.active && g.BYE !== _.last(p.opp)) {
        s = `${str(1 + Math.floor(p.chair / 2)).padStart(3)} ${g.RINGS[p.col[r][0]]} `;
      } else if (!p.active) {
        s = "   P  ";
      } else {
        s = "  BYE ";
      }
      return s + g.txtT(p.name, 25, LEFT);
    });
    return spread(this.buttons, 10, this.y, this.h);
  }

  mouseWheel(event) {
    return this.lista.mouseWheel(event);
  }

  mousePressed(event) {
    return this.lista.mousePressed(event);
  }

  keyPressed(event) {
    return this.buttons[key].click();
  }

  make(res, header, playersByName) {
    var i, j, len, player, r;
    res.push("NAMES" + header);
    res.push("");
    r = this.t.round;
    for (i = j = 0, len = playersByName.length; j < len; i = ++j) {
      player = playersByName[i];
      if (i % this.t.ppp === 0) {
        res.push("Table Name");
      }
      if (player.active && g.BYE !== player.opp[r]) {
        res.push(`${str(1 + Math.floor(player.chair / 2)).padStart(3)} ${g.RINGS[player.col[r][0]]} ${player.name}`);
      } else if (!player.active) {
        res.push(`   P  ${player.name}`);
      } else {
        res.push(`  BYE ${player.name}`);
      }
      if (i % this.t.ppp === this.t.ppp - 1) {
        res.push("\f");
      }
    }
    return res.push("\f");
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

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZV9uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIuLlxcIiwic291cmNlcyI6WyJjb2ZmZWVcXHBhZ2VfbmFtZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxJQUFUO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsTUFBVDtFQUFnQixNQUFoQjtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLEtBQVQ7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxRQUFOLE1BQUEsTUFBQSxRQUFvQixLQUFwQjtFQUVOLFdBQWMsQ0FBQSxDQUFBO1NBQ2IsQ0FBQTtJQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQVgsR0FBb0I7SUFDcEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQUEsQ0FBQSxHQUFBO2FBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUMsTUFBYjtJQUFOLENBQW5CO0lBQ3RCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxHQUFzQixJQUFJLE1BQUosQ0FBVyxFQUFYLEVBQWUsRUFBZixFQUFtQixDQUFBLENBQUEsR0FBQTthQUFNLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQyxDQUFDLE1BQWI7SUFBTixDQUFuQjtFQUpUOztFQU1kLFFBQVcsQ0FBQSxDQUFBO0lBQ1YsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUosQ0FBVSxJQUFDLENBQUEsQ0FBQyxDQUFDLGFBQWIsRUFBNEIsWUFBNUIsRUFBMEMsSUFBQyxDQUFBLE9BQTNDLEVBQW9ELENBQUMsQ0FBRCxDQUFBLEdBQUE7QUFDL0QsVUFBQSxDQUFBLEVBQUE7TUFBRyxDQUFBLEdBQUksSUFBQyxDQUFBLENBQUMs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TTs7RUFlUCxJQUFPLENBQUEsQ0FBQTtBQUNSLFFBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUE7SUFBRSxJQUFBLENBQUssT0FBTDtJQUNBLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFmO0lBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7QUFDQTtBQUFBO0lBQUEsS0FBQSxVQUFBOzttQkFDQyxNQUFNLENBQUMsSUFBUCxDQUFBO0lBREQsQ0FBQTs7RUFKTTs7QUF2Q0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnLHByaW50LHJhbmdlLHNjYWxleCxzY2FsZXkgfSBmcm9tICcuL2dsb2JhbHMuanMnIFxyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAnLi9wYWdlLmpzJyBcclxuaW1wb3J0IHsgQnV0dG9uLHNwcmVhZCB9IGZyb20gJy4vYnV0dG9uLmpzJyBcclxuaW1wb3J0IHsgTGlzdGEgfSBmcm9tICcuL2xpc3RhLmpzJyAgXHJcblxyXG5leHBvcnQgY2xhc3MgTmFtZXMgZXh0ZW5kcyBQYWdlXHJcblxyXG5cdGNvbnN0cnVjdG9yIDogLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdEBidXR0b25zLm4uYWN0aXZlID0gZmFsc2VcclxuXHRcdEBidXR0b25zLkFycm93TGVmdCAgPSBuZXcgQnV0dG9uICcnLCAnJywgKCkgPT4gZy5zZXRTdGF0ZSBnLlRBQkxFU1xyXG5cdFx0QGJ1dHRvbnMuQXJyb3dSaWdodCA9IG5ldyBCdXR0b24gJycsICcnLCAoKSA9PiBnLnNldFN0YXRlIGcuQUNUSVZFXHJcblxyXG5cdHNldExpc3RhIDogLT5cclxuXHRcdEBsaXN0YSA9IG5ldyBMaXN0YSBAdC5wbGF5ZXJzQnlOYW1lLCBcIlRhYmxlIE5hbWVcIiwgQGJ1dHRvbnMsIChwKSA9PlxyXG5cdFx0XHRyID0gQHQucm91bmQgLSAxXHJcblx0XHRcdGlmIHAuYWN0aXZlIGFuZCBnLkJZRSAhPSBfLmxhc3QgcC5vcHBcclxuXHRcdFx0XHRzID0gXCIje3N0cigxICsgcC5jaGFpciAvLyAyKS5wYWRTdGFydCgzKX0gI3tnLlJJTkdTW3AuY29sW3JdWzBdXX0gXCJcclxuXHRcdFx0ZWxzZSBpZiBub3QgcC5hY3RpdmVcclxuXHRcdFx0XHRzID0gXCIgICBQICBcIlxyXG5cdFx0XHRlbHNlIFxyXG5cdFx0XHRcdHMgPSBcIiAgQllFIFwiXHJcblx0XHRcdHMgKyBnLnR4dFQgcC5uYW1lLCAyNSwgIExFRlRcclxuXHRcdHNwcmVhZCBAYnV0dG9ucywgMTAsIEB5LCBAaFxyXG5cclxuXHRtb3VzZVdoZWVsICAgOiAoZXZlbnQgKS0+IEBsaXN0YS5tb3VzZVdoZWVsIGV2ZW50XHJcblx0bW91c2VQcmVzc2VkIDogKGV2ZW50KSAtPiBAbGlzdGEubW91c2VQcmVzc2VkIGV2ZW50XHJcblx0a2V5UHJlc3NlZCAgIDogKGV2ZW50KSAtPiBAYnV0dG9uc1trZXldLmNsaWNrKClcclxuXHJcblx0bWFrZSA6IChyZXMsaGVhZGVyLHBsYXllcnNCeU5hbWUpIC0+XHJcblx0XHRyZXMucHVzaCBcIk5BTUVTXCIgKyBoZWFkZXJcclxuXHRcdHJlcy5wdXNoIFwiXCJcclxuXHRcdHIgPSBAdC5yb3VuZFxyXG5cdFx0Zm9yIHBsYXllcixpIGluIHBsYXllcnNCeU5hbWVcclxuXHRcdFx0aWYgaSAlIEB0LnBwcCA9PSAwIHRoZW4gcmVzLnB1c2ggXCJUYWJsZSBOYW1lXCJcclxuXHRcdFx0aWYgcGxheWVyLmFjdGl2ZSBhbmQgZy5CWUUgIT0gcGxheWVyLm9wcFtyXVxyXG5cdFx0XHRcdHJlcy5wdXNoIFwiI3tzdHIoMSArIHBsYXllci5jaGFpciAvLyAyKS5wYWRTdGFydCgzKX0gI3tnLlJJTkdTW3BsYXllci5jb2xbcl1bMF1dfSAje3BsYXllci5uYW1lfVwiXHJcblx0XHRcdGVsc2UgaWYgbm90IHBsYXllci5hY3RpdmVcclxuXHRcdFx0XHRyZXMucHVzaCBcIiAgIFAgICN7cGxheWVyLm5hbWV9XCJcclxuXHRcdFx0ZWxzZSBcclxuXHRcdFx0XHRyZXMucHVzaCBcIiAgQllFICN7cGxheWVyLm5hbWV9XCJcclxuXHRcdFx0aWYgaSAlIEB0LnBwcCA9PSBAdC5wcHAtMSB0aGVuIHJlcy5wdXNoIFwiXFxmXCJcclxuXHRcdHJlcy5wdXNoIFwiXFxmXCJcclxuXHJcblx0ZHJhdyA6IC0+XHJcblx0XHRmaWxsICd3aGl0ZSdcclxuXHRcdEBzaG93SGVhZGVyIEB0LnJvdW5kXHJcblx0XHRAbGlzdGEuZHJhdygpXHJcblx0XHRmb3Iga2V5LGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG5cdFx0XHRidXR0b24uZHJhdygpIl19
//# sourceURL=c:\github\ELO-Pairings\coffee\page_names.coffee