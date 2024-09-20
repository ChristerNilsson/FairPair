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
    var b;
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
    if (this.res[r] === '2') {
      return b; // WIN
    }
    if (this.res[r] === '1') {
      return b / 2; // DRAW
    }
    return 0; // LOSS
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
    return this.calcRound1(r);
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
  avgEloDiff() {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwiLCJzb3VyY2VzIjpbImNvZmZlZVxccGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxPQUFBO0VBQVMsQ0FBVDtFQUFXLEtBQVg7RUFBaUIsS0FBakI7RUFBdUIsTUFBdkI7RUFBOEIsTUFBOUI7RUFBcUMsU0FBckM7Q0FBQSxNQUFBOztBQUVBLE9BQUEsSUFBYSxTQUFOLE1BQUEsT0FBQTtFQUNOLFdBQWMsSUFBQSxTQUFZLEVBQVosUUFBcUIsTUFBckIsUUFBa0MsRUFBbEMsU0FBMkMsRUFBM0MsU0FBb0QsRUFBcEQsV0FBa0UsSUFBbEUsQ0FBQTtJQUFDLElBQUMsQ0FBQTtJQUFJLElBQUMsQ0FBQTtJQUFTLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUFRLElBQUMsQ0FBQTtJQUN0RSxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUE7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPLEdBRk07RUFBQTs7RUFJZCxNQUFTLENBQUEsQ0FBQTtBQUNWLFFBQUE7SUFBRSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQUksSUFBQyxDQUFBO1dBQ2YsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFiOztBQUF1QjtBQUFBO01BQUEsS0FBQSxxQ0FBQTs7WUFBNEMsQ0FBSSxDQUFDLENBQUM7dUJBQWxELENBQUMsQ0FBQzs7TUFBRixDQUFBOzs7RUFGZjs7RUFJVCxHQUFNLENBQUEsQ0FBQTtBQUFFLFFBQUE7aUJBQUMsQ0FBQyxDQUFDLGtCQUFPLElBQUMsQ0FBQSxLQUFWO0VBQUgsQ0FSUDs7Ozs7Ozs7OztFQW1CQyxVQUFhLENBQUMsQ0FBRCxDQUFBO0FBQ2QsUUFBQTtJQUFFLElBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQUosS0FBVyxDQUFDLENBQUMsR0FBaEI7QUFBMkIsYUFBTyxJQUFDLENBQUEsR0FBRCxH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QUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQVAsQ0FBQSxDQUFBLENBQWEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxDQUFELENBQWpCLENBQUEsQ0FBQSxDQUEwQixDQUFBLEdBQUksQ0FBUCxHQUFjLElBQUMsQ0FBQSxHQUFHLENBQUMsQ0FBRCxDQUFsQixHQUEyQixFQUFsRCxDQUFBO01BQUEsQ0FBQTs7O0lBQ1AsR0FBRyxDQUFDLElBQUosQ0FBUyxHQUFHLENBQUMsSUFBSixDQUFTLFNBQVQsQ0FBVDtXQUNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBVDtFQVJPOztBQWxHRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGcscHJpbnQscmFuZ2Usc2NhbGV4LHNjYWxleSxTRVBBUkFUT1IgfSBmcm9tICcuL2dsb2JhbHMuanMnIFxyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllclxyXG5cdGNvbnN0cnVjdG9yIDogKEBpZCwgQG5hbWU9XCJcIiwgQGVsbz1cIjE0MDBcIiwgQG9wcD1bXSwgQGNvbD1cIlwiLCBAcmVzPVwiXCIsIEBhY3RpdmUgPSB0cnVlKSAtPiBcclxuXHRcdEBjYWNoZSA9IHt9XHJcblx0XHRAcG9zID0gW10gIyBvbmUgZm9yIGVhY2ggcm91bmRcclxuXHJcblx0dG9nZ2xlIDogLT4gXHJcblx0XHRAYWN0aXZlID0gbm90IEBhY3RpdmVcclxuXHRcdGcudG91cm5hbWVudC5wYXVzZWQgPSAocC5pZCBmb3IgcCBpbiBnLnRvdXJuYW1lbnQucGxheWVyc0J5SUQgd2hlbiBub3QgcC5hY3RpdmUpXHJcblxyXG5cdGJ5ZSA6IC0+IGcuQllFIGluIEBvcHBcclxuXHJcblx0IyBjYWxjUm91bmQwIDogKHIpIC0+XHJcblx0IyBcdGlmIEBvcHBbcl0gPT0gZy5CWUUgdGhlbiByZXR1cm4gZy5LICogKDEuMCAtIGcuRiAwKVxyXG5cdCMgXHRpZiBAb3BwW3JdID09IGcuUEFVU0UgdGhlbiByZXR1cm4gMFxyXG5cdCMgXHRpZiByID49IEByZXMubGVuZ3RoIHRoZW4gcmV0dXJuIDBcclxuXHQjIFx0YSA9IEBlbG9cclxuXHQjIFx0YiA9IGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRFtAb3BwW3JdXS5lbG9cclxuXHQjIFx0ZGlmZiA9IGEgLSBiXHJcblx0IyBcdGcuSyAqIChAcmVzW3JdLzIgLSBnLkYgZGlmZilcclxuXHJcblx0Y2FsY1JvdW5kMSA6IChyKSAtPiBcclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5CWUUgICB0aGVuIHJldHVybiBAZWxvICsgZy5PRkZTRVRcclxuXHRcdGlmIEBvcHBbcl0gPT0gZy5QQVVTRSB0aGVuIHJldHVybiAwXHJcblx0XHRpZiByID49IEByZXMubGVuZ3RoIHRoZW4gcmV0dXJuIDBcclxuXHRcdGIgPSBnLnRvdXJuYW1lbnQucGxheWVyc0J5SURbQG9wcFtyXV0uZWxvICsgZy5PRkZTRVRcclxuXHRcdGlmIEByZXNbcl0gPT0gJzInIHRoZW4gcmV0dXJuIGIgICAjIFdJTlxyXG5cdFx0aWYgQHJlc1tyXSA9PSAnMScgdGhlbiByZXR1cm4gYi8yICMgRFJBV1xyXG5cdFx0MCAjIExPU1NcclxuXHJcblx0IyBwZXJmb3JtYW5jZSA6IChyKSAtPlxyXG5cdCMgXHRpZiBAb3BwW3JdID09IGcuQllFICAgdGhlbiByZXR1cm4gQGVsbyArIDQwMFxyXG5cdCMgXHRpZiBAb3BwW3JdID09IGcuUEFVU0UgdGhlbiByZXR1cm4gMFxyXG5cdCMgXHRpZiByID49IEByZXMubGVuZ3RoIHRoZW4gcmV0dXJuIDBcclxuXHQjIFx0YiA9IGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRFtAb3BwW3JdXS5lbG9cclxuXHQjIFx0aWYgQHJlc1tyXSA9PSAnMicgdGhlbiByZXR1cm4gYiArIDQwMCAgIyBXSU5cclxuXHQjIFx0aWYgQHJlc1tyXSA9PSAnMScgdGhlbiByZXR1cm4gYiAgICAgICAgIyBEUkFXXHJcblx0IyBcdGlmIEByZXNbcl0gPT0gJzAnIHRoZW4gcmV0dXJuIGIgLSA0MDAgICMgTE9TU1xyXG5cclxuXHRjYWxjUm91bmQgOiAocikgLT5cclxuXHRcdCMgaWYgZy5GQUNUT1IgPT0gMCB0aGVuIEBjYWxjUm91bmQwIHIgZWxzZSBAY2FsY1JvdW5kMSByXHJcblx0XHRAY2FsY1JvdW5kMSByXHJcblxyXG5cdGNoYW5nZSA6IChyb3VuZHMpIC0+XHJcblx0XHRpZiByb3VuZHMgb2YgQGNhY2hlIHRoZW4gcmV0dXJuIEBjYWNoZVtyb3VuZHNdXHJcblx0XHRAY2FjaGVbcm91bmRzXSA9IGcuc3VtIChAY2FsY1JvdW5kIHIgZm9yIHIgaW4gcmFuZ2Ugcm91bmRzKVxyXG5cclxuXHQjIHBlckNoZyA6IChyb3VuZHMpIC0+ICMgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUGVyZm9ybWFuY2VfcmF0aW5nXyhjaGVzcylcclxuXHQjIFx0Zy5zdW0oQHBlcmZvcm1hbmNlIHIgZm9yIHIgaW4gcmFuZ2Ugcm91bmRzKS8ocm91bmRzLTEpXHJcblxyXG5cdHNjb3JlIDogKHJvdW5kcykgLT4gZy5zdW0gKHBhcnNlSW50IEByZXNbcl0gZm9yIHIgaW4gcmFuZ2Ugcm91bmRzLTEpXHJcblx0XHQjIHJlc3VsdCA9IDBcclxuXHRcdCMgZm9yIHIgaW4gcmFuZ2Ugcm91bmRzLTFcclxuXHRcdCMgI2ZvciBjaCBpbiBAcmVzXHJcblx0XHQjIFx0cmVzdWx0ICs9IHBhcnNlSW50IEByZXNbcl1cclxuXHRcdCMgcmVzdWx0XHJcblxyXG5cdGF2Z0Vsb0RpZmYgOiAtPlxyXG5cdFx0cmVzID0gW11cclxuXHRcdGZvciBpZCBpbiBAb3BwLnNsaWNlIDAsIEBvcHAubGVuZ3RoICMgLSAxXHJcblx0XHRcdGlmIGlkID49IDAgdGhlbiByZXMucHVzaCBhYnMgQGVsbyAtIGcudG91cm5hbWVudC5wbGF5ZXJzQnlJRFtpZF0uZWxvXHJcblx0XHRpZiByZXMubGVuZ3RoID09IDAgdGhlbiAwIGVsc2UgZy5zdW0ocmVzKSAvIHJlcy5sZW5ndGhcclxuXHJcblx0YmFsYW5zIDogLT4gIyBmw6RyZ2JhbGFuc1xyXG5cdFx0cmVzdWx0ID0gMFxyXG5cdFx0Zm9yIGNoIGluIEBjb2xcclxuXHRcdFx0aWYgY2g9PSdiJyB0aGVuIHJlc3VsdCAtPSAxXHJcblx0XHRcdGlmIGNoPT0ndycgdGhlbiByZXN1bHQgKz0gMVxyXG5cdFx0cmVzdWx0XHJcblxyXG5cdCMgbWFuZGF0b3J5IDogLT4gIyB3IGlmIHdoaXRlLCBiIGlmIGJsYWNrIGVsc2Ugc3BhY2VcclxuXHQjIFx0cHJpbnQgJ2JhbGFucycsQGJhbGFucygpXHJcblx0IyBcdGlmIEBiYWxhbnMgPj0gMSB0aGVuIHJldHVybiAnYidcclxuXHQjIFx0aWYgQGJhbGFucyA8PSAtMSB0aGVuIHJldHVybiAndydcclxuXHQjIFx0biA9IEBjb2wubGVuZ3RoXHJcblx0IyBcdGlmIG4gPCAyIHRoZW4gcmV0dXJuICcgJ1xyXG5cdCMgXHRpZiBcInd3XCIgPT0gQGNvbC5zbGljZSBuLTIgdGhlbiByZXR1cm4gJ2InXHJcblx0IyBcdGlmIFwiYmJcIiA9PSBAY29sLnNsaWNlIG4tMiB0aGVuIHJldHVybiAndydcclxuXHQjIFx0JyAnXHJcblxyXG5cdHJlYWQgOiAocGxheWVyKSAtPiBcclxuXHRcdCMgcHJpbnQgcGxheWVyXHJcblx0XHRAZWxvID0gcGFyc2VJbnQgcGxheWVyWzBdXHJcblx0XHRAbmFtZSA9IHBsYXllclsxXVxyXG5cdFx0QG9wcCA9IFtdXHJcblx0XHRAY29sID0gXCJcIlxyXG5cdFx0QHJlcyA9IFwiXCJcclxuXHRcdGlmIHBsYXllci5sZW5ndGggPCAzIHRoZW4gcmV0dXJuXHJcblx0XHRvY3JzID0gcGxheWVyLnNsaWNlIDJcclxuXHRcdCMgcHJpbnQgJ29jcnMnLG9jcnNcclxuXHRcdGZvciBvY3IgaW4gb2Nyc1xyXG5cdFx0XHRpZiAndycgaW4gb2NyIHRoZW4gY29sPSd3J1xyXG5cdFx0XHRpZiAnYicgaW4gb2NyIHRoZW4gY29sPSdiJ1xyXG5cdFx0XHRpZiAnXycgaW4gb2NyIHRoZW4gY29sPSdfJ1xyXG5cdFx0XHRhcnIgPSBvY3Iuc3BsaXQgY29sXHJcblx0XHRcdEBvcHAucHVzaCBwYXJzZUludCBhcnJbMF1cclxuXHRcdFx0QGNvbCArPSBjb2xcclxuXHRcdFx0aWYgYXJyLmxlbmd0aCA9PSAyIGFuZCBhcnJbMV0ubGVuZ3RoID09IDEgdGhlbiBAcmVzICs9IGFyclsxXVxyXG5cclxuXHR3cml0ZSA6IC0+ICMgMTIzNCFDaHJpc3RlciExMncwITIzYjEhMTR3MiAgIEVsbzoxMjM0IE5hbWU6Q2hyaXN0ZXIgb3Bwb25lbnQ6MjMgY29sb3I6YiByZXN1bHQ6MVxyXG5cdFx0cmVzID0gW11cclxuXHRcdHJlcy5wdXNoIEBlbG9cclxuXHRcdHJlcy5wdXNoIEBuYW1lXHRcdFxyXG5cdFx0ciA9IEBvcHAubGVuZ3RoXHJcblx0XHRpZiByID09IDAgdGhlbiByZXR1cm4gcmVzLmpvaW4gU0VQQVJBVE9SXHJcblx0XHRvY3IgPSAoXCIje0BvcHBbaV19I3tAY29sW2ldfSN7aWYgaSA8IHIgdGhlbiBAcmVzW2ldIGVsc2UgJyd9XCIgZm9yIGkgaW4gcmFuZ2UgcilcclxuXHRcdHJlcy5wdXNoIG9jci5qb2luIFNFUEFSQVRPUlxyXG5cdFx0cmVzLmpvaW4gU0VQQVJBVE9SXHJcbiJdfQ==
//# sourceURL=c:\github\ELO-Pairings\coffee\player.coffee