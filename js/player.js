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
    var hi, lo, rating;
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

  // avgEloDiffAbs : ->
  // 	res = []
  // 	for id in @opp.slice 0, @opp.length # - 1
  // 		if id >= 0 then res.push abs @elo - g.tournament.playersByID[id].elo
  // 	if res.length == 0 then 0 else g.sum(res) / res.length

    // avgEloDiffRel : ->
  // 	res = []
  // 	for id in @opp.slice 0, @opp.length # - 1
  // 		if id >= 0 then res.push g.tournament.playersByID[id].elo
  // 	if res.length == 0 then 0 else @elo - g.sum(res) / res.length
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7RUFBcUMsU0FBckM7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxTQUFOLE1BQUEsT0FBQTtFQUNOLFdBQWMsSUFBQSxTQUFZLEVBQVosUUFBcUIsTUFBckIsU0FBa0MsRUFBbEMsU0FBMkMsRUFBM0MsU0FBb0QsRUFBcEQsV0FBa0UsSUFBbEUsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUFJLElBQUMsQ0FBQTtJQUFTLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFrQixJQUFDLENBQUEsR0FBRCxHQUFPO0VBQWxGOztFQUVkLE1BQVMsQ0FBQSxDQUFBO0FBQ1YsUUFBQTtJQUFFLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBSSxJQUFDLENBQUE7V0FDZixDQUFDLENBQUMsVUFBVSxDQUFDLE1BQWI7O0FBQXVCO0FBQUE7TUFBQSxLQUFBLHFDQUFBOztZQUE0QyxDQUFJLENBQUMsQ0FBQzt1QkFBbEQsQ0FBQyxDQUFDOztNQUFGLENBQUE7OztFQUZmOztFQUlULEdBQU0sQ0FBQSxDQUFBO0FBQUUsUUFBQTtpQkFBQyxDQUFDLENBQUMsa0JBQU8sSUFBQyxDQUFBLEtBQVY7RUFBSDs7RUFFTixXQUFjLENBQUMsQ0FBRCxDQUFBO0FBQ2YsUUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUUsSUFBRyxJQUFDLENBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSixLQUFXLENBQUMsQ0FBQyxHQUFoQjtBQUEyQixhQUFPLEdBQWxDOztJQUNBLElBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENB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ZSxzY2FsZXgsc2NhbGV5LFNFUEFSQVRPUiB9IGZyb20gJy4vZ2xvYmFscy5qcycgXHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyXHJcblx0Y29uc3RydWN0b3IgOiAoQGlkLCBAbmFtZT1cIlwiLCBAZWxvPVwiMTQwMFwiLCBAb3BwPVtdLCBAY29sPVwiXCIsIEByZXM9XCJcIiwgQGFjdGl2ZSA9IHRydWUpIC0+IEBwb3MgPSBbXVxyXG5cclxuXHR0b2dnbGUgOiAtPiBcclxuXHRcdEBhY3RpdmUgPSBub3QgQGFjdGl2ZVxyXG5cdFx0Zy50b3VybmFtZW50LnBhdXNlZCA9IChwLmlkIGZvciBwIGluIGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRCB3aGVuIG5vdCBwLmFjdGl2ZSlcclxuXHJcblx0YnllIDogLT4gZy5CWUUgaW4gQG9wcFxyXG5cclxuXHRleHBsYW5hdGlvbiA6IChyKSAtPlxyXG5cdFx0aWYgQG9wcFtyXSA9PSBnLkJZRSAgIHRoZW4gcmV0dXJuIFwiXCJcclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5QQVVTRSB0aGVuIHJldHVybiBcIlwiXHJcblx0XHRyZXMgPSBbJ0xvc3MnLCdEcmF3JywnV2luJ11bQHJlc1tyXV1cclxuXHRcdG9wcCA9IGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRFtAb3BwW3JdXVxyXG5cdFx0Y29sID0gaWYgQGNvbFtyXT09J3cnIHRoZW4gJ3doaXRlJyBlbHNlICdibGFjaydcclxuXHRcdFwiI3tyZXN9IGFnYWluc3QgI3tvcHAuZWxvfSAje29wcC5uYW1lfSBhcyAje2NvbH1cIlxyXG5cclxuXHRleHBlY3RlZF9zY29yZSA6IChyYXRpbmdzLCBvd25fcmF0aW5nKSAtPlxyXG5cdFx0Zy5zdW0oMSAvICgxICsgMTAqKigocmF0aW5nIC0gb3duX3JhdGluZykgLyA0MDApKSBmb3IgcmF0aW5nIGluIHJhdGluZ3MpICAgXHJcblxyXG5cdHBlcmZvcm1hbmNlX3JhdGluZyA6IChyYXRpbmdzLCBzY29yZSkgLT5cclxuXHRcdGxvID0gMFxyXG5cdFx0aGkgPSA0MDAwXHJcblx0XHR3aGlsZSBoaSAtIGxvID4gMC4wMDFcclxuXHRcdFx0cmF0aW5nID0gKGxvICsgaGkpIC8gMlxyXG5cdFx0XHRpZiBzY29yZSA+IEBleHBlY3RlZF9zY29yZSByYXRpbmdzLCByYXRpbmdcclxuXHRcdFx0XHRsbyA9IHJhdGluZ1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aGkgPSByYXRpbmdcclxuXHRcdHJhdGluZ1xyXG5cclxuXHRwZXJmb3JtYW5jZSA6IC0+XHJcblx0XHRzY29yZSA9IDBcclxuXHRcdHJhdGluZ3MgPSBbXVxyXG5cdFx0Zm9yIHIgaW4gcmFuZ2UgQHJlcy5sZW5ndGhcclxuXHRcdFx0aWYgQG9wcFtyXSA9PSBnLkJZRSB0aGVuIGNvbnRpbnVlXHJcblx0XHRcdGlmIEBvcHBbcl0gPT0gZy5QQVVTRSB0aGVuIGNvbnRpbnVlXHJcblx0XHRcdHNjb3JlICs9IEByZXNbcl0vMlxyXG5cdFx0XHRyYXRpbmdzLnB1c2ggZy50b3VybmFtZW50LnBsYXllcnNCeUlEW0BvcHBbcl1dLmVsb1xyXG5cdFx0QHBlcmZvcm1hbmNlX3JhdGluZyhyYXRpbmdzLHNjb3JlKVxyXG5cclxuXHRjaGFuZ2UgOiAocm91bmRzKSAtPiBAcGVyZm9ybWFuY2UoKVxyXG5cdHNjb3JlIDogKHJvdW5kcykgLT4gZy5zdW0gKHBhcnNlSW50IEByZXNbcl0gZm9yIHIgaW4gcmFuZ2Ugcm91bmRzLTEpXHJcblxyXG5cdGVsb0RpZmZBYnMgOiAtPlxyXG5cdFx0cmVzID0gW11cclxuXHRcdGZvciBpZCBpbiBAb3BwLnNsaWNlIDAsIEBvcHAubGVuZ3RoICMgLSAxXHJcblx0XHRcdGlmIGlkID49IDAgdGhlbiByZXMucHVzaCBhYnMgQGVsbyAtIGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRFtpZF0uZWxvXHJcblx0XHRnLnN1bSByZXNcclxuXHJcblx0IyBhdmdFbG9EaWZmQWJzIDogLT5cclxuXHQjIFx0cmVzID0gW11cclxuXHQjIFx0Zm9yIGlkIGluIEBvcHAuc2xpY2UgMCwgQG9wcC5sZW5ndGggIyAtIDFcclxuXHQjIFx0XHRpZiBpZCA+PSAwIHRoZW4gcmVzLnB1c2ggYWJzIEBlbG8gLSBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbaWRdLmVsb1xyXG5cdCMgXHRpZiByZXMubGVuZ3RoID09IDAgdGhlbiAwIGVsc2UgZy5zdW0ocmVzKSAvIHJlcy5sZW5ndGhcclxuXHJcblx0IyBhdmdFbG9EaWZmUmVsIDogLT5cclxuXHQjIFx0cmVzID0gW11cclxuXHQjIFx0Zm9yIGlkIGluIEBvcHAuc2xpY2UgMCwgQG9wcC5sZW5ndGggIyAtIDFcclxuXHQjIFx0XHRpZiBpZCA+PSAwIHRoZW4gcmVzLnB1c2ggZy50b3VybmFtZW50LnBsYXllcnNCeUlEW2lkXS5lbG9cclxuXHQjIFx0aWYgcmVzLmxlbmd0aCA9PSAwIHRoZW4gMCBlbHNlIEBlbG8gLSBnLnN1bShyZXMpIC8gcmVzLmxlbmd0aFxyXG5cclxuXHRiYWxhbnMgOiAtPiAjIGbDpHJnYmFsYW5zXHJcblx0XHRyZXN1bHQgPSAwXHJcblx0XHRmb3IgY2ggaW4gQGNvbFxyXG5cdFx0XHRpZiBjaD09J2InIHRoZW4gcmVzdWx0IC09IDFcclxuXHRcdFx0aWYgY2g9PSd3JyB0aGVuIHJlc3VsdCArPSAxXHJcblx0XHRyZXN1bHRcclxuXHJcblx0cmVhZCA6IChwbGF5ZXIpIC0+IFxyXG5cdFx0QGVsbyA9IHBhcnNlSW50IHBsYXllclswXVxyXG5cdFx0QG5hbWUgPSBwbGF5ZXJbMV1cclxuXHRcdEBvcHAgPSBbXVxyXG5cdFx0QGNvbCA9IFwiXCJcclxuXHRcdEByZXMgPSBcIlwiXHJcblx0XHRpZiBwbGF5ZXIubGVuZ3RoIDwgMyB0aGVuIHJldHVyblxyXG5cdFx0b2NycyA9IHBsYXllci5zbGljZSAyXHJcblx0XHRmb3Igb2NyIGluIG9jcnNcclxuXHRcdFx0aWYgJ3cnIGluIG9jciB0aGVuIGNvbD0ndydcclxuXHRcdFx0aWYgJ2InIGluIG9jciB0aGVuIGNvbD0nYidcclxuXHRcdFx0aWYgJ18nIGluIG9jciB0aGVuIGNvbD0nXydcclxuXHRcdFx0YXJyID0gb2NyLnNwbGl0IGNvbFxyXG5cdFx0XHRAb3BwLnB1c2ggcGFyc2VJbnQgYXJyWzBdXHJcblx0XHRcdEBjb2wgKz0gY29sXHJcblx0XHRcdGlmIGFyci5sZW5ndGggPT0gMiBhbmQgYXJyWzFdLmxlbmd0aCA9PSAxIHRoZW4gQHJlcyArPSBhcnJbMV1cclxuXHJcblx0d3JpdGUgOiAtPiAjIDEyMzQhQ2hyaXN0ZXIhMTJ3MCEyM2IxITE0dzIgICBFbG86MTIzNCBOYW1lOkNocmlzdGVyIG9wcG9uZW50OjIzIGNvbG9yOmIgcmVzdWx0OjFcclxuXHRcdHJlcyA9IFtdXHJcblx0XHRyZXMucHVzaCBAZWxvXHJcblx0XHRyZXMucHVzaCBAbmFtZVx0XHRcclxuXHRcdHIgPSBAb3BwLmxlbmd0aFxyXG5cdFx0aWYgciA9PSAwIHRoZW4gcmV0dXJuIHJlcy5qb2luIFNFUEFSQVRPUlxyXG5cdFx0b2NyID0gKFwiI3tAb3BwW2ldfSN7QGNvbFtpXX0je2lmIGkgPCByIHRoZW4gQHJlc1tpXSBlbHNlICcnfVwiIGZvciBpIGluIHJhbmdlIHIpXHJcblx0XHRyZXMucHVzaCBvY3Iuam9pbiBTRVBBUkFUT1JcclxuXHRcdHJlcy5qb2luIFNFUEFSQVRPUlxyXG4iXX0=
//# sourceURL=c:\github\FairPair\coffee\player.coffee