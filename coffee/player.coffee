import { g,print,range,scalex,scaley,SEPARATOR } from './globals.js' 

export class Player
	constructor : (@id, @name="", @elo="1400", @opp=[], @col="", @res="", @active = true) -> 
		@cache = {}
		@pos = [] # one for each round

	toggle : -> 
		@active = not @active
		g.tournament.paused = (p.id for p in g.tournament.playersByID when not p.active)

	bye : -> g.BYE in @opp

	# calcRound0 : (r) ->
	# 	if @opp[r] == g.BYE then return g.K * (1.0 - g.F 0)
	# 	if @opp[r] == g.PAUSE then return 0
	# 	if r >= @res.length then return 0
	# 	a = @elo
	# 	b = g.tournament.playersByID[@opp[r]].elo
	# 	diff = a - b
	# 	g.K * (@res[r]/2 - g.F diff)

	calcRound1 : (r) -> 
		if @opp[r] == g.BYE   then return @elo + g.OFFSET
		if @opp[r] == g.PAUSE then return 0
		if r >= @res.length then return 0
		b = g.tournament.playersByID[@opp[r]].elo + g.OFFSET
		if @res[r] == '2' then return b   # WIN
		if @res[r] == '1' then return b/2 # DRAW
		0 # LOSS

	# performance : (r) ->
	# 	if @opp[r] == g.BYE   then return @elo + 400
	# 	if @opp[r] == g.PAUSE then return 0
	# 	if r >= @res.length then return 0
	# 	b = g.tournament.playersByID[@opp[r]].elo
	# 	if @res[r] == '2' then return b + 400  # WIN
	# 	if @res[r] == '1' then return b        # DRAW
	# 	if @res[r] == '0' then return b - 400  # LOSS

	calcRound : (r) ->
		# if g.FACTOR == 0 then @calcRound0 r else @calcRound1 r
		@calcRound1 r

	change : (rounds) ->
		if rounds of @cache then return @cache[rounds]
		@cache[rounds] = g.sum (@calcRound r for r in range rounds)

	# perChg : (rounds) -> # https://en.wikipedia.org/wiki/Performance_rating_(chess)
	# 	g.sum(@performance r for r in range rounds)/(rounds-1)

	score : (rounds) -> g.sum (parseInt @res[r] for r in range rounds-1)
		# result = 0
		# for r in range rounds-1
		# #for ch in @res
		# 	result += parseInt @res[r]
		# result

	avgEloDiff : ->
		res = []
		for id in @opp.slice 0, @opp.length # - 1
			if id >= 0 then res.push abs @elo - g.tournament.playersByID[id].elo
		if res.length == 0 then 0 else g.sum(res) / res.length

	balans : -> # färgbalans
		result = 0
		for ch in @col
			if ch=='b' then result -= 1
			if ch=='w' then result += 1
		result

	# mandatory : -> # w if white, b if black else space
	# 	print 'balans',@balans()
	# 	if @balans >= 1 then return 'b'
	# 	if @balans <= -1 then return 'w'
	# 	n = @col.length
	# 	if n < 2 then return ' '
	# 	if "ww" == @col.slice n-2 then return 'b'
	# 	if "bb" == @col.slice n-2 then return 'w'
	# 	' '

	read : (player) -> 
		# print player
		@elo = parseInt player[0]
		@name = player[1]
		@opp = []
		@col = ""
		@res = ""
		if player.length < 3 then return
		ocrs = player.slice 2
		# print 'ocrs',ocrs
		for ocr in ocrs
			if 'w' in ocr then col='w'
			if 'b' in ocr then col='b'
			if '_' in ocr then col='_'
			arr = ocr.split col
			@opp.push parseInt arr[0]
			@col += col
			if arr.length == 2 and arr[1].length == 1 then @res += arr[1]

	write : -> # 1234!Christer!12w0!23b1!14w2   Elo:1234 Name:Christer opponent:23 color:b result:1
		res = []
		res.push @elo
		res.push @name		
		r = @opp.length
		if r == 0 then return res.join SEPARATOR
		ocr = ("#{@opp[i]}#{@col[i]}#{if i < r then @res[i] else ''}" for i in range r)
		res.push ocr.join SEPARATOR
		res.join SEPARATOR
