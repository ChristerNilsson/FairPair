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
  constructor(id1, name = "", elo = "1400", opp = [], col1 = "", res1 = "", active = true) {
    this.id = id1;
    this.name = name;
    this.elo = elo;
    this.opp = opp;
    this.col = col1;
    this.res = res1;
    this.active = active;
    this.cache = {};
    this.pos = []; // one for each round
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

  // calcRound0 : (r) ->
  // 	if @opp[r] == g.BYE then return g.K * (1.0 - g.F 0)
  // 	if @opp[r] == g.PAUSE then return 0
  // 	if r >= @res.length then return 0
  // 	a = @elo
  // 	b = g.tournament.playersByID[@opp[r]].elo
  // 	diff = a - b
  // 	g.K * (@res[r]/2 - g.F diff)
  calcRound1(r) {
    var b, color, faktor;
    if (this.opp[r] === g.BYE) {
      return this.elo + g.OFFSET;
    }
    if (this.opp[r] === g.PAUSE) {
      return 0;
    }
    if (r >= this.res.length) {
      return 0;
    }
    b = g.tournament.playersByID[this.opp[r]].elo + g.OFFSET;
    color = this.col[r];
    if (color === 'b') {
      faktor = 1 + 2 * g.BONUS / 100; // t ex 1.02
    }
    if (color === 'w') {
      faktor = 1 - 2 * g.BONUS / 100; // t ex 0.98
    }
    if (this.res[r] === '2') {
      return faktor * b; // WIN
    }
    if (this.res[r] === '1') {
      return faktor * b / 2; // DRAW 
    }
    return 0; // LOSS
  }

  explanation(r) {
    var b, color, faktor, result;
    if (this.opp[r] === g.BYE) {
      return "";
    }
    if (this.opp[r] === g.PAUSE) {
      return "";
    }
    if (r >= this.res.length) {
      return "";
    }
    if (this.res[r] === '0') {
      return "0";
    }
    b = g.tournament.playersByID[this.opp[r]].elo + g.OFFSET;
    color = this.col[r];
    if (color === 'b') {
      faktor = 1 + 2 * g.BONUS / 100; // t ex 1.02
    }
    if (color === 'w') {
      faktor = 1 - 2 * g.BONUS / 100; // t ex 0.98
    }
    if (this.res[r] === '2') {
      faktor /= 1; // WIN
    }
    if (this.res[r] === '1') {
      faktor /= 2; // DRAW  
    }
    result = faktor * b;
    return `${result.toFixed(2)} = ${faktor} * (${g.OFFSET} + ${g.tournament.playersByID[this.opp[r]].elo})`;
  }

  
    // performance : (r) ->
  // 	if @opp[r] == g.BYE   then return @elo + 400
  // 	if @opp[r] == g.PAUSE then return 0
  // 	if r >= @res.length then return 0
  // 	b = g.tournament.playersByID[@opp[r]].elo
  // 	if @res[r] == '2' then return b + 400  # WIN
  // 	if @res[r] == '1' then return b        # DRAW
  // 	if @res[r] == '0' then return b - 400  # LOSS
  calcRound(r) {
    // if g.FACTOR == 0 then @calcRound0 r else @calcRound1 r
    return 1 * this.calcRound1(r);
  }

  change(rounds) {
    var r;
    if (rounds in this.cache) {
      return this.cache[rounds];
    }
    return this.cache[rounds] = g.sum((function() {
      var j, len, ref, results;
      ref = range(rounds);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        results.push(this.calcRound(r));
      }
      return results;
    }).call(this));
  }

  // perChg : (rounds) -> # https://en.wikipedia.org/wiki/Performance_rating_(chess)
  // 	g.sum(@performance r for r in range rounds)/(rounds-1)
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

  // result = 0
  // for r in range rounds-1
  // #for ch in @res
  // 	result += parseInt @res[r]
  // result
  avgEloDiffAbs() {
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
    if (res.length === 0) {
      return 0;
    } else {
      return g.sum(res) / res.length;
    }
  }

  avgEloDiffRel() {
    var id, j, len, ref, res;
    res = [];
    ref = this.opp.slice(0, this.opp.length);
    // - 1
    for (j = 0, len = ref.length; j < len; j++) {
      id = ref[j];
      if (id >= 0) {
        res.push(g.tournament.playersByID[id].elo);
      }
    }
    if (res.length === 0) {
      return 0;
    } else {
      return this.elo - g.sum(res) / res.length;
    }
  }

  // avgEloDiffRel : ->
  // 	res = []
  // 	for id in @opp.slice 0, @opp.length # - 1
  // 		if id >= 0 then res.push @elo - g.tournament.playersByID[id].elo
  // 	if res.length == 0 then 0 else g.sum(res) / res.length
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

  // mandatory : -> # w if white, b if black else space
  // 	print 'balans',@balans()
  // 	if @balans >= 1 then return 'b'
  // 	if @balans <= -1 then return 'w'
  // 	n = @col.length
  // 	if n < 2 then return ' '
  // 	if "ww" == @col.slice n-2 then return 'b'
  // 	if "bb" == @col.slice n-2 then return 'w'
  // 	' '
  read(player) {
    var arr, col, j, len, ocr, ocrs, results;
    
    // print player
    this.elo = parseInt(player[0]);
    this.name = player[1];
    this.opp = [];
    this.col = "";
    this.res = "";
    if (player.length < 3) {
      return;
    }
    ocrs = player.slice(2);
// print 'ocrs',ocrs
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7RUFBcUMsU0FBckM7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxTQUFOLE1BQUEsT0FBQTtFQUNOLFdBQWMsSUFBQSxTQUFZLEVBQVosUUFBcUIsTUFBckIsUUFBa0MsRUFBbEMsU0FBMkMsRUFBM0MsU0FBb0QsRUFBcEQsV0FBa0UsSUFBbEUsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUFJLElBQUMsQ0FBQTtJQUFTLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUN0RSxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUE7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPLEdBRk07RUFBQTs7RUFJZCxNQUFTLENBQUEsQ0FBQTtBQUNWLFFBQUE7SUFBRSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQUksSUFBQyxDQUFBO1dBQ2YsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFiOztBQUF1QjtBQUFBO01BQUEsS0FBQSxxQ0FBQTs7WUFBNEMsQ0FBSSxDQUFDLENBQUM7dUJBQWxELENBQUMsQ0FBQzs7TUFBRixDQUFBOzs7RUFGZjs7RUFJVCxHQUFNLENBQUEsQ0FBQTtBQUFFLFFBQUE7aUJBQUMsQ0FBQyxDQUFDLGtCQUFPLElBQUMsQ0FBQSxLQUFWO0VBQUgsQ0FSUDs7Ozs7Ozs7OztFQW1CQyxVQUFhLENBQUMsQ0FBRCxDQUFBO0FBQ2QsUUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBO0lBQUUsSUFBRyxJQUFDLENBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSixLQUFXLENBQUMsQ0FBQyxHQUFoQjtBQUEyQixh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QWpCLENBQUEsQ0FBQSxDQUEwQixDQUFBLEdBQUksQ0FBUCxHQUFjLElBQUMsQ0FBQSxHQUFHLENBQUMsQ0FBRCxDQUFsQixHQUEyQixFQUFsRCxDQUFBO01BQUEsQ0FBQTs7O0lBQ1AsR0FBRyxDQUFDLElBQUosQ0FBUyxHQUFHLENBQUMsSUFBSixDQUFTLFNBQVQsQ0FBVDtXQUNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBVDtFQVJPOztBQS9IRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGcscHJpbnQscmFuZ2Usc2NhbGV4LHNjYWxleSxTRVBBUkFUT1IgfSBmcm9tICcuL2dsb2JhbHMuanMnIFxyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllclxyXG5cdGNvbnN0cnVjdG9yIDogKEBpZCwgQG5hbWU9XCJcIiwgQGVsbz1cIjE0MDBcIiwgQG9wcD1bXSwgQGNvbD1cIlwiLCBAcmVzPVwiXCIsIEBhY3RpdmUgPSB0cnVlKSAtPiBcclxuXHRcdEBjYWNoZSA9IHt9XHJcblx0XHRAcG9zID0gW10gIyBvbmUgZm9yIGVhY2ggcm91bmRcclxuXHJcblx0dG9nZ2xlIDogLT4gXHJcblx0XHRAYWN0aXZlID0gbm90IEBhY3RpdmVcclxuXHRcdGcudG91cm5hbWVudC5wYXVzZWQgPSAocC5pZCBmb3IgcCBpbiBnLnRvdXJuYW1lbnQucGxheWVyc0J5SUQgd2hlbiBub3QgcC5hY3RpdmUpXHJcblxyXG5cdGJ5ZSA6IC0+IGcuQllFIGluIEBvcHBcclxuXHJcblx0IyBjYWxjUm91bmQwIDogKHIpIC0+XHJcblx0IyBcdGlmIEBvcHBbcl0gPT0gZy5CWUUgdGhlbiByZXR1cm4gZy5LICogKDEuMCAtIGcuRiAwKVxyXG5cdCMgXHRpZiBAb3BwW3JdID09IGcuUEFVU0UgdGhlbiByZXR1cm4gMFxyXG5cdCMgXHRpZiByID49IEByZXMubGVuZ3RoIHRoZW4gcmV0dXJuIDBcclxuXHQjIFx0YSA9IEBlbG9cclxuXHQjIFx0YiA9IGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRFtAb3BwW3JdXS5lbG9cclxuXHQjIFx0ZGlmZiA9IGEgLSBiXHJcblx0IyBcdGcuSyAqIChAcmVzW3JdLzIgLSBnLkYgZGlmZilcclxuXHJcblx0Y2FsY1JvdW5kMSA6IChyKSAtPiBcclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5CWUUgICB0aGVuIHJldHVybiBAZWxvICsgZy5PRkZTRVRcclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5QQVVTRSB0aGVuIHJldHVybiAwXHJcblx0XHRpZiByID49IEByZXMubGVuZ3RoIHRoZW4gcmV0dXJuIDBcclxuXHRcdGIgPSBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbQG9wcFtyXV0uZWxvICsgZy5PRkZTRVRcclxuXHRcdGNvbG9yID0gQGNvbFtyXVxyXG5cdFx0aWYgY29sb3IgPT0gJ2InIHRoZW4gZmFrdG9yID0gMSArIDIgKiBnLkJPTlVTLzEwMCAjIHQgZXggMS4wMlxyXG5cdFx0aWYgY29sb3IgPT0gJ3cnIHRoZW4gZmFrdG9yID0gMSAtIDIgKiBnLkJPTlVTLzEwMCAjIHQgZXggMC45OFxyXG5cdFx0aWYgQHJlc1tyXSA9PSAnMicgdGhlbiByZXR1cm4gZmFrdG9yICogYiAgICMgV0lOXHJcblx0XHRpZiBAcmVzW3JdID09ICcxJyB0aGVuIHJldHVybiBmYWt0b3IgKiBiLzIgIyBEUkFXIFxyXG5cdFx0MCAjIExPU1NcclxuXHJcblx0ZXhwbGFuYXRpb24gOiAocikgLT5cclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5CWUUgICB0aGVuIHJldHVybiBcIlwiXHJcblx0XHRpZiBAb3BwW3JdID09IGcuUEFVU0UgdGhlbiByZXR1cm4gXCJcIlxyXG5cdFx0aWYgciA+PSBAcmVzLmxlbmd0aCB0aGVuIHJldHVybiBcIlwiXHJcblx0XHRpZiBAcmVzW3JdID09ICcwJyB0aGVuIHJldHVybiBcIjBcIlxyXG5cdFx0YiA9IGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRFtAb3BwW3JdXS5lbG8gKyBnLk9GRlNFVCBcclxuXHRcdGNvbG9yID0gQGNvbFtyXVxyXG5cdFx0aWYgY29sb3IgPT0gJ2InIHRoZW4gZmFrdG9yID0gMSArIDIgKiBnLkJPTlVTLzEwMCAjIHQgZXggMS4wMlxyXG5cdFx0aWYgY29sb3IgPT0gJ3cnIHRoZW4gZmFrdG9yID0gMSAtIDIgKiBnLkJPTlVTLzEwMCAjIHQgZXggMC45OFxyXG5cdFx0aWYgQHJlc1tyXSA9PSAnMicgdGhlbiBmYWt0b3IgLz0gMSAgICMgV0lOXHJcblx0XHRpZiBAcmVzW3JdID09ICcxJyB0aGVuIGZha3RvciAvPSAyICAgIyBEUkFXICBcclxuXHRcdHJlc3VsdCA9IGZha3RvciAqIGIgXHJcblx0XHRcIiN7cmVzdWx0LnRvRml4ZWQoMil9ID0gI3tmYWt0b3J9ICogKCN7Zy5PRkZTRVR9ICsgI3tnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbQG9wcFtyXV0uZWxvfSlcIiBcclxuXHJcblx0IyBwZXJmb3JtYW5jZSA6IChyKSAtPlxyXG5cdCMgXHRpZiBAb3BwW3JdID09IGcuQllFICAgdGhlbiByZXR1cm4gQGVsbyArIDQwMFxyXG5cdCMgXHRpZiBAb3BwW3JdID09IGcuUEFVU0UgdGhlbiByZXR1cm4gMFxyXG5cdCMgXHRpZiByID49IEByZXMubGVuZ3RoIHRoZW4gcmV0dXJuIDBcclxuXHQjIFx0YiA9IGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRFtAb3BwW3JdXS5lbG9cclxuXHQjIFx0aWYgQHJlc1tyXSA9PSAnMicgdGhlbiByZXR1cm4gYiArIDQwMCAgIyBXSU5cclxuXHQjIFx0aWYgQHJlc1tyXSA9PSAnMScgdGhlbiByZXR1cm4gYiAgICAgICAgIyBEUkFXXHJcblx0IyBcdGlmIEByZXNbcl0gPT0gJzAnIHRoZW4gcmV0dXJuIGIgLSA0MDAgICMgTE9TU1xyXG5cclxuXHRjYWxjUm91bmQgOiAocikgLT5cclxuXHRcdCMgaWYgZy5GQUNUT1IgPT0gMCB0aGVuIEBjYWxjUm91bmQwIHIgZWxzZSBAY2FsY1JvdW5kMSByXHJcblx0XHQxICogQGNhbGNSb3VuZDEgclxyXG5cclxuXHRjaGFuZ2UgOiAocm91bmRzKSAtPlxyXG5cdFx0aWYgcm91bmRzIG9mIEBjYWNoZSB0aGVuIHJldHVybiBAY2FjaGVbcm91bmRzXVxyXG5cdFx0QGNhY2hlW3JvdW5kc10gPSBnLnN1bSAoQGNhbGNSb3VuZCByIGZvciByIGluIHJhbmdlIHJvdW5kcylcclxuXHJcblx0IyBwZXJDaGcgOiAocm91bmRzKSAtPiAjIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1BlcmZvcm1hbmNlX3JhdGluZ18oY2hlc3MpXHJcblx0IyBcdGcuc3VtKEBwZXJmb3JtYW5jZSByIGZvciByIGluIHJhbmdlIHJvdW5kcykvKHJvdW5kcy0xKVxyXG5cclxuXHRzY29yZSA6IChyb3VuZHMpIC0+IGcuc3VtIChwYXJzZUludCBAcmVzW3JdIGZvciByIGluIHJhbmdlIHJvdW5kcy0xKVxyXG5cdFx0IyByZXN1bHQgPSAwXHJcblx0XHQjIGZvciByIGluIHJhbmdlIHJvdW5kcy0xXHJcblx0XHQjICNmb3IgY2ggaW4gQHJlc1xyXG5cdFx0IyBcdHJlc3VsdCArPSBwYXJzZUludCBAcmVzW3JdXHJcblx0XHQjIHJlc3VsdFxyXG5cclxuXHRhdmdFbG9EaWZmQWJzIDogLT5cclxuXHRcdHJlcyA9IFtdXHJcblx0XHRmb3IgaWQgaW4gQG9wcC5zbGljZSAwLCBAb3BwLmxlbmd0aCAjIC0gMVxyXG5cdFx0XHRpZiBpZCA+PSAwIHRoZW4gcmVzLnB1c2ggYWJzIEBlbG8gLSBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbaWRdLmVsb1xyXG5cdFx0aWYgcmVzLmxlbmd0aCA9PSAwIHRoZW4gMCBlbHNlIGcuc3VtKHJlcykgLyByZXMubGVuZ3RoXHJcblxyXG5cdGF2Z0Vsb0RpZmZSZWwgOiAtPlxyXG5cdFx0cmVzID0gW11cclxuXHRcdGZvciBpZCBpbiBAb3BwLnNsaWNlIDAsIEBvcHAubGVuZ3RoICMgLSAxXHJcblx0XHRcdGlmIGlkID49IDAgdGhlbiByZXMucHVzaCBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbaWRdLmVsb1xyXG5cdFx0aWYgcmVzLmxlbmd0aCA9PSAwIHRoZW4gMCBlbHNlIEBlbG8gLSBnLnN1bShyZXMpIC8gcmVzLmxlbmd0aFxyXG5cclxuXHQjIGF2Z0Vsb0RpZmZSZWwgOiAtPlxyXG5cdCMgXHRyZXMgPSBbXVxyXG5cdCMgXHRmb3IgaWQgaW4gQG9wcC5zbGljZSAwLCBAb3BwLmxlbmd0aCAjIC0gMVxyXG5cdCMgXHRcdGlmIGlkID49IDAgdGhlbiByZXMucHVzaCBAZWxvIC0gZy50b3VybmFtZW50LnBsYXllcnNCeUlEW2lkXS5lbG9cclxuXHQjIFx0aWYgcmVzLmxlbmd0aCA9PSAwIHRoZW4gMCBlbHNlIGcuc3VtKHJlcykgLyByZXMubGVuZ3RoXHJcblxyXG5cdGJhbGFucyA6IC0+ICMgZsOkcmdiYWxhbnNcclxuXHRcdHJlc3VsdCA9IDBcclxuXHRcdGZvciBjaCBpbiBAY29sXHJcblx0XHRcdGlmIGNoPT0nYicgdGhlbiByZXN1bHQgLT0gMVxyXG5cdFx0XHRpZiBjaD09J3cnIHRoZW4gcmVzdWx0ICs9IDFcclxuXHRcdHJlc3VsdFxyXG5cclxuXHQjIG1hbmRhdG9yeSA6IC0+ICMgdyBpZiB3aGl0ZSwgYiBpZiBibGFjayBlbHNlIHNwYWNlXHJcblx0IyBcdHByaW50ICdiYWxhbnMnLEBiYWxhbnMoKVxyXG5cdCMgXHRpZiBAYmFsYW5zID49IDEgdGhlbiByZXR1cm4gJ2InXHJcblx0IyBcdGlmIEBiYWxhbnMgPD0gLTEgdGhlbiByZXR1cm4gJ3cnXHJcblx0IyBcdG4gPSBAY29sLmxlbmd0aFxyXG5cdCMgXHRpZiBuIDwgMiB0aGVuIHJldHVybiAnICdcclxuXHQjIFx0aWYgXCJ3d1wiID09IEBjb2wuc2xpY2Ugbi0yIHRoZW4gcmV0dXJuICdiJ1xyXG5cdCMgXHRpZiBcImJiXCIgPT0gQGNvbC5zbGljZSBuLTIgdGhlbiByZXR1cm4gJ3cnXHJcblx0IyBcdCcgJ1xyXG5cclxuXHRyZWFkIDogKHBsYXllcikgLT4gXHJcblx0XHQjIHByaW50IHBsYXllclxyXG5cdFx0QGVsbyA9IHBhcnNlSW50IHBsYXllclswXVxyXG5cdFx0QG5hbWUgPSBwbGF5ZXJbMV1cclxuXHRcdEBvcHAgPSBbXVxyXG5cdFx0QGNvbCA9IFwiXCJcclxuXHRcdEByZXMgPSBcIlwiXHJcblx0XHRpZiBwbGF5ZXIubGVuZ3RoIDwgMyB0aGVuIHJldHVyblxyXG5cdFx0b2NycyA9IHBsYXllci5zbGljZSAyXHJcblx0XHQjIHByaW50ICdvY3JzJyxvY3JzXHJcblx0XHRmb3Igb2NyIGluIG9jcnNcclxuXHRcdFx0aWYgJ3cnIGluIG9jciB0aGVuIGNvbD0ndydcclxuXHRcdFx0aWYgJ2InIGluIG9jciB0aGVuIGNvbD0nYidcclxuXHRcdFx0aWYgJ18nIGluIG9jciB0aGVuIGNvbD0nXydcclxuXHRcdFx0YXJyID0gb2NyLnNwbGl0IGNvbFxyXG5cdFx0XHRAb3BwLnB1c2ggcGFyc2VJbnQgYXJyWzBdXHJcblx0XHRcdEBjb2wgKz0gY29sXHJcblx0XHRcdGlmIGFyci5sZW5ndGggPT0gMiBhbmQgYXJyWzFdLmxlbmd0aCA9PSAxIHRoZW4gQHJlcyArPSBhcnJbMV1cclxuXHJcblx0d3JpdGUgOiAtPiAjIDEyMzQhQ2hyaXN0ZXIhMTJ3MCEyM2IxITE0dzIgICBFbG86MTIzNCBOYW1lOkNocmlzdGVyIG9wcG9uZW50OjIzIGNvbG9yOmIgcmVzdWx0OjFcclxuXHRcdHJlcyA9IFtdXHJcblx0XHRyZXMucHVzaCBAZWxvXHJcblx0XHRyZXMucHVzaCBAbmFtZVx0XHRcclxuXHRcdHIgPSBAb3BwLmxlbmd0aFxyXG5cdFx0aWYgciA9PSAwIHRoZW4gcmV0dXJuIHJlcy5qb2luIFNFUEFSQVRPUlxyXG5cdFx0b2NyID0gKFwiI3tAb3BwW2ldfSN7QGNvbFtpXX0je2lmIGkgPCByIHRoZW4gQHJlc1tpXSBlbHNlICcnfVwiIGZvciBpIGluIHJhbmdlIHIpXHJcblx0XHRyZXMucHVzaCBvY3Iuam9pbiBTRVBBUkFUT1JcclxuXHRcdHJlcy5qb2luIFNFUEFSQVRPUlxyXG4iXX0=
//# sourceURL=c:\github\FairPair\coffee\player.coffee