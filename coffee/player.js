// Generated by CoffeeScript 2.7.0
var indexOf = [].indexOf;

import {
  g,
  print,
  range,
  scalex,
  scaley,
  SEPARATOR
} from './globals.js';

export var Player = class Player {
  constructor(id1, name = "", elo = "1400", opp1 = [], col1 = "", res1 = "", active = true) {
    this.id = id1;
    this.name = name;
    this.elo = elo;
    this.opp = opp1;
    this.col = col1;
    this.res = res1;
    this.active = active;
    this.pos = [];
  }

  toggle() {
    var p;
    this.active = !this.active;
    return g.tournament.paused = (function() {
      var j, len, ref, results;
      ref = g.tournament.playersByID;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        p = ref[j];
        if (!p.active) {
          results.push(p.id);
        }
      }
      return results;
    })();
  }

  bye() {
    var ref;
    return ref = g.BYE, indexOf.call(this.opp, ref) >= 0;
  }

  explanation(r) {
    var col, opp, res;
    if (this.opp[r] === g.BYE) {
      return "";
    }
    if (this.opp[r] === g.PAUSE) {
      return "";
    }
    res = ['Loss', 'Draw', 'Win'][this.res[r]];
    opp = g.tournament.playersByID[this.opp[r]];
    col = this.col[r] === 'w' ? 'white' : 'black';
    return `${res} against ${opp.elo} ${opp.name} as ${col}`;
  }

  expected_score(ratings, own_rating) {
    var rating;
    return g.sum((function() {
      var j, len, results;
      results = [];
      for (j = 0, len = ratings.length; j < len; j++) {
        rating = ratings[j];
        results.push(1 / (1 + 10 ** ((rating - own_rating) / 400)));
      }
      return results;
    })());
  }

  performance_rating(ratings, score) {
    var a, b, hi, lo, rating;
    if (ratings.length === 1 && score === 0) {
      a = this.performance_rating(ratings, 0.50);
      b = this.performance_rating(ratings, 0.25);
      return 2 * b - a;
    }
    if (ratings.length === 1 && score === 1) {
      a = this.performance_rating(ratings, 0.50);
      b = this.performance_rating(ratings, 0.75);
      return 2 * b - a;
    }
    if (score === 0) {
      a = this.performance_rating(ratings, 1.0);
      b = this.performance_rating(ratings, 0.5);
      return 2 * b - a;
    }
    if (score === ratings.length) {
      a = this.performance_rating(ratings, score - 1.0);
      b = this.performance_rating(ratings, score - 0.5);
      return 2 * b - a;
    }
    lo = 0;
    hi = 4000;
    while (hi - lo > 0.001) {
      rating = (lo + hi) / 2;
      if (score > this.expected_score(ratings, rating)) {
        lo = rating;
      } else {
        hi = rating;
      }
    }
    return rating;
  }

  performance() {
    var j, len, r, ratings, ref, score;
    score = 0;
    ratings = [];
    ref = range(this.res.length);
    for (j = 0, len = ref.length; j < len; j++) {
      r = ref[j];
      if (this.opp[r] === g.BYE) {
        continue;
      }
      if (this.opp[r] === g.PAUSE) {
        continue;
      }
      score += this.res[r] / 2;
      ratings.push(g.tournament.playersByID[this.opp[r]].elo);
    }
    return this.performance_rating(ratings, score);
  }

  // enhanced_performance : ->
  // 	score = 0 
  // 	ratings = []
  // 	for r in range @res.length
  // 		if @opp[r] == g.BYE then continue
  // 		if @opp[r] == g.PAUSE then continue
  // 		score += @res[r]/2
  // 		ratings.push g.tournament.playersByID[@opp[r]].elo
  // 	score += 0.5 # fiktiv remi
  // 	ratings.push g.average # global average opponent elo
  // 	@performance_rating ratings,score
  change(rounds) {
    return this.performance();
  }

  score(rounds) {
    var r;
    return g.sum((function() {
      var j, len, ref, results;
      ref = range(rounds - 1);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        results.push(parseInt(this.res[r]));
      }
      return results;
    }).call(this));
  }

  eloDiffAbs() {
    var id, j, len, ref, res;
    res = [];
    ref = this.opp.slice(0, this.opp.length);
    // - 1
    for (j = 0, len = ref.length; j < len; j++) {
      id = ref[j];
      if (id >= 0) {
        res.push(abs(this.elo - g.tournament.playersByID[id].elo));
      }
    }
    return g.sum(res);
  }

  balans() { // färgbalans
    var ch, j, len, ref, result;
    result = 0;
    ref = this.col;
    for (j = 0, len = ref.length; j < len; j++) {
      ch = ref[j];
      if (ch === 'b') {
        result -= 1;
      }
      if (ch === 'w') {
        result += 1;
      }
    }
    return result;
  }

  read(player) {
    var arr, col, j, len, ocr, ocrs, results;
    this.elo = parseInt(player[0]);
    this.name = player[1];
    this.opp = [];
    this.col = "";
    this.res = "";
    if (player.length < 3) {
      return;
    }
    ocrs = player.slice(2);
    results = [];
    for (j = 0, len = ocrs.length; j < len; j++) {
      ocr = ocrs[j];
      if (indexOf.call(ocr, 'w') >= 0) {
        col = 'w';
      }
      if (indexOf.call(ocr, 'b') >= 0) {
        col = 'b';
      }
      if (indexOf.call(ocr, '_') >= 0) {
        col = '_';
      }
      arr = ocr.split(col);
      this.opp.push(parseInt(arr[0]));
      this.col += col;
      if (arr.length === 2 && arr[1].length === 1) {
        results.push(this.res += arr[1]);
      } else {
        results.push(void 0);
      }
    }
    return results;
  }

  write() { // 1234!Christer!12w0!23b1!14w2   Elo:1234 Name:Christer opponent:23 color:b result:1
    var i, ocr, r, res;
    res = [];
    res.push(this.elo);
    res.push(this.name);
    r = this.opp.length;
    if (r === 0) {
      return res.join(SEPARATOR);
    }
    ocr = (function() {
      var j, len, ref, results;
      ref = range(r);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        results.push(`${this.opp[i]}${this.col[i]}${i < r ? this.res[i] : ''}`);
      }
      return results;
    }).call(this);
    res.push(ocr.join(SEPARATOR));
    return res.join(SEPARATOR);
  }

};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7RUFBcUMsU0FBckM7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxTQUFOLE1BQUEsT0FBQTtFQUNOLFdBQWMsSUFBQSxTQUFZLEVBQVosUUFBcUIsTUFBckIsU0FBa0MsRUFBbEMsU0FBMkMsRUFBM0MsU0FBb0QsRUFBcEQsV0FBa0UsSUFBbEUsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUFJLElBQUMsQ0FBQTtJQUFTLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFrQixJQUFDLENBQUEsR0FBRCxHQUFPO0VBQWxGOztFQUVkLE1BQVMsQ0FBQSxDQUFBO0FBQ1YsUUFBQTtJQUFFLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBSSxJQUFDLENBQUE7V0FDZixDQUFDLENBQUMsVUFBVSxDQUFDLE1BQWI7O0FBQXVCO0FBQUE7TUFBQSxLQUFBLHFDQUFBOztZQUE0QyxDQUFJLENBQUMsQ0FBQzt1QkFBbEQsQ0FBQyxDQUFDOztNQUFGLENBQUE7OztFQUZmOztFQUlULEdBQU0sQ0FBQSxDQUFBO0FBQUUsUUFBQTtpQkFBQyxDQUFDLENBQUMsa0JBQU8sSUFBQyxDQUFBLEtBQVY7RUFBSDs7RUFFTixXQUFjLENBQUMsQ0FBRCxDQUFBO0FBQ2YsUUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUUsSUFBRyxJQUFDLENBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSixLQUFXLENBQUMsQ0FBQyxHQUFoQjtBQUEyQixhQUFPLEdBQWxDOztJQUNBLElBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENB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QUQsSUFBUTtNQUNSLElBQUcsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFkLElBQW9CLEdBQUcsQ0FBQyxDQUFELENBQUcsQ0FBQyxNQUFQLEtBQWlCLENBQXhDO3FCQUErQyxJQUFDLENBQUEsR0FBRCxJQUFRLEdBQUcsQ0FBQyxDQUFELEdBQTFEO09BQUEsTUFBQTs2QkFBQTs7SUFQRCxDQUFBOztFQVJNOztFQWlCUCxLQUFRLENBQUEsQ0FBQSxFQUFBO0FBQ1QsUUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtJQUFFLEdBQUEsR0FBTTtJQUNOLEdBQUcsQ0FBQyxJQUFKLENBQVMsSUFBQyxDQUFBLEdBQVY7SUFDQSxHQUFHLENBQUMsSUFBSixDQUFTLElBQUMsQ0FBQSxJQUFWO0lBQ0EsQ0FBQSxHQUFJLElBQUMsQ0FBQSxHQUFHLENBQUM7SUFDVCxJQUFHLENBQUEsS0FBSyxDQUFSO0FBQWUsYUFBTyxHQUFHLENBQUMsSUFBSixDQUFTLFNBQVQsRUFBdEI7O0lBQ0EsR0FBQTs7QUFBTztBQUFBO01BQUEsS0FBQSxxQ0FBQTs7cUJBQUEsQ0FBQSxDQUFBLENBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQVAsQ0FBQSxDQUFBLENBQWEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQWpCLENBQUEsQ0FBQSxDQUEwQixDQUFBLEdBQUksQ0FBUCxHQUFjLElBQUMsQ0FBQSxHQUFHLENBQUMsQ0FBRCxDQUFsQixHQUEyQixFQUFsRCxDQUFBO01BQUEsQ0FBQTs7O0lBQ1AsR0FBRyxDQUFDLElBQUosQ0FBUyxHQUFHLENBQUMsSUFBSixDQUFTLFNBQVQsQ0FBVDtXQUNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBVDtFQVJPOztBQXRHRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGcscHJpbnQscmFuZ2Usc2NhbGV4LHNjYWxleSxTRVBBUkFUT1IgfSBmcm9tICcuL2dsb2JhbHMuanMnIFxyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllclxyXG5cdGNvbnN0cnVjdG9yIDogKEBpZCwgQG5hbWU9XCJcIiwgQGVsbz1cIjE0MDBcIiwgQG9wcD1bXSwgQGNvbD1cIlwiLCBAcmVzPVwiXCIsIEBhY3RpdmUgPSB0cnVlKSAtPiBAcG9zID0gW11cclxuXHJcblx0dG9nZ2xlIDogLT4gXHJcblx0XHRAYWN0aXZlID0gbm90IEBhY3RpdmVcclxuXHRcdGcudG91cm5hbWVudC5wYXVzZWQgPSAocC5pZCBmb3IgcCBpbiBnLnRvdXJuYW1lbnQucGxheWVyc0J5SUQgd2hlbiBub3QgcC5hY3RpdmUpXHJcblxyXG5cdGJ5ZSA6IC0+IGcuQllFIGluIEBvcHBcclxuXHJcblx0ZXhwbGFuYXRpb24gOiAocikgLT5cclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5CWUUgICB0aGVuIHJldHVybiBcIlwiXHJcblx0XHRpZiBAb3BwW3JdID09IGcuUEFVU0UgdGhlbiByZXR1cm4gXCJcIlxyXG5cdFx0cmVzID0gWydMb3NzJywnRHJhdycsJ1dpbiddW0ByZXNbcl1dXHJcblx0XHRvcHAgPSBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbQG9wcFtyXV1cclxuXHRcdGNvbCA9IGlmIEBjb2xbcl09PSd3JyB0aGVuICd3aGl0ZScgZWxzZSAnYmxhY2snXHJcblx0XHRcIiN7cmVzfSBhZ2FpbnN0ICN7b3BwLmVsb30gI3tvcHAubmFtZX0gYXMgI3tjb2x9XCJcclxuXHJcblx0ZXhwZWN0ZWRfc2NvcmUgOiAocmF0aW5ncywgb3duX3JhdGluZykgLT5cclxuXHRcdGcuc3VtKDEgLyAoMSArIDEwKiooKHJhdGluZyAtIG93bl9yYXRpbmcpIC8gNDAwKSkgZm9yIHJhdGluZyBpbiByYXRpbmdzKSAgIFxyXG5cclxuXHRwZXJmb3JtYW5jZV9yYXRpbmcgOiAocmF0aW5ncywgc2NvcmUpIC0+XHJcblx0XHRpZiByYXRpbmdzLmxlbmd0aCA9PSAxIGFuZCBzY29yZSA9PSAwXHJcblx0XHRcdGEgPSBAcGVyZm9ybWFuY2VfcmF0aW5nIHJhdGluZ3MsIDAuNTBcclxuXHRcdFx0YiA9IEBwZXJmb3JtYW5jZV9yYXRpbmcgcmF0aW5ncywgMC4yNVxyXG5cdFx0XHRyZXR1cm4gMipiLWFcclxuXHRcdGlmIHJhdGluZ3MubGVuZ3RoID09IDEgYW5kIHNjb3JlID09IDFcclxuXHRcdFx0YSA9IEBwZXJmb3JtYW5jZV9yYXRpbmcgcmF0aW5ncywgMC41MFxyXG5cdFx0XHRiID0gQHBlcmZvcm1hbmNlX3JhdGluZyByYXRpbmdzLCAwLjc1XHJcblx0XHRcdHJldHVybiAyKmItYVxyXG5cdFx0aWYgc2NvcmUgPT0gMFxyXG5cdFx0XHRhID0gQHBlcmZvcm1hbmNlX3JhdGluZyByYXRpbmdzLCAxLjBcclxuXHRcdFx0YiA9IEBwZXJmb3JtYW5jZV9yYXRpbmcgcmF0aW5ncywgMC41XHJcblx0XHRcdHJldHVybiAyKmItYVxyXG5cdFx0aWYgc2NvcmUgPT0gcmF0aW5ncy5sZW5ndGhcclxuXHRcdFx0YSA9IEBwZXJmb3JtYW5jZV9yYXRpbmcgcmF0aW5ncywgc2NvcmUgLSAxLjBcclxuXHRcdFx0YiA9IEBwZXJmb3JtYW5jZV9yYXRpbmcgcmF0aW5ncywgc2NvcmUgLSAwLjVcclxuXHRcdFx0cmV0dXJuIDIqYi1hXHJcblx0XHRsbyA9IDBcclxuXHRcdGhpID0gNDAwMFxyXG5cdFx0d2hpbGUgaGkgLSBsbyA+IDAuMDAxXHJcblx0XHRcdHJhdGluZyA9IChsbyArIGhpKSAvIDJcclxuXHRcdFx0aWYgc2NvcmUgPiBAZXhwZWN0ZWRfc2NvcmUgcmF0aW5ncywgcmF0aW5nXHJcblx0XHRcdFx0bG8gPSByYXRpbmdcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGhpID0gcmF0aW5nXHJcblx0XHRyYXRpbmdcclxuXHJcblx0cGVyZm9ybWFuY2UgOiAtPlxyXG5cdFx0c2NvcmUgPSAwXHJcblx0XHRyYXRpbmdzID0gW11cclxuXHRcdGZvciByIGluIHJhbmdlIEByZXMubGVuZ3RoXHJcblx0XHRcdGlmIEBvcHBbcl0gPT0gZy5CWUUgdGhlbiBjb250aW51ZVxyXG5cdFx0XHRpZiBAb3BwW3JdID09IGcuUEFVU0UgdGhlbiBjb250aW51ZVxyXG5cdFx0XHRzY29yZSArPSBAcmVzW3JdLzJcclxuXHRcdFx0cmF0aW5ncy5wdXNoIGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRFtAb3BwW3JdXS5lbG9cclxuXHRcdEBwZXJmb3JtYW5jZV9yYXRpbmcgcmF0aW5ncyxzY29yZVxyXG5cclxuXHQjIGVuaGFuY2VkX3BlcmZvcm1hbmNlIDogLT5cclxuXHQjIFx0c2NvcmUgPSAwIFxyXG5cdCMgXHRyYXRpbmdzID0gW11cclxuXHQjIFx0Zm9yIHIgaW4gcmFuZ2UgQHJlcy5sZW5ndGhcclxuXHQjIFx0XHRpZiBAb3BwW3JdID09IGcuQllFIHRoZW4gY29udGludWVcclxuXHQjIFx0XHRpZiBAb3BwW3JdID09IGcuUEFVU0UgdGhlbiBjb250aW51ZVxyXG5cdCMgXHRcdHNjb3JlICs9IEByZXNbcl0vMlxyXG5cdCMgXHRcdHJhdGluZ3MucHVzaCBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbQG9wcFtyXV0uZWxvXHJcblx0IyBcdHNjb3JlICs9IDAuNSAjIGZpa3RpdiByZW1pXHJcblx0IyBcdHJhdGluZ3MucHVzaCBnLmF2ZXJhZ2UgIyBnbG9iYWwgYXZlcmFnZSBvcHBvbmVudCBlbG9cclxuXHQjIFx0QHBlcmZvcm1hbmNlX3JhdGluZyByYXRpbmdzLHNjb3JlXHJcblxyXG5cdGNoYW5nZSA6IChyb3VuZHMpIC0+IEBwZXJmb3JtYW5jZSgpXHJcblx0c2NvcmUgOiAocm91bmRzKSAtPiBnLnN1bSAocGFyc2VJbnQgQHJlc1tyXSBmb3IgciBpbiByYW5nZSByb3VuZHMtMSlcclxuXHJcblx0ZWxvRGlmZkFicyA6IC0+XHJcblx0XHRyZXMgPSBbXVxyXG5cdFx0Zm9yIGlkIGluIEBvcHAuc2xpY2UgMCwgQG9wcC5sZW5ndGggIyAtIDFcclxuXHRcdFx0aWYgaWQgPj0gMCB0aGVuIHJlcy5wdXNoIGFicyBAZWxvIC0gZy50b3VybmFtZW50LnBsYXllcnNCeUlEW2lkXS5lbG9cclxuXHRcdGcuc3VtIHJlc1xyXG5cclxuXHRiYWxhbnMgOiAtPiAjIGbDpHJnYmFsYW5zXHJcblx0XHRyZXN1bHQgPSAwXHJcblx0XHRmb3IgY2ggaW4gQGNvbFxyXG5cdFx0XHRpZiBjaD09J2InIHRoZW4gcmVzdWx0IC09IDFcclxuXHRcdFx0aWYgY2g9PSd3JyB0aGVuIHJlc3VsdCArPSAxXHJcblx0XHRyZXN1bHRcclxuXHJcblx0cmVhZCA6IChwbGF5ZXIpIC0+IFxyXG5cdFx0QGVsbyA9IHBhcnNlSW50IHBsYXllclswXVxyXG5cdFx0QG5hbWUgPSBwbGF5ZXJbMV1cclxuXHRcdEBvcHAgPSBbXVxyXG5cdFx0QGNvbCA9IFwiXCJcclxuXHRcdEByZXMgPSBcIlwiXHJcblx0XHRpZiBwbGF5ZXIubGVuZ3RoIDwgMyB0aGVuIHJldHVyblxyXG5cdFx0b2NycyA9IHBsYXllci5zbGljZSAyXHJcblx0XHRmb3Igb2NyIGluIG9jcnNcclxuXHRcdFx0aWYgJ3cnIGluIG9jciB0aGVuIGNvbD0ndydcclxuXHRcdFx0aWYgJ2InIGluIG9jciB0aGVuIGNvbD0nYidcclxuXHRcdFx0aWYgJ18nIGluIG9jciB0aGVuIGNvbD0nXydcclxuXHRcdFx0YXJyID0gb2NyLnNwbGl0IGNvbFxyXG5cdFx0XHRAb3BwLnB1c2ggcGFyc2VJbnQgYXJyWzBdXHJcblx0XHRcdEBjb2wgKz0gY29sXHJcblx0XHRcdGlmIGFyci5sZW5ndGggPT0gMiBhbmQgYXJyWzFdLmxlbmd0aCA9PSAxIHRoZW4gQHJlcyArPSBhcnJbMV1cclxuXHJcblx0d3JpdGUgOiAtPiAjIDEyMzQhQ2hyaXN0ZXIhMTJ3MCEyM2IxITE0dzIgICBFbG86MTIzNCBOYW1lOkNocmlzdGVyIG9wcG9uZW50OjIzIGNvbG9yOmIgcmVzdWx0OjFcclxuXHRcdHJlcyA9IFtdXHJcblx0XHRyZXMucHVzaCBAZWxvXHJcblx0XHRyZXMucHVzaCBAbmFtZVx0XHRcclxuXHRcdHIgPSBAb3BwLmxlbmd0aFxyXG5cdFx0aWYgciA9PSAwIHRoZW4gcmV0dXJuIHJlcy5qb2luIFNFUEFSQVRPUlxyXG5cdFx0b2NyID0gKFwiI3tAb3BwW2ldfSN7QGNvbFtpXX0je2lmIGkgPCByIHRoZW4gQHJlc1tpXSBlbHNlICcnfVwiIGZvciBpIGluIHJhbmdlIHIpXHJcblx0XHRyZXMucHVzaCBvY3Iuam9pbiBTRVBBUkFUT1JcclxuXHRcdHJlcy5qb2luIFNFUEFSQVRPUlxyXG4iXX0=
//# sourceURL=c:\github\FairPair\coffee\player.coffee