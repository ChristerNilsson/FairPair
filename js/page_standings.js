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
    header += ' ' + g.txtT("EPR", 8, RIGHT);
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
        s += ' ' + g.txtT(p.change(this.t.round).toFixed(1 + 2), 8, RIGHT);
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
    header += ' ' + g.txtT("Elo", 4, RIGHT);
    header += ' ' + g.txtT("Name", 25, LEFT);
    ref = range(this.t.round);
    for (j = 0, len = ref.length; j < len; j++) {
      r = ref[j];
      header += g.txtT(`${r + 1}`, 6, RIGHT);
    }
    header += ' ' + g.txtT("EPR", 8, RIGHT);
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
        s += ' ' + g.txtT(p.change(this.t.round + 1).toFixed(1 + 2), 8, RIGHT);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZV9zdGFuZGluZ3MuanMiLCJzb3VyY2VSb290IjoiLi5cXCIsInNvdXJjZXMiOlsiY29mZmVlXFxwYWdlX3N0YW5kaW5ncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsT0FBQTtFQUFTLENBQVQ7RUFBVyxLQUFYO0VBQWlCLEtBQWpCO0VBQXVCLE1BQXZCO0VBQThCLE1BQTlCO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVMsSUFBVDtDQUFBLE1BQUE7O0FBQ0EsT0FBQTtFQUFTLE1BQVQ7RUFBZ0IsTUFBaEI7Q0FBQSxNQUFBOztBQUNBLE9BQUE7RUFBUyxLQUFUO0NBQUEsTUFBQTs7QUFFQSxPQUFBLElBQWEsWUFBTixNQUFBLFVBQUEsUUFBd0IsS0FBeEI7RUFFTixXQUFjLENBQUEsQ0FBQTs7UUE4Q2QsQ0FBQSxpQkFBQSxDQUFBO0lBNUNDLElBQUMsQ0FBQSxDQUFELEdBQUssQ0FBQyxDQUFDO0lBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXNCLElBQUksTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CLENBQUEsQ0FBQSxHQUFBO2FBQU0sQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUMsTUFBYjtJQUFOLENBQW5CO0lBQ3RCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBVCxHQUFzQixJQUFJLE1BQUosQ0FBVyxFQUFYLEVBQWUsRUFBZixFQUFtQixDQUFBLENBQUEsR0FBQTthQUFNLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQyxDQUFDLE1BQWI7SUFBTixDQUFuQjtJQUN0QixJQUFDLENBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFYLEdBQW9CO0VBTFA7O0VBT2QsUUFBVyxDQUFBLENBQUE7QUFFWixRQUFBLE1BQUEsRUFBQTtJQUFFLE9BQUEsR0FBVSxDQUFDLENBQUMsR0FBRixDQUFNLEtBQUEsQ0FBTSxDQUFOLEVBQVEsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILEdBQVMsQ0FB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QURYO09BaEJSOzs7TUFxQkcsR0FBRyxDQUFDLElBQUosQ0FBUyxDQUFUO01BQ0EsSUFBRyxDQUFBLEdBQUksSUFBQyxDQUFBLENBQUMsQ0FBQyxHQUFQLEtBQWMsSUFBQyxDQUFBLENBQUMsQ0FBQyxHQUFILEdBQU8sQ0FBeEI7UUFBK0IsR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFULEVBQS9COztJQXZCRDtXQXdCQSxHQUFHLENBQUMsSUFBSixDQUFTLElBQVQ7RUF2Q007O0FBaklEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZyxwcmludCxyYW5nZSxzY2FsZXgsc2NhbGV5IH0gZnJvbSAnLi9nbG9iYWxzLmpzJyBcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcGFnZS5qcycgXHJcbmltcG9ydCB7IEJ1dHRvbixzcHJlYWQgfSBmcm9tICcuL2J1dHRvbi5qcycgIFxyXG5pbXBvcnQgeyBMaXN0YSB9IGZyb20gJy4vbGlzdGEuanMnIFxyXG5cclxuZXhwb3J0IGNsYXNzIFN0YW5kaW5ncyBleHRlbmRzIFBhZ2VcclxuXHJcblx0Y29uc3RydWN0b3IgOiAtPlxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QHQgPSBnLnRvdXJuYW1lbnRcclxuXHRcdEBidXR0b25zLkFycm93TGVmdCAgPSBuZXcgQnV0dG9uICcnLCAnJywgKCkgPT4gZy5zZXRTdGF0ZSBnLkFDVElWRVxyXG5cdFx0QGJ1dHRvbnMuQXJyb3dSaWdodCA9IG5ldyBCdXR0b24gJycsICcnLCAoKSA9PiBnLnNldFN0YXRlIGcuVEFCTEVTXHJcblx0XHRAYnV0dG9ucy5zLmFjdGl2ZSA9IGZhbHNlXHJcblxyXG5cdHNldExpc3RhIDogLT5cclxuXHJcblx0XHRyaGVhZGVyID0gXy5tYXAgcmFuZ2UoMSxAdC5yb3VuZCsxKSwgKGkpIC0+IFwiICN7aSUxMH0gXCJcclxuXHRcdHJoZWFkZXIgPSByaGVhZGVyLmpvaW4gJydcclxuXHRcdGhlYWRlciA9IFwiXCJcclxuXHRcdGhlYWRlciArPSAgICAgICBnLnR4dFQgXCJQb3NcIiwgICAgICAgICAgMywgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJJZFwiLCAgICAgICAgICAgMywgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJFbG9cIiwgICAgICAgICAgNCwgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJOYW1lXCIsICAgICAgICAyNSwgTEVGVFxyXG5cdFx0aGVhZGVyICs9ICcnICArIGcudHh0VCByaGVhZGVyLCAzKkByb3VuZCwgTEVGVCBcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgXCJFUFJcIiwgICAgICA4LCBSSUdIVFxyXG5cclxuXHRcdEBwbGF5ZXJzQnlQZXJmb3JtYW5jZSA9IF8uY2xvbmUgQHQucGxheWVyc0J5SUQuc2xpY2UgMCxnLk5cclxuXHRcdEBwbGF5ZXJzQnlQZXJmb3JtYW5jZSA9IEBwbGF5ZXJzQnlQZXJmb3JtYW5jZS5zb3J0IChhLGIpID0+IFxyXG5cdFx0XHRpZiBiLmNoYW5nZShAdC5yb3VuZCsxKSA9PSBhLmNoYW5nZShAdC5yb3VuZCsxKSB0aGVuIGIuZWxvIC0gYS5lbG9cclxuXHRcdFx0ZWxzZSBiLmNoYW5nZShAdC5yb3VuZCsxKSAtIGEuY2hhbmdlKEB0LnJvdW5kKzEpXHJcblxyXG5cdFx0QGxpc3RhID0gbmV3IExpc3RhIEBwbGF5ZXJzQnlQZXJmb3JtYW5jZSwgaGVhZGVyLCBAYnV0dG9ucywgKHAsaW5kZXgscG9zKSA9PiAjIHJldHVybmVyYSBzdHLDpG5nZW4gc29tIHNrYSBza3JpdmFzIHV0LiBEZXNzdXRvbSByaXRhcyBsaWdodGJ1bGJzIGjDpHIuXHJcblx0XHRcdEB5X2J1bGIgPSAoNSArIGluZGV4KSAqIGcuWk9PTVtnLnN0YXRlXSBcclxuXHRcdFx0dGV4dEFsaWduIExFRlRcclxuXHRcdFx0ZmlsbCAnYmxhY2snIFxyXG5cdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRzICs9ICAgICAgIGcudHh0VCAoMStwb3MpLnRvU3RyaW5nKCksICAgICAzLCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgKDErcC5pZCkudG9TdHJpbmcoKSwgICAgMywgIFJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHAuZWxvLnRvU3RyaW5nKCksICAgICAgIDQsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCBwLm5hbWUsICAgICAgICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCAnJywgICAgICAzICogKEB0LnJvdW5kLTEpLCAgQ0VOVEVSXHJcblx0XHRcdHZhbHVlID0gcC5jaGFuZ2UoQHQucm91bmQpXHJcblx0XHRcdGlmIHZhbHVlIDwgMSB0aGVuIHMgKz0gJyAnICsgZy50eHRUIFwiLWluZlwiLCA3LCBSSUdIVFxyXG5cdFx0XHRlbHNlIGlmIHZhbHVlID4gMzk5OSB0aGVuIHMgKz0gJyAnICsgZy50eHRUIFwiaW5mXCIsIDcsIFJJR0hUXHJcblx0XHRcdGVsc2UgcyArPSAnICcgKyBnLnR4dFQgcC5jaGFuZ2UoQHQucm91bmQpLnRvRml4ZWQoMSsyKSwgOCwgUklHSFRcclxuXHRcdFx0XHJcblx0XHRcdGZvciByIGluIHJhbmdlIGcudG91cm5hbWVudC5yb3VuZCAtIDEgIy0gMVxyXG5cdFx0XHRcdHggPSBnLlpPT01bZy5zdGF0ZV0gKiAoMjQuMiArIDEuOCpyKVxyXG5cdFx0XHRcdEBsaWdodGJ1bGIgcC5pZCwgcC5jb2xbcl0sIHgsIEB5X2J1bGIsIHAucmVzLnNsaWNlKHIscisxKSwgcC5vcHBbcl1cclxuXHRcdFx0c1xyXG5cdFx0QGxpc3RhLnBhaW50WWVsbG93Um93ID0gZmFsc2VcclxuXHRcdHNwcmVhZCBAYnV0dG9ucywgMTAsIEB5LCBAaFxyXG5cclxuXHRtb3VzZU1vdmVkIDogPT5cclxuXHRcdHIgPSByb3VuZCAoKG1vdXNlWCAvIGcuWk9PTVtnLnN0YXRlXSAtIDI0LjIpIC8gMS44KVxyXG5cdFx0aXkgPSBAbGlzdGEub2Zmc2V0ICsgcm91bmQgbW91c2VZIC8gZy5aT09NW2cuc3RhdGVdIC0gNVxyXG5cdFx0aWYgMCA8PSBpeSA8IEBwbGF5ZXJzQnlQZXJmb3JtYW5jZS5sZW5ndGggYW5kIDAgPD0gciA8IGcudG91cm5hbWVudC5yb3VuZCAtIDFcclxuXHRcdFx0cGEgPSBAcGxheWVyc0J5UGVyZm9ybWFuY2VbaXldXHJcblx0XHRcdGIgPSBwYS5vcHBbcl1cclxuXHJcblx0XHRcdGlmIGIgPT0gZy5CWUUgXHJcblx0XHRcdFx0cyA9IFwiXCJcclxuXHRcdFx0XHRzICs9ICAgICAgIGcudHh0VCAnJywgICAgICAgICAgICAgICAgICAgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgJycsICAgICAgICAgICAgICAgICAgICAgIDMsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgICAgICAgICAgICAgICAgICA0LCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAnaGFzIGEgYnllJywgICAgICAgICAgICAyNSwgIExFRlRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAnJywgICAgICAgMyAqIChAdC5yb3VuZC0xKSwgIExFRlRcclxuXHRcdFx0XHQjIGcuaGVscCA9IFwiI3twYS5lbG99ICN7cGEubmFtZX0gaGFzIGEgYnllICAgICAgICAgICAgICAgICAgICN7cGEuZWxvLnRvRml4ZWQoMSl9XCIgIyA9PiBjaGcgPSAje2cuSy8yfVwiXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgXCIje3BhLmVsby50b0ZpeGVkKDEpfVwiLCAgICAgICAgNywgUklHSFRcclxuXHRcdFx0XHRnLmhlbHAgPSBzXHJcblxyXG5cdFx0XHRpZiBiID09IGcuUEFVU0VcclxuXHRcdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRcdHMgKz0gICAgICAgZy50eHRUICcnLCAgICAgICAgICAgICAgICAgICAgICAzLCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAnJywgICAgICAgICAgICAgICAgICAgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgJycsICAgICAgICAgICAgICAgICAgICAgIDQsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICdoYXMgYSBwYXVzZScsICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgICAzICogKEB0LnJvdW5kLTEpLCAgTEVGVFxyXG5cdFx0XHRcdCMgZy5oZWxwID0gXCIje3BhLmVsb30gI3twYS5uYW1lfSBoYXMgYSBieWUgICAgICAgICAgICAgICAgICAgI3twYS5lbG8udG9GaXhlZCgxKX1cIiAjID0+IGNoZyA9ICN7Zy5LLzJ9XCJcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCBcIjAuMFwiLCAgICAgICAgICAgICAgICAgICAgICAgICA3LCBSSUdIVFxyXG5cdFx0XHRcdGcuaGVscCA9IHNcclxuXHJcblx0XHRcdFx0IyBcdHMgKz0gXCIje3BhLmVsb30gI3twYS5uYW1lfSBoYXMgYSBwYXVzZSAgICAgICAgICAgICAgICAgICAgMC4wXCIgIyA9PiBjaGcgPSAwXCJcclxuXHJcblx0XHRcdFx0IyBnLmhlbHAgPSBzXHJcblxyXG5cdFx0XHRpZiBiID49IDBcdFx0XHRcdFxyXG5cdFx0XHRcdHBiID0gQHQucGxheWVyc0J5SURbYl1cclxuXHRcdFx0XHRjaGcgPSAxMjM0ICNwYS5jYWxjUm91bmQgclxyXG5cclxuXHRcdFx0XHRzID0gXCJcIlxyXG5cdFx0XHRcdHMgKz0gICAgICAgZy50eHRUICcnLCAgICAgICAgICAgICAgICAgICAgICAzLCAgUklHSFRcclxuXHRcdFx0XHRzICs9ICcgJyArIGcudHh0VCAoMStwYi5pZCkudG9TdHJpbmcoKSwgICAgMywgIFJJR0hUXHJcblx0XHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGIuZWxvLnRvU3RyaW5nKCksICAgICAgIDQsICBSSUdIVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHBiLm5hbWUsICAgICAgICAgICAgICAgIDI1LCAgTEVGVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUICcnLCAgICAgICAzICogKEB0LnJvdW5kLTEpLCAgTEVGVFxyXG5cdFx0XHRcdHMgKz0gJyAnICsgZy50eHRUIGNoZy50b0ZpeGVkKDEpLCA3LCAgUklHSFRcclxuXHRcdFx0XHRpZiBwYS5yZXNbcl0gPT0gJzEnIHRoZW4gcyArPSBcIiA9IDAuNSAqICgje2cudHh0VCBwYi5lbG8sIDcsIFJJR0hUfSlcIlxyXG5cdFx0XHRcdGlmIHBhLnJlc1tyXSA9PSAnMicgdGhlbiBzICs9IFwiID0gI3tnLnR4dFQgcGIuZWxvLCA3LCBSSUdIVH1cIlxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0Zy5oZWxwID0gcGEuZXhwbGFuYXRpb24gclxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRnLmhlbHAgPSBcIlwiXHJcblxyXG5cdG1vdXNlV2hlZWwgICA6IChldmVudCApLT4gQGxpc3RhLm1vdXNlV2hlZWwgZXZlbnRcclxuXHRtb3VzZVByZXNzZWQgOiAoZXZlbnQpIC0+IEBsaXN0YS5tb3VzZVByZXNzZWQgZXZlbnRcclxuXHRrZXlQcmVzc2VkICAgOiAoZXZlbnQpIC0+IEBidXR0b25zW2tleV0uY2xpY2soKVxyXG5cclxuXHRkcmF3IDogLT5cclxuXHRcdGZpbGwgJ3doaXRlJ1xyXG5cdFx0QHNob3dIZWFkZXIgQHQucm91bmQtMVxyXG5cdFx0QGxpc3RhLmRyYXcoKVxyXG5cdFx0Zm9yIGtleSxidXR0b24gb2YgQGJ1dHRvbnNcclxuXHRcdFx0YnV0dG9uLmRyYXcoKVxyXG5cdFx0dGV4dEFsaWduIExFRlRcclxuXHRcdHRleHQgZy5oZWxwLCAxMCwgMypnLlpPT01bZy5zdGF0ZV1cclxuXHJcblx0c2hvdyA6IChzLHgseSxiZyxmZykgLT5cclxuXHRcdGZpbGwgYmdcclxuXHRcdHJlY3QgeCwgeSwgMS42ICogZy5aT09NW2cuc3RhdGVdLCAwLjkgKiBnLlpPT01bZy5zdGF0ZV1cclxuXHRcdGZpbGwgZmdcclxuXHRcdEB0eHQgcywgeCwgeSsxLCAgQ0VOVEVSXHJcblxyXG5cdGxpZ2h0YnVsYiA6IChpZCwgY29sb3IsIHgsIHksIHJlc3VsdCwgb3Bwb25lbnQpIC0+XHJcblx0XHRwdXNoKClcclxuXHRcdHJlY3RNb2RlICBDRU5URVJcclxuXHRcdHMgPSAxICsgb3Bwb25lbnRcclxuXHRcdGlmIG9wcG9uZW50ID09IGcuUEFVU0UgdGhlbiBAc2hvdyBcIiBQIFwiLHgseSxcImdyYXlcIiwneWVsbG93J1xyXG5cdFx0aWYgb3Bwb25lbnQgPT0gZy5CWUUgICB0aGVuIEBzaG93IFwiQllFXCIseCx5LFwiZ3JlZW5cIiwneWVsbG93J1xyXG5cdFx0aWYgb3Bwb25lbnQgPj0gMFxyXG5cdFx0XHRyZXN1bHQgPSAnMDEyJy5pbmRleE9mIHJlc3VsdFxyXG5cdFx0XHRAc2hvdyAxK29wcG9uZW50LCB4LCB5LCAncmVkIGdyYXkgZ3JlZW4nLnNwbGl0KCcgJylbcmVzdWx0XSwge2I6J2JsYWNrJywgJyAnOid5ZWxsb3cnLCB3Oid3aGl0ZSd9W2NvbG9yXVxyXG5cdFx0cG9wKClcclxuXHJcblx0bWFrZSA6IChyZXMsaGVhZGVyKSAtPlxyXG5cdFx0aWYgQHQucGFpcnMubGVuZ3RoID09IDAgdGhlbiByZXMucHVzaCBcIlRoaXMgUk9VTkQgY2FuJ3QgYmUgcGFpcmVkISAoVG9vIG1hbnkgcm91bmRzKVwiXHJcblxyXG5cdFx0cmVzLnB1c2ggXCJTVEFORElOR1NcIiArIGhlYWRlclxyXG5cdFx0cmVzLnB1c2ggXCJcIlxyXG5cclxuXHRcdGhlYWRlciA9IFwiXCJcclxuXHRcdGhlYWRlciArPSAgICAgICBnLnR4dFQgXCJQb3NcIiwgICAzLCAgUklHSFRcclxuXHRcdGhlYWRlciArPSAnICcgKyBnLnR4dFQgJ0lkJywgICAgMywgIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiRWxvXCIsICAgNCwgIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiTmFtZVwiLCAyNSwgIExFRlRcclxuXHRcdGZvciByIGluIHJhbmdlIEB0LnJvdW5kXHJcblx0XHRcdGhlYWRlciArPSBnLnR4dFQgXCIje3IrMX1cIiwgIDYsIFJJR0hUXHJcblx0XHRoZWFkZXIgKz0gJyAnICsgZy50eHRUIFwiRVBSXCIsIDgsIFJJR0hUXHJcblx0XHRcclxuXHRcdGZvciBwbGF5ZXIsaSBpbiBAcGxheWVyc0J5UGVyZm9ybWFuY2VcclxuXHRcdFx0aWYgaSAlIEB0LnBwcCA9PSAwIHRoZW4gcmVzLnB1c2ggaGVhZGVyXHJcblx0XHRcdHMgPSBcIlwiXHJcblx0XHRcdHMgKz0gICAgICAgZy50eHRUICgxK2kpLnRvU3RyaW5nKCksICAgICAgICAgIDMsICBSSUdIVFxyXG5cdFx0XHRzICs9ICcgJyArIGcudHh0VCAoMStwbGF5ZXIuaWQpLnRvU3RyaW5nKCksICAzLCAgUklHSFRcclxuXHRcdFx0cyArPSAnICcgKyBnLnR4dFQgcGxheWVyLmVsby50b1N0cmluZygpLCAgICAgNCwgIFJJR0hUXHJcblx0XHRcdHMgKz0gJyAnICsgZy50eHRUIHBsYXllci5uYW1lLCAgICAgICAgICAgICAgMjUsICBMRUZUXHJcblx0XHRcdHMgKz0gJyAnXHJcblx0XHRcdGZvciByIGluIHJhbmdlIEB0LnJvdW5kXHJcblx0XHRcdFx0aWYgcGxheWVyLm9wcFtyXSA9PSAtMiB0aGVuIHMgKz0gJyAgICBQICdcclxuXHRcdFx0XHRpZiBwbGF5ZXIub3BwW3JdID09IC0xIHRoZW4gcyArPSAnICAgQllFJ1xyXG5cdFx0XHRcdGlmIHBsYXllci5vcHBbcl0gPj0gMFxyXG5cdFx0XHRcdFx0cyArPSBnLnR4dFQgXCIjezErcGxheWVyLm9wcFtyXX0je2cuUklOR1NbcGxheWVyLmNvbFtyXVswXV19I3tcIjDCvTFcIltwbGF5ZXIucmVzW3JdXX1cIiwgNiwgIFJJR0hUXHJcblxyXG5cdFx0XHRwID0gcGxheWVyXHJcblx0XHRcdHZhbHVlID0gcC5jaGFuZ2UoQHQucm91bmQpXHJcblx0XHRcdGlmIHZhbHVlIDwgMSB0aGVuIHMgKz0gJyAnICsgZy50eHRUIFwiLWluZlwiLCA3LCBSSUdIVFxyXG5cdFx0XHRlbHNlIGlmIHZhbHVlID4gMzk5OSB0aGVuIHMgKz0gJyAnICsgZy50eHRUIFwiaW5mXCIsIDcsIFJJR0hUXHJcblx0XHRcdGVsc2UgcyArPSAnICcgKyBnLnR4dFQgcC5jaGFuZ2UoQHQucm91bmQrMSkudG9GaXhlZCgxKzIpLCA4LCBSSUdIVFxyXG5cclxuXHRcdFx0IyBzICs9ICcgJyArIGcudHh0VCBwbGF5ZXIuY2hhbmdlKEB0LnJvdW5kKzEpLnRvRml4ZWQoMSksICA3LCAgUklHSFRcclxuXHRcdFx0IyBzICs9ICcgJyArIGcudHh0VCBwbGF5ZXIucGVyQ2hnKEB0LnJvdW5kKzEpLnRvRml4ZWQoMSksICA3LCAgUklHSFRcclxuXHRcdFx0cmVzLnB1c2ggcyBcclxuXHRcdFx0aWYgaSAlIEB0LnBwcCA9PSBAdC5wcHAtMSB0aGVuIHJlcy5wdXNoIFwiXFxmXCJcclxuXHRcdHJlcy5wdXNoIFwiXFxmXCIiXX0=
//# sourceURL=c:\github\FairPair\coffee\page_standings.coffee