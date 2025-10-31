import {echo,global,range,settings} from './global.js'
import {performance} from './rating.js'

export class Player

	constructor : (@id, @name, @elo) ->
		@opp = [] # används endast av Floating
		@col = "" # används endast av Floating
		@summa = 0
		@P = 0
		@PR = 0

	balance : ->
		b = 0
		for c in @col
			if c == 'w' then b++
			if c == 'b' then b--
		b

	toString : -> "#{String(@elo).padStart 4, '0'} #{@name}"

	getElos : (long) ->
		@P = 0
		@PR = 0
		@elos = [@elo, ':']
		for r in range settings.GAMES * settings.ROUNDS
			ch = long[r][3]
			value = '012'.indexOf ch
			opp = long[r][1]
			if value != -1
				elo = global.players[opp].elo
				@P += value/2
				if elo != 0
					@PR += value/2
					@elos.push Math.round elo
			else
				@elos.push '    '
			
		@elos.push @PR
		@elos.join ' '

	update_P_and_PR : (longs,i) ->
		long = longs[i]
		#echo 'longs',longs
		@P = 0
		@PR = 0
		@elos = []
		for r in range settings.GAMES * settings.ROUNDS
			ch = long[r][3]
			value = '012'.indexOf ch
			opp = long[r][1]
			if value != -1
				elo = global.players[opp].elo
				@P += value/2
				if elo != 0
					@PR += value/2
					@elos.push Math.round elo

		# kalkylera performance rating mha vinstandel och elo-tal
		if @elos.length == 0 
			@PR = 0
		else
			andel = @PR
			perf = performance andel, @elos
			@PR = perf
