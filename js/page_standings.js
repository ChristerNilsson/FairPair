// Generated by CoffeeScript 2.7.0
var boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

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

export var Standings = class Standings extends Page {
  constructor() {
    super();
    this.mouseMoved = this.mouseMoved.bind(this);
    this.t = g.tournament;
    this.buttons.ArrowLeft = new Button('', '', () => {
      return g.setState(g.ACTIVE);
    });
    this.buttons.ArrowRight = new Button('', '', () => {
      return g.setState(g.TABLES);
    });
    this.buttons.s.active = false;
  }

  setLista() {
    var header, rheader;
    rheader = _.map(range(1, this.t.round + 1), function(i) {
      return ` ${i % 10} `;
    });
    rheader = rheader.join('');
    header = "";
    header += g.txtT("Pos", 3, RIGHT);
    header += ' ' + g.txtT("Id", 3, RIGHT);
    header += ' ' + g.txtT("Elo", 4, RIGHT);
    header += ' ' + g.txtT("Name", 25, LEFT);
    header += '' + g.txtT(rheader, 3 * this.round, LEFT);
    header += ' ' + g.txtT("Perf.rat", 8, RIGHT);
    this.playersByPerformance = _.clone(this.t.playersByID.slice(0, g.N));
    this.playersByPerformance = this.playersByPerformance.sort((a, b) => {
      if (b.change(this.t.round + 1) === a.change(this.t.round + 1)) {
        return b.elo - a.elo;
      } else {
        return b.change(this.t.round + 1) - a.change(this.t.round + 1);
      }
    });
    this.lista = new Lista(this.playersByPerformance, header, this.buttons, (p, index, pos) => { // returnera strängen som ska skrivas ut. Dessutom ritas lightbulbs här.
      var j, len, r, ref, s, value, x;
      this.y_bulb = (5 + index) * g.ZOOM[g.state];
      textAlign(LEFT);
      fill('black');
      s = "";
      s += g.txtT((1 + pos).toString(), 3, RIGHT);
      s += ' ' + g.txtT((1 + p.id).toString(), 3, RIGHT);
      s += ' ' + g.txtT(p.elo.toString(), 4, RIGHT);
      s += ' ' + g.txtT(p.name, 25, LEFT);
      s += ' ' + g.txtT('', 3 * (this.t.round - 1), CENTER);
      value = p.change(this.t.round);
      if (value < 1) {
        s += ' ' + g.txtT("-inf", 7, RIGHT);
      } else if (value > 3999) {
        s += ' ' + g.txtT("inf", 7, RIGHT);
      } else {
        s += ' ' + g.txtT(p.change(this.t.round).toFixed(1), 7, RIGHT);
      }
      ref = range(g.tournament.round - 1);
      //- 1
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        x = g.ZOOM[g.state] * (24.2 + 1.8 * r);
        this.lightbulb(p.id, p.col[r], x, this.y_bulb, p.res.slice(r, r + 1), p.opp[r]);
      }
      return s;
    });
    this.lista.paintYellowRow = false;
    return spread(this.buttons, 10, this.y, this.h);
  }

  mouseMoved() {
    var b, chg, iy, pa, pb, r, s;
    boundMethodCheck(this, Standings);
    r = round((mouseX / g.ZOOM[g.state] - 24.2) / 1.8);
    iy = this.lista.offset + round(mouseY / g.ZOOM[g.state] - 5);
    if ((0 <= iy && iy < this.playersByPerformance.length) && (0 <= r && r < g.tournament.round - 1)) {
      pa = this.playersByPerformance[iy];
      b = pa.opp[r];
      if (b === g.BYE) {
        s = "";
        s += g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT('', 4, RIGHT);
        s += ' ' + g.txtT('has a bye', 25, LEFT);
        s += ' ' + g.txtT('', 3 * (this.t.round - 1), LEFT);
        // g.help = "#{pa.elo} #{pa.name} has a bye                   #{pa.elo.toFixed(1)}" # => chg = #{g.K/2}"
        s += ' ' + g.txtT(`${pa.elo.toFixed(1)}`, 7, RIGHT);
        g.help = s;
      }
      if (b === g.PAUSE) {
        s = "";
        s += g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT('', 4, RIGHT);
        s += ' ' + g.txtT('has a pause', 25, LEFT);
        s += ' ' + g.txtT('', 3 * (this.t.round - 1), LEFT);
        // g.help = "#{pa.elo} #{pa.name} has a bye                   #{pa.elo.toFixed(1)}" # => chg = #{g.K/2}"
        s += ' ' + g.txtT("0.0", 7, RIGHT);
        g.help = s;
      }
      // 	s += "#{pa.elo} #{pa.name} has a pause                    0.0" # => chg = 0"

      // g.help = s
      if (b >= 0) {
        pb = this.t.playersByID[b];
        chg = 1234; //pa.calcRound r
        s = "";
        s += g.txtT('', 3, RIGHT);
        s += ' ' + g.txtT((1 + pb.id).toString(), 3, RIGHT);
        s += ' ' + g.txtT(pb.elo.toString(), 4, RIGHT);
        s += ' ' + g.txtT(pb.name, 25, LEFT);
        s += ' ' + g.txtT('', 3 * (this.t.round - 1), LEFT);
        s += ' ' + g.txtT(chg.toFixed(1), 7, RIGHT);
        if (pa.res[r] === '1') {
          s += ` = 0.5 * (${g.txtT(pb.elo, 7, RIGHT)})`;
        }
        if (pa.res[r] === '2') {
          s += ` = ${g.txtT(pb.elo, 7, RIGHT)}`;
        }
        return g.help = pa.explanation(r);
      }
    } else {
      return g.help = "";
    }
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

  draw() {
    var button, key, ref;
    fill('white');
    this.showHeader(this.t.round - 1);
    this.lista.draw();
    ref = this.buttons;
    for (key in ref) {
      button = ref[key];
      button.draw();
    }
    textAlign(LEFT);
    return text(g.help, 10, 3 * g.ZOOM[g.state]);
  }

  show(s, x, y, bg, fg) {
    fill(bg);
    rect(x, y, 1.6 * g.ZOOM[g.state], 0.9 * g.ZOOM[g.state]);
    fill(fg);
    return this.txt(s, x, y + 1, CENTER);
  }

  lightbulb(id, color, x, y, result, opponent) {
    var s;
    push();
    rectMode(CENTER);
    s = 1 + opponent;
    if (opponent === g.PAUSE) {
      this.show(" P ", x, y, "gray", 'yellow');
    }
    if (opponent === g.BYE) {
      this.show("BYE", x, y, "green", 'yellow');
    }
    if (opponent >= 0) {
      result = '012'.indexOf(result);
      this.show(1 + opponent, x, y, 'red gray green'.split(' ')[result], {
        b: 'black',
        ' ': 'yellow',
        w: 'white'
      }[color]);
    }
    return pop();
  }

  make(res, header) {
    var i, j, k, l, len, len1, len2, p, player, r, ref, ref1, ref2, s, value;
    if (this.t.pairs.length === 0) {
      res.push("This ROUND can't be paired! (Too many rounds)");
    }
    res.push("STANDINGS" + header);
    res.push("");
    header = "";
    header += g.txtT("Pos", 3, RIGHT);
    header += ' ' + g.txtT('Id', 3, RIGHT);
    header += ' ' + g.txtT("Elo0", 4, RIGHT);
    header += ' ' + g.txtT("Name", 25, LEFT);
    ref = range(this.t.round);
    for (j = 0, len = ref.length; j < len; j++) {
      r = ref[j];
      header += g.txtT(`${r + 1}`, 6, RIGHT);
    }
    header += ' ' + g.txtT("Perf.rat", 8, RIGHT);
    ref1 = this.playersByPerformance;
    for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
      player = ref1[i];
      if (i % this.t.ppp === 0) {
        res.push(header);
      }
      s = "";
      s += g.txtT((1 + i).toString(), 3, RIGHT);
      s += ' ' + g.txtT((1 + player.id).toString(), 3, RIGHT);
      s += ' ' + g.txtT(player.elo.toString(), 4, RIGHT);
      s += ' ' + g.txtT(player.name, 25, LEFT);
      s += ' ';
      ref2 = range(this.t.round);
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        r = ref2[l];
        if (player.opp[r] === -2) {
          s += '    P ';
        }
        if (player.opp[r] === -1) {
          s += '   BYE';
        }
        if (player.opp[r] >= 0) {
          s += g.txtT(`${1 + player.opp[r]}${g.RINGS[player.col[r][0]]}${"0½1"[player.res[r]]}`, 6, RIGHT);
        }
      }
      p = player;
      value = p.change(this.t.round);
      if (value < 1) {
        s += ' ' + g.txtT("-inf", 7, RIGHT);
      } else if (value > 3999) {
        s += ' ' + g.txtT("inf", 7, RIGHT);
      } else {
        s += ' ' + g.txtT(p.change(this.t.round + 1).toFixed(1), 7, RIGHT);
      }
      // s += ' ' + g.txtT player.change(@t.round+1).toFixed(1),  7,  RIGHT
      // s += ' ' + g.txtT player.perChg(@t.round+1).toFixed(1),  7,  RIGHT
      res.push(s);
      if (i % this.t.ppp === this.t.ppp - 1) {
        res.push("\f");
      }
    }
    return res.push("\f");
  }

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZV9zdGFuZGluZ3MuanMiLCJzb3VyY2VSb290IjoiLi5cXCIsInNvdXJjZXMiOlsiY29mZmVlXFxwYWdlX3N0YW5kaW5ncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsT0FBQTtFQUFTLENBQVQ7RUFBVyxLQUFYO0VBQWlCLEtBQWpCO0VBQXVCLE1BQXZCO0VBQThCLE1BQTlCO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsSUFBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7RUFBZ0IsTUFBaEI7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxLQUFUO0NBQUEsTUFBQTs7QUFFQSxPQUFBLElBQWEsWUFBTixNQUFBLFVBQUEsUUFBd0IsS0FBeEI7RUFFTixXQUFjLENBQUEsQ0FBQTs7UUE4Q2QsQ0FBQSxpQkFBQSxDQUFBO0lBNUNDLElBQUMsQ0FBQSxDQUFELEdBQUssQ0FBQyxDQUFDO0lBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQUEsQ0FBQSxHQUFBO2FBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUMsTUFBYjtJQUFOLENBQW5CO0lBQ3RCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxHQUFzQixJQUFJLE1BQUosQ0FBVyxFQUFYLEVBQWUsRUFBZixFQUFtQixDQUFBLENBQUEsR0FBQTthQUFNLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQyxDQUFDLE1BQWI7SUFBTixDQUFuQjtJQUN0QixJQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFYLEdBQW9CO0VBTFA7O0VBT2QsUUFBVyxDQUFBLENBQUE7QUFFWixRQUFBLE1BQUEsRUFBQTtJQUFFLE9BQUEsR0FBVSxDQUFDLENBQUMsR0FBRixDQUFNLEtBQUEsQ0FBTSxDQUFOLEVBQVEsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILEdBQVMsQ0FBakIsQ0FBTixFQUEyQixRQUFBLENBQUMsQ0FBRCxDQUFBO2FBQU8sRUFBQSxDQUFBLENBQUksQ0FBQSxHQUFFLEVBQU4sRUFBQTtJQUFQLENBQTNCO0lBQ1YsT0FBQSxHQUFVLE9BQU8sQ0FBQyxJQUFSLENBQWEsRUFBYjtJQUNWLE1BQUEsR0FBUztJQUNULE1BQUEsSUFBZ0IsQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFQLEVBQXVCLENBQXZCLEVBQTBCLEtBQTFCO0lBQ2hCLE1BQUEsSUFBVSxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFQLEVBQXVCLENBQXZCLEVBQTBCLEtBQTFCO0lBQ2hCLE1BQUEsSUFBVSxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFQLEVBQXVCLENBQXZCLEVBQTBCLEtBQTFCO0lBQ2hCLE1BQUEsSUFBVSxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxNQUFQLEVBQXNCLEVBQXRCLEVBQTBCLElBQTFCO0lBQ2hCLE1BQUEsSUFBVSxFQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxPQUFQLEVBQWdCLENBQUEsR0FBRSxJQUFDLENBQUEsS0FBbkIsRUFBMEIsSUFBMUI7SUFDaEIsTUFBQSxJQUFVLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBRixDQUFPLFVBQVAsRUFBd0IsQ0FBeEIsRUFBMkIsS0FBM0I7SUFFaEIsSUFBQyxDQUFBLG9CQUFELEdBQXdCLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBQyxDQUFBLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBZixDQUFxQixDQUFyQixFQUF1QixDQUFDLENBQUMsQ0FBekIsQ0FBUjtJQUN4QixJQUFDLENBQUEsb0JBQUQsR0FBd0IsSUFBQyxDQUFBLG9CQUFvQixDQUFDLElBQXRCLENBQTJCLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBQSxHQUFBO01BQ2xELElBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUgsR0FBUyxDQUFsQixDQUFBLEtBQXdCLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILEdBQVMsQ0FBbEIsQ0FBM0I7ZUFBcUQsQ0FBQyxDQUFDLEdBQUYsR0FBUSxDQUFDLENBQUMsSUFBL0Q7T0FBQSxNQUFBO2VBQ0ssQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUgsR0FBUyxDQUFsQixDQUFBLEdBQXVCLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILEdBQVMsQ0FBbEIsRUFENUI7O0lBRGtELENBQTNCO0lBSXhCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxLQUFKLENBQVUsSUFBQyxDQUFBLG9CQUFYLEVBQWlDLE1BQWpDLEVBQXlDLElBQUMsQ0FBQSxPQUExQyxFQUFtRCxDQUFDLENBQUQsRUFBRyxLQUFILEVBQVMsR0FBVCxDQUFBLEdBQUEsRUFBQTtBQUM5RCxVQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBO01BQUcsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQUFDLENBQUEsR0FBSSxLQUFMLENBQUEsR0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFIO01BQzlCLFNBQUEsQ0FBVSxJQUFWO01BQ0EsSUFBQSxDQUFLLE9BQUw7TUFDQSxDQUFBLEdBQUk7TUFDSixDQUFBLElBQVcsQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFDLENBQUEsR0FBRSxHQUFILENBQU8sQ0FBQyxRQUFSLENBQUEsQ0FBUCxFQUErQixDQUEvQixFQUFtQyxLQUFuQztNQUNYLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFDLENBQUEsR0FBRSxDQUFDLENBQUMsRUFBTCxDQUFRLENBQUMsUUFBVCxDQUFBLENBQVAsRUFBK0IsQ0FBL0IsRUFBbUMsS0FBbkM7TUFDWCxDQUFBLElBQUssR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFOLENBQUEsQ0FBUCxFQUErQixDQUEvQixFQUFtQyxLQUFuQztNQUNYLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFDLENBQUMsSUFBVCxFQUE4QixFQUE5QixFQUFtQyxJQUFuQztNQUNYLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLEVBQWdCLENBQUEsR0FBSSxDQUFDLElBQUMsQ0FBQSxDQUFDLENBQUMsS0FBSCxHQUFTLENBQVYsQ0FBcEIsRUFBbUMsTUFBbkM7TUFDWCxLQUFBLEdBQVEsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQVo7TUFDUixJQUFHLEtBQUEsR0FBUSxDQUFYO1FBQWtCLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxNQUFQLEVBQWUsQ0FBZixFQUFrQixLQUFsQixFQUE3QjtPQUFBLE1BQ0ssSUFBRyxLQUFBLEdBQVEsSUFBWDtRQUFxQixDQUFBLElBQUssR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBUCxFQUFjLENBQWQsRUFBaUIsS0FBakIsRUFBaEM7T0FBQSxNQUFBO1FBQ0EsQ0FBQSxJQUFLLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBRixDQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFaLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsQ0FBM0IsQ0FBUCxFQUFzQyxDQUF0QyxFQUF5QyxLQUF6QyxFQURYOztBQUdMOztNQUFBLEtBQUEscUNBQUE7O1FBQ0MsQ0FBQSxHQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBTixHQUFrQixDQUFDLElBQUEsR0FBTyxHQUFBLEdBQUksQ0FBWjtRQUN0QixJQUFDLENBQUEsU0FBRCxDQUFXLENBQUMsQ0FBQyxFQUFiLEVBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRCxDQUF0QixFQUEyQixDQUEzQixFQUE4QixJQUFDLENBQUEsTUFBL0IsRUFBdUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFOLENBQVksQ0FBWixFQUFjLENBQUEsR0FBRSxDQUFoQixDQUF2QyxFQUEyRCxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUQsQ0FBaEU7TUFGRDthQUdBO0lBbEIyRCxDQUFuRDtJQW1CVCxJQUFDLENBQUEsS0FBSyxDQUFDLGNBQVAsR0FBd0I7V0FDeEIsTUFBQSxDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLEVBQWpCLEVBQXFCLElBQUMsQ0FBQSxDQUF0QixFQUF5QixJQUFDLENBQUEsQ0FBMUI7RUFyQ1U7O0VBdUNYLFVBQWEsQ0FBQSxDQUFBO0FBQ2QsUUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLENBQUEsRUFBQTsyQkFqRGE7SUFpRFgsQ0FBQSxHQUFJLEtBQUEsQ0FBTyxDQUFDLE1BQUEsR0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFILENBQWYsR0FBMkIsSUFBNUIsQ0FBQSxHQUFvQyxHQUEzQztJQUNKLEVBQUEsR0FBSyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBZ0IsS0FBQSxDQUFNLE1BQUEsR0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFILENBQWYsR0FBMkIsQ0FBakM7SUFDckIsSUFBRyxDQUFBLENBQUEsSUFBSyxFQUFMLElBQUssRUFBTCxHQUFVLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxNQUFoQyxDQUFBLElBQTJDLENBQUEsQ0FBQSxJQUFLLENBQUwsSUFBSyxDQUFMLEdBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFiLEdBQXFCLENBQTlCLENBQTlDO01BQ0MsRUFBQSxHQUFLLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxFQUFEO01BQzFCLENBQUEsR0FBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUQ7TUFFVixJQUFHLENBQUEsS0FBSyxDQUFDLENBQUMsR0FBVjtRQUNDLENBQUEsR0FBSTtRQUNKLENBQUEsSUFBVyxDQUFDLENBQUMsSUFBRixDQUFPLEVBQVAsRUFBZ0MsQ0FBaEMsRUFBb0MsS0FBcEM7UUFDWCxDQUFBLElBQUssR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxFQUFnQyxDQUFoQyxFQUFvQyxLQUFwQztRQUNYLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLEVBQWdDLENBQWhDLEVBQW9DLEtBQXBDO1FBQ1gsQ0FBQSxJQUFLLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBRixDQUFPLFdBQVAsRUFBK0IsRUFBL0IsRUFBb0MsSUFBcEM7UUFDWCxDQUFBLElBQUssR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxFQUFpQixDQUFBLEdBQUksQ0FBQyxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUgsR0FBUyxDQUFWLENBQXJCLEVBQW9DLElBQXBDLEVBTGY7O1FBT0ksQ0FBQSxJQUFLLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBRixDQUFPLENBQUEsQ0FBQSxDQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBUCxDQUFlLENBQWYsQ0FBSCxDQUFBLENBQVAsRUFBc0MsQ0FBdEMsRUFBeUMsS0FBekM7UUFDWCxDQUFDLENBQUMsSUFBRixHQUFTLEVBVFY7O01BV0EsSUFBRyxDQUFBLEtBQUssQ0FBQyxDQUFDLEtBQVY7UUFDQyxDQUFBLEdBQUk7UUFDSixDQUFBLElBQVcsQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLEVBQWdDLENBQWhDLEVBQW9DLEtBQXBDO1FBQ1gsQ0FBQSxJQUFLLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBRixDQUFPLEVBQVAsRUFBZ0MsQ0FBaEMsRUFBb0MsS0FBcEM7UUFDWCxDQUFBLElBQUssR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxFQUFnQyxDQUFoQyxFQUFvQyxLQUFwQztRQUNYLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxhQUFQLEVBQStCLEVBQS9CLEVBQW9DLElBQXBDO1FBQ1gsQ0FBQSxJQUFLLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBRixDQUFPLEVBQVAsRUFBaUIsQ0FBQSxHQUFJLENBQUMsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILEdBQVMsQ0FBVixDQUFyQixFQUFvQyxJQUFwQyxFQUxmOztRQU9JLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFQLEVBQXNDLENBQXRDLEVBQXlDLEtBQXpDO1FBQ1gsQ0FBQyxDQUFDLElBQUYsR0FBUyxFQVRWO09BZEg7Ozs7TUE2QkcsSUFBRyxDQUFBLElBQUssQ0FBUjtRQUNDLEVBQUEsR0FBSyxJQUFDLENBQUEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFEO1FBQ25CLEdBQUEsR0FBTSxLQURWO1FBR0ksQ0FBQSxHQUFJO1FBQ0osQ0FBQSxJQUFXLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxFQUFnQyxDQUFoQyxFQUFvQyxLQUFwQztRQUNYLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFDLENBQUEsR0FBRSxFQUFFLENBQUMsRUFBTixDQUFTLENBQUMsUUFBVixDQUFBLENBQVAsRUFBZ0MsQ0FBaEMsRUFBb0MsS0FBcEM7UUFDWCxDQUFBLElBQUssR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFQLENBQUEsQ0FBUCxFQUFnQyxDQUFoQyxFQUFvQyxLQUFwQztRQUNYLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFFLENBQUMsSUFBVixFQUErQixFQUEvQixFQUFvQyxJQUFwQztRQUNYLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLEVBQWlCLENBQUEsR0FBSSxDQUFDLElBQUMsQ0FBQSxDQUFDLENBQUMsS0FBSCxHQUFTLENBQVYsQ0FBckIsRUFBb0MsSUFBcEM7UUFDWCxDQUFBLElBQUssR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sR0FBRyxDQUFDLE9BQUosQ0FBWSxDQUFaLENBQVAsRUFBdUIsQ0FBdkIsRUFBMkIsS0FBM0I7UUFDWCxJQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBRCxDQUFOLEtBQWEsR0FBaEI7VUFBeUIsQ0FBQSxJQUFLLENBQUEsVUFBQSxDQUFBLENBQWEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFFLENBQUMsR0FBVixFQUFlLENBQWYsRUFBa0IsS0FBbEIsQ0FBYixDQUFBLENBQUEsRUFBOUI7O1FBQ0EsSUFBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUQsQ0FBTixLQUFhLEdBQWhCO1VBQXlCLENBQUEsSUFBSyxDQUFBLEdBQUEsQ0FBQSxDQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBRSxDQUFDLEdBQVYsRUFBZSxDQUFmLEVBQWtCLEtBQWxCLENBQU4sQ0FBQSxFQUE5Qjs7ZUFFQSxDQUFDLENBQUMsSUFBRixHQUFTLEVBQUUsQ0FBQyxXQUFILENBQWUsQ0FBZixFQWRWO09BOUJEO0tBQUEsTUFBQTthQThDQyxDQUFDLENBQUMsSUFBRixHQUFTLEdBOUNWOztFQUhZOztFQW1EYixVQUFlLENBQUMsS0FBRCxDQUFBO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLENBQWtCLEtBQWxCO0VBQVg7O0VBQ2YsWUFBZSxDQUFDLEtBQUQsQ0FBQTtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsWUFBUCxDQUFvQixLQUFwQjtFQUFYOztFQUNmLFVBQWUsQ0FBQyxLQUFELENBQUE7V0FBVyxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQUQsQ0FBSyxDQUFDLEtBQWQsQ0FBQTtFQUFYOztFQUVmLElBQU8sQ0FBQSxDQUFBO0FBQ1IsUUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUUsSUFBQSxDQUFLLE9BQUw7SUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUMsQ0FBQSxDQUFDLENBQUMsS0FBSCxHQUFTLENBQXJCO0lBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7QUFDQTtJQUFBLEtBQUEsVUFBQTs7TUFDQyxNQUFNLENBQUMsSUFBUCxDQUFBO0lBREQ7SUFFQSxTQUFBLENBQVUsSUFBVjtXQUNBLElBQUEsQ0FBSyxDQUFDLENBQUMsSUFBUCxFQUFhLEVBQWIsRUFBaUIsQ0FBQSxHQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBekI7RUFQTTs7RUFTUCxJQUFPLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sRUFBUCxFQUFVLEVBQVYsQ0FBQTtJQUNOLElBQUEsQ0FBSyxFQUFMO0lBQ0EsSUFBQSxDQUFLLENBQUwsRUFBUSxDQUFSLEVBQVcsR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBdkIsRUFBa0MsR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUgsQ0FBOUM7SUFDQSxJQUFBLENBQUssRUFBTDtXQUNBLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBTCxFQUFRLENBQVIsRUFBVyxDQUFBLEdBQUUsQ0FBYixFQUFpQixNQUFqQjtFQUpNOztFQU1QLFNBQVksQ0FBQyxFQUFELEVBQUssS0FBTCxFQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLE1BQWxCLEVBQTBCLFFBQTFCLENBQUE7QUFDYixRQUFBO0lBQUUsSUFBQSxDQUFBO0lBQ0EsUUFBQSxDQUFVLE1BQVY7SUFDQSxDQUFBLEdBQUksQ0FBQSxHQUFJO0lBQ1IsSUFBRyxRQUFBLEtBQVksQ0FBQyxDQUFDLEtBQWpCO01BQTRCLElBQUMsQ0FBQSxJQUFELENBQU0sS0FBTixFQUFZLENBQVosRUFBYyxDQUFkLEVBQWdCLE1BQWhCLEVBQXVCLFFBQXZCLEVBQTVCOztJQUNBLElBQUcsUUFBQSxLQUFZLENBQUMsQ0FBQyxHQUFqQjtNQUE0QixJQUFDLENBQUEsSUFBRCxDQUFNLEtBQU4sRUFBWSxDQUFaLEVBQWMsQ0FBZCxFQUFnQixPQUFoQixFQUF3QixRQUF4QixFQUE1Qjs7SUFDQSxJQUFHLFFBQUEsSUFBWSxDQUFmO01BQ0MsTUFBQSxHQUFTLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBZDtNQUNULElBQUMsQ0FBQSxJQUFELENBQU0sQ0FBQSxHQUFFLFFBQVIsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsZ0JBQWdCLENBQUMsS0FBakIsQ0FBdUIsR0FBdkIsQ0FBMkIsQ0FBQyxNQUFELENBQW5ELEVBQTZEO1FBQUMsQ0FBQSxFQUFFLE9BQUg7UUFBWSxHQUFBLEVBQUksUUFBaEI7UUFBMEIsQ0FBQSxFQUFFO01BQTVCLENBQW9DLENBQUMsS0FBRCxDQUFqRyxFQUZEOztXQUdBLEdBQUEsQ0FBQTtFQVRXOztFQVdaLElBQU8sQ0FBQyxHQUFELEVBQUssTUFBTCxDQUFBO0FBQ1IsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBO0lBQUUsSUFBRyxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFULEtBQW1CLENBQXRCO01BQTZCLEdBQUcsQ0FBQyxJQUFKLENBQVMsK0NBQVQsRUFBN0I7O0lBRUEsR0FBRyxDQUFDLElBQUosQ0FBUyxXQUFBLEdBQWMsTUFBdkI7SUFDQSxHQUFHLENBQUMsSUFBSixDQUFTLEVBQVQ7SUFFQSxNQUFBLEdBQVM7SUFDVCxNQUFBLElBQWdCLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBUCxFQUFnQixDQUFoQixFQUFvQixLQUFwQjtJQUNoQixNQUFBLElBQVUsR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBUCxFQUFnQixDQUFoQixFQUFvQixLQUFwQjtJQUNoQixNQUFBLElBQVUsR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sTUFBUCxFQUFnQixDQUFoQixFQUFvQixLQUFwQjtJQUNoQixNQUFBLElBQVUsR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sTUFBUCxFQUFlLEVBQWYsRUFBb0IsSUFBcEI7QUFDaEI7SUFBQSxLQUFBLHFDQUFBOztNQUNDLE1BQUEsSUFBVSxDQUFDLENBQUMsSUFBRixDQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsR0FBRSxDQUFMLENBQUEsQ0FBUCxFQUFrQixDQUFsQixFQUFxQixLQUFyQjtJQURYO0lBRUEsTUFBQSxJQUFVLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBRixDQUFPLFVBQVAsRUFBbUIsQ0FBbkIsRUFBc0IsS0FBdEI7QUFFaEI7SUFBQSxLQUFBLGdEQUFBOztNQUNDLElBQUcsQ0FBQSxHQUFJLElBQUMsQ0FBQSxDQUFDLENBQUMsR0FBUCxLQUFjLENBQWpCO1FBQXdCLEdBQUcsQ0FBQyxJQUFKLENBQVMsTUFBVCxFQUF4Qjs7TUFDQSxDQUFBLEdBQUk7TUFDSixDQUFBLElBQVcsQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFDLENBQUEsR0FBRSxDQUFILENBQUssQ0FBQyxRQUFOLENBQUEsQ0FBUCxFQUFrQyxDQUFsQyxFQUFzQyxLQUF0QztNQUNYLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFDLENBQUEsR0FBRSxNQUFNLENBQUMsRUFBVixDQUFhLENBQUMsUUFBZCxDQUFBLENBQVAsRUFBa0MsQ0FBbEMsRUFBc0MsS0FBdEM7TUFDWCxDQUFBLElBQUssR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFYLENBQUEsQ0FBUCxFQUFpQyxDQUFqQyxFQUFxQyxLQUFyQztNQUNYLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxNQUFNLENBQUMsSUFBZCxFQUFpQyxFQUFqQyxFQUFzQyxJQUF0QztNQUNYLENBQUEsSUFBSztBQUNMO01BQUEsS0FBQSx3Q0FBQTs7UUFDQyxJQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBRCxDQUFWLEtBQWlCLENBQUMsQ0FBckI7VUFBNEIsQ0FBQSxJQUFLLFNBQWpDOztRQUNBLElBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFELENBQVYsS0FBaUIsQ0FBQyxDQUFyQjtVQUE0QixDQUFBLElBQUssU0FBakM7O1FBQ0EsSUFBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUQsQ0FBVixJQUFpQixDQUFwQjtVQUNDLENBQUEsSUFBSyxDQUFDLENBQUMsSUFBRixDQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsR0FBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUQsQ0FBZixDQUFBLENBQUEsQ0FBcUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUQsQ0FBRyxDQUFDLENBQUQsQ0FBZCxDQUE1QixDQUFBLENBQUEsQ0FBaUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBRCxDQUFYLENBQXRELENBQUEsQ0FBUCxFQUFnRixDQUFoRixFQUFvRixLQUFwRixFQUROOztNQUhEO01BTUEsQ0FBQSxHQUFJO01BQ0osS0FBQSxHQUFRLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFaO01BQ1IsSUFBRyxLQUFBLEdBQVEsQ0FBWDtRQUFrQixDQUFBLElBQUssR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sTUFBUCxFQUFlLENBQWYsRUFBa0IsS0FBbEIsRUFBN0I7T0FBQSxNQUNLLElBQUcsS0FBQSxHQUFRLElBQVg7UUFBcUIsQ0FBQSxJQUFLLEdBQUEsR0FBTSxDQUFDLENBQUMsSUFBRixDQUFPLEtBQVAsRUFBYyxDQUFkLEVBQWlCLEtBQWpCLEVBQWhDO09BQUEsTUFBQTtRQUNBLENBQUEsSUFBSyxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxDQUFDLENBQUMsS0FBSCxHQUFTLENBQWxCLENBQW9CLENBQUMsT0FBckIsQ0FBNkIsQ0FBN0IsQ0FBUCxFQUF3QyxDQUF4QyxFQUEyQyxLQUEzQyxFQURYO09BaEJSOzs7TUFxQkcsR0FBRyxDQUFDLElBQUosQ0FBUyxDQUFUO01BQ0EsSUFBRyxDQUFBLEdBQUksSUFBQyxDQUFBLENBQUMsQ0FBQyxHQUFQLEtBQWMsSUFBQyxDQUFBLENBQUMsQ0FBQyxHQUFILEdBQU8sQ0FBeEI7UUFBK0IsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFULEVBQS9COztJQXZCRDtXQXdCQSxHQUFHLENBQUMsSUFBSixDQUFTLElBQVQ7RUF2Q007O0FBaklEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZyxwcmludCxyYW5nZSxzY2FsZXgsc2NhbGV5IH0gZnJvbSAnLi9nbG9iYWxzLmpzJyBcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcGFnZS5qcycgXHJcbmltcG9ydCB7IEJ1dHRvbixzcHJlYWQgfSBmcm9tICcuL2J1dHRvbi5qcycgIFxyXG5pbXBvcnQgeyBMaXN0YSB9IGZyb20gJy4vbGlzdGEuanMnIFxyXG5cclxuZXhwb3J0IGNsYXNzIFN0YW5kaW5ncyBleHRlbmRzIFBhZ2VcclxuXHJcblx0Y29uc3RydWN0b3IgOiAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHQgPSBnLnRvdXJuYW1lbnRcclxuXHRcdEBidXR0b25zLkFycm93TGVmdCAgPSBuZXcgQnV0dG9uICcnLCAnJywgKCkgPT4gZy5zZXRTdGF0ZSBnLkFDVElWRVxyXG5cdFx0QGJ1dHRvbnMuQXJyb3dSaWdodCA9IG5ldyBCdXR0b24gJycsICcnLCAoKSA9PiBnLnNldFN0YXRlIGcuVEFCTEVTXHJcblx0XHRAYnV0dG9ucy5zLmFjdGl2ZSA9IGZhbHNlXHJcblxyXG5cdHNldExpc3RhIDogLT5cclxuXHJcblx0XHRyaGVhZGVyID0gXy5tYXAgcmFuZ2UoMSxAdC5yb3VuZCsxKSwgKGkpIC0+IFwiICN7aSUxMH0gXCJcclxuXHRcdHJoZWFkZXIgPSByaGVhZGVyLmpvaW4gJydcclxuXHRcdGhlYWRlciA9IFwiXCJcclxuXHRcdGhlYWRlciArPSAgICAgICBnLnR4dFQgXCJQb3NcIiwgICAgICAgICAgMywgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJJZFwiLCAgICAgICAgICAgMywgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJFbG9cIiwgICAgICAgICAgNCwgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJOYW1lXCIsICAgICAgICAyNSwgTEVGVFxyXG5cdFx0aGVhZGVyICs9ICcnICArIGcudHh0VCByaGVhZGVyLCAzKkByb3VuZCwgTEVGVCBcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJQZXJmLnJhdFwiLCAgICAgIDgsIFJJR0hUXHJcblxyXG5cdFx0QHBsYXllcnNCeVBlcmZvcm1hbmNlID0gXy5jbG9uZSBAdC5wbGF5ZXJzQnlJRC5zbGljZSAwLGcuTlxyXG5cdFx0QHBsYXllcnNCeVBlcmZvcm1hbmNlID0gQHBsYXllcnNCeVBlcmZvcm1hbmNlLnNvcnQgKGEsYikgPT4gXHJcblx0XHRcdGlmIGIuY2hhbmdlKEB0LnJvdW5kKzEpID09IGEuY2hhbmdlKEB0LnJvdW5kKzEpIHRoZW4gYi5lbG8gLSBhLmVsb1xyXG5cdFx0XHRlbHNlIGIuY2hhbmdlKEB0LnJvdW5kKzEpIC0gYS5jaGFuZ2UoQHQucm91bmQrMSlcclxuXHJcblx0XHRAbGlzdGEgPSBuZXcgTGlzdGEgQHBsYXllcnNCeVBlcmZvcm1hbmNlLCBoZWFkZXIsIEBidXR0b25zLCAocCxpbmRleCxwb3MpID0+ICMgcmV0dXJuZXJhIHN0csOkbmdlbiBzb20gc2thIHNrcml2YXMgdXQuIERlc3N1dG9tIHJpdGFzIGxpZ2h0YnVsYnMgaMOkci5cclxuXHRcdFx0QHlfYnVsYiA9ICg1ICsgaW5kZXgpICogZy5aT09NW2cuc3RhdGVdIFxyXG5cdFx0XHR0ZXh0QWxpZ24gTEVGVFxyXG5cdFx0XHRmaWxsICdibGFjaycgXHJcblx0XHRcdHMgPSBcIlwiXHJcblx0XHRcdHMgKz0gICAgICAgZy50eHRUICgxK3BvcykudG9TdHJpbmcoKSwgICAgIDMsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCAoMStwLmlkKS50b1N0cmluZygpLCAgICAzLCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcC5lbG8udG9TdHJpbmcoKSwgICAgICAgNCwgIFJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHAubmFtZSwgICAgICAgICAgICAgICAgMjUsICBMRUZUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgIDMgKiAoQHQucm91bmQtMSksICBDRU5URVJcclxuXHRcdFx0dmFsdWUgPSBwLmNoYW5nZShAdC5yb3VuZClcclxuXHRcdFx0aWYgdmFsdWUgPCAxIHRoZW4gcyArPSAnICcgKyBnLnR4dFQgXCItaW5mXCIsIDcsIFJJR0hUXHJcblx0XHRcdGVsc2UgaWYgdmFsdWUgPiAzOTk5IHRoZW4gcyArPSAnICcgKyBnLnR4dFQgXCJpbmZcIiwgNywgUklHSFRcclxuXHRcdFx0ZWxzZSBzICs9ICcgJyArIGcudHh0VCBwLmNoYW5nZShAdC5yb3VuZCkudG9GaXhlZCgxKSwgNywgUklHSFRcclxuXHRcdFx0XHJcblx0XHRcdGZvciByIGluIHJhbmdlIGcudG91cm5hbWVudC5yb3VuZCAtIDEgIy0gMVxyXG5cdFx0XHRcdHggPSBnLlpPT01bZy5zdGF0ZV0gKiAoMjQuMiArIDEuOCpyKVxyXG5cdFx0XHRcdEBsaWdodGJ1bGIgcC5pZCwgcC5jb2xbcl0sIHgsIEB5X2J1bGIsIHAucmVzLnNsaWNlKHIscisxKSwgcC5vcHBbcl1cclxuXHRcdFx0c1xyXG5cdFx0QGxpc3RhLnBhaW50WWVsbG93Um93ID0gZmFsc2VcclxuXHRcdHNwcmVhZCBAYnV0dG9ucywgMTAsIEB5LCBAaFxyXG5cclxuXHRtb3VzZU1vdmVkIDogPT5cclxuXHRcdHIgPSByb3VuZCAoKG1vdXNlWCAvIGcuWk9PTVtnLnN0YXRlXSAtIDI0LjIpIC8gMS44KVxyXG5cdFx0aXkgPSBAbGlzdGEub2Zmc2V0ICsgcm91bmQgbW91c2VZIC8gZy5aT09NW2cuc3RhdGVdIC0gNVxyXG5cdFx0aWYgMCA8PSBpeSA8IEBwbGF5ZXJzQnlQZXJmb3JtYW5jZS5sZW5ndGggYW5kIDAgPD0gciA8IGcudG91cm5hbWVudC5yb3VuZCAtIDFcclxuXHRcdFx0cGEgPSBAcGxheWVyc0J5UGVyZm9ybWFuY2VbaXldXHJcblx0XHRcdGIgPSBwYS5vcHBbcl1cclxuXHJcblx0XHRcdGlmIGIgPT0gZy5CWUUgXHJcblx0XHRcdFx0cyA9IFwiXCJcclxuXHRcdFx0XHRzICs9ICAgICAgIGcudHh0VCAnJywgICAgICAgICAgICAgICAgICAgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgJycsICAgICAgICAgICAgICAgICAgICAgIDMsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgICAgICAgICAgICAgICAgICA0LCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAnaGFzIGEgYnllJywgICAgICAgICAgICAyNSwgIExFRlRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAnJywgICAgICAgMyAqIChAdC5yb3VuZC0xKSwgIExFRlRcclxuXHRcdFx0XHQjIGcuaGVscCA9IFwiI3twYS5lbG99ICN7cGEubmFtZX0gaGFzIGEgYnllICAgICAgICAgICAgICAgICAgICN7cGEuZWxvLnRvRml4ZWQoMSl9XCIgIyA9PiBjaGcgPSAje2cuSy8yfVwiXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgXCIje3BhLmVsby50b0ZpeGVkKDEpfVwiLCAgICAgICAgNywgUklHSFRcclxuXHRcdFx0XHRnLmhlbHAgPSBzXHJcblxyXG5cdFx0XHRpZiBiID09IGcuUEFVU0VcclxuXHRcdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRcdHMgKz0gICAgICAgZy50eHRUICcnLCAgICAgICAgICAgICAgICAgICAgICAzLCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAnJywgICAgICAgICAgICAgICAgICAgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgJycsICAgICAgICAgICAgICAgICAgICAgIDQsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICdoYXMgYSBwYXVzZScsICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgICAzICogKEB0LnJvdW5kLTEpLCAgTEVGVFxyXG5cdFx0XHRcdCMgZy5oZWxwID0gXCIje3BhLmVsb30gI3twYS5uYW1lfSBoYXMgYSBieWUgICAgICAgICAgICAgICAgICAgI3twYS5lbG8udG9GaXhlZCgxKX1cIiAjID0+IGNoZyA9ICN7Zy5LLzJ9XCJcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCBcIjAuMFwiLCAgICAgICAgICAgICAgICAgICAgICAgICA3LCBSSUdIVFxyXG5cdFx0XHRcdGcuaGVscCA9IHNcclxuXHJcblx0XHRcdFx0IyBcdHMgKz0gXCIje3BhLmVsb30gI3twYS5uYW1lfSBoYXMgYSBwYXVzZSAgICAgICAgICAgICAgICAgICAgMC4wXCIgIyA9PiBjaGcgPSAwXCJcclxuXHJcblx0XHRcdFx0IyBnLmhlbHAgPSBzXHJcblxyXG5cdFx0XHRpZiBiID49IDBcdFx0XHRcdFxyXG5cdFx0XHRcdHBiID0gQHQucGxheWVyc0J5SURbYl1cclxuXHRcdFx0XHRjaGcgPSAxMjM0ICNwYS5jYWxjUm91bmQgclxyXG5cclxuXHRcdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRcdHMgKz0gICAgICAgZy50eHRUICcnLCAgICAgICAgICAgICAgICAgICAgICAzLCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAoMStwYi5pZCkudG9TdHJpbmcoKSwgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGIuZWxvLnRvU3RyaW5nKCksICAgICAgIDQsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHBiLm5hbWUsICAgICAgICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgICAzICogKEB0LnJvdW5kLTEpLCAgTEVGVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUIGNoZy50b0ZpeGVkKDEpLCA3LCAgUklHSFRcclxuXHRcdFx0XHRpZiBwYS5yZXNbcl0gPT0gJzEnIHRoZW4gcyArPSBcIiA9IDAuNSAqICgje2cudHh0VCBwYi5lbG8sIDcsIFJJR0hUfSlcIlxyXG5cdFx0XHRcdGlmIHBhLnJlc1tyXSA9PSAnMicgdGhlbiBzICs9IFwiID0gI3tnLnR4dFQgcGIuZWxvLCA3LCBSSUdIVH1cIlxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0Zy5oZWxwID0gcGEuZXhwbGFuYXRpb24gclxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRnLmhlbHAgPSBcIlwiXHJcblxyXG5cdG1vdXNlV2hlZWwgICA6IChldmVudCApLT4gQGxpc3RhLm1vdXNlV2hlZWwgZXZlbnRcclxuXHRtb3VzZVByZXNzZWQgOiAoZXZlbnQpIC0+IEBsaXN0YS5tb3VzZVByZXNzZWQgZXZlbnRcclxuXHRrZXlQcmVzc2VkICAgOiAoZXZlbnQpIC0+IEBidXR0b25zW2tleV0uY2xpY2soKVxyXG5cclxuXHRkcmF3IDogLT5cclxuXHRcdGZpbGwgJ3doaXRlJ1xyXG5cdFx0QHNob3dIZWFkZXIgQHQucm91bmQtMVxyXG5cdFx0QGxpc3RhLmRyYXcoKVxyXG5cdFx0Zm9yIGtleSxidXR0b24gb2YgQGJ1dHRvbnNcclxuXHRcdFx0YnV0dG9uLmRyYXcoKVxyXG5cdFx0dGV4dEFsaWduIExFRlRcclxuXHRcdHRleHQgZy5oZWxwLCAxMCwgMypnLlpPT01bZy5zdGF0ZV1cclxuXHJcblx0c2hvdyA6IChzLHgseSxiZyxmZykgLT5cclxuXHRcdGZpbGwgYmdcclxuXHRcdHJlY3QgeCwgeSwgMS42ICogZy5aT09NW2cuc3RhdGVdLCAwLjkgKiBnLlpPT01bZy5zdGF0ZV1cclxuXHRcdGZpbGwgZmdcclxuXHRcdEB0eHQgcywgeCwgeSsxLCAgQ0VOVEVSXHJcblxyXG5cdGxpZ2h0YnVsYiA6IChpZCwgY29sb3IsIHgsIHksIHJlc3VsdCwgb3Bwb25lbnQpIC0+XHJcblx0XHRwdXNoKClcclxuXHRcdHJlY3RNb2RlICBDRU5URVJcclxuXHRcdHMgPSAxICsgb3Bwb25lbnRcclxuXHRcdGlmIG9wcG9uZW50ID09IGcuUEFVU0UgdGhlbiBAc2hvdyBcIiBQIFwiLHgseSxcImdyYXlcIiwneWVsbG93J1xyXG5cdFx0aWYgb3Bwb25lbnQgPT0gZy5CWUUgICB0aGVuIEBzaG93IFwiQllFXCIseCx5LFwiZ3JlZW5cIiwneWVsbG93J1xyXG5cdFx0aWYgb3Bwb25lbnQgPj0gMFxyXG5cdFx0XHRyZXN1bHQgPSAnMDEyJy5pbmRleE9mIHJlc3VsdFxyXG5cdFx0XHRAc2hvdyAxK29wcG9uZW50LCB4LCB5LCAncmVkIGdyYXkgZ3JlZW4nLnNwbGl0KCcgJylbcmVzdWx0XSwge2I6J2JsYWNrJywgJyAnOid5ZWxsb3cnLCB3Oid3aGl0ZSd9W2NvbG9yXVxyXG5cdFx0cG9wKClcclxuXHJcblx0bWFrZSA6IChyZXMsaGVhZGVyKSAtPlxyXG5cdFx0aWYgQHQucGFpcnMubGVuZ3RoID09IDAgdGhlbiByZXMucHVzaCBcIlRoaXMgUk9VTkQgY2FuJ3QgYmUgcGFpcmVkISAoVG9vIG1hbnkgcm91bmRzKVwiXHJcblxyXG5cdFx0cmVzLnB1c2ggXCJTVEFORElOR1NcIiArIGhlYWRlclxyXG5cdFx0cmVzLnB1c2ggXCJcIlxyXG5cclxuXHRcdGhlYWRlciA9IFwiXCJcclxuXHRcdGhlYWRlciArPSAgICAgICBnLnR4dFQgXCJQb3NcIiwgICAzLCAgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgJ0lkJywgICAgMywgIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiRWxvMFwiLCAgNCwgIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiTmFtZVwiLCAyNSwgIExFRlRcclxuXHRcdGZvciByIGluIHJhbmdlIEB0LnJvdW5kXHJcblx0XHRcdGhlYWRlciArPSBnLnR4dFQgXCIje3IrMX1cIiwgIDYsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiUGVyZi5yYXRcIiwgOCwgUklHSFRcclxuXHRcdFxyXG5cdFx0Zm9yIHBsYXllcixpIGluIEBwbGF5ZXJzQnlQZXJmb3JtYW5jZVxyXG5cdFx0XHRpZiBpICUgQHQucHBwID09IDAgdGhlbiByZXMucHVzaCBoZWFkZXJcclxuXHRcdFx0cyA9IFwiXCJcclxuXHRcdFx0cyArPSAgICAgICBnLnR4dFQgKDEraSkudG9TdHJpbmcoKSwgICAgICAgICAgMywgIFJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUICgxK3BsYXllci5pZCkudG9TdHJpbmcoKSwgIDMsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwbGF5ZXIuZWxvLnRvU3RyaW5nKCksICAgIDQsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwbGF5ZXIubmFtZSwgICAgICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRzICs9ICcgJ1xyXG5cdFx0XHRmb3IgciBpbiByYW5nZSBAdC5yb3VuZFxyXG5cdFx0XHRcdGlmIHBsYXllci5vcHBbcl0gPT0gLTIgdGhlbiBzICs9ICcgICAgUCAnXHJcblx0XHRcdFx0aWYgcGxheWVyLm9wcFtyXSA9PSAtMSB0aGVuIHMgKz0gJyAgIEJZRSdcclxuXHRcdFx0XHRpZiBwbGF5ZXIub3BwW3JdID49IDBcclxuXHRcdFx0XHRcdHMgKz0gZy50eHRUIFwiI3sxK3BsYXllci5vcHBbcl19I3tnLlJJTkdTW3BsYXllci5jb2xbcl1bMF1dfSN7XCIwwr0xXCJbcGxheWVyLnJlc1tyXV19XCIsIDYsICBSSUdIVFxyXG5cclxuXHRcdFx0cCA9IHBsYXllclxyXG5cdFx0XHR2YWx1ZSA9IHAuY2hhbmdlKEB0LnJvdW5kKVxyXG5cdFx0XHRpZiB2YWx1ZSA8IDEgdGhlbiBzICs9ICcgJyArIGcudHh0VCBcIi1pbmZcIiwgNywgUklHSFRcclxuXHRcdFx0ZWxzZSBpZiB2YWx1ZSA+IDM5OTkgdGhlbiBzICs9ICcgJyArIGcudHh0VCBcImluZlwiLCA3LCBSSUdIVFxyXG5cdFx0XHRlbHNlIHMgKz0gJyAnICsgZy50eHRUIHAuY2hhbmdlKEB0LnJvdW5kKzEpLnRvRml4ZWQoMSksIDcsIFJJR0hUXHJcblxyXG5cdFx0XHQjIHMgKz0gJyAnICsgZy50eHRUIHBsYXllci5jaGFuZ2UoQHQucm91bmQrMSkudG9GaXhlZCgxKSwgIDcsICBSSUdIVFxyXG5cdFx0XHQjIHMgKz0gJyAnICsgZy50eHRUIHBsYXllci5wZXJDaGcoQHQucm91bmQrMSkudG9GaXhlZCgxKSwgIDcsICBSSUdIVFxyXG5cdFx0XHRyZXMucHVzaCBzIFxyXG5cdFx0XHRpZiBpICUgQHQucHBwID09IEB0LnBwcC0xIHRoZW4gcmVzLnB1c2ggXCJcXGZcIlxyXG5cdFx0cmVzLnB1c2ggXCJcXGZcIiJdfQ==
//# sourceURL=c:\github\FairPair\coffee\page_standings.coffee