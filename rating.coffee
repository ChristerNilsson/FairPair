echo = console.log 

expected_score = (ratings, own_rating) -> summa (1 / (1 + 10**((rating - own_rating) / 400)) for rating in ratings)

# Use two extreme values when calculating 0% or 100%
extrapolate = (a0, b0, elos) ->
	a = performance_rating a0,elos
	b = performance_rating b0,elos
	b + b - a

export performance = (pp,elos) -> 
	n = elos.length
	if pp == 0 then return extrapolate   0.5,  0.25,elos
	if pp == n then return extrapolate n-0.5,n-0.25,elos
	performance_rating pp,elos

# export performance = (pp,elos) -> 
# 	n = elos.length
# 	if n == 1
# 		if pp == 0 then return extrapolate 0.50,0.25,elos
# 		if pp == n then return extrapolate 0.50,0.75,elos
# 	else
# 		if pp == 0 then return extrapolate   1,  0.5,elos
# 		if pp == n then return extrapolate n-1,n-0.5,elos
# 	performance_rating pp,elos

performance_rating = (pp, ratings) ->
	lo = 0
	hi = 4000
	while Math.abs(hi - lo) > 0.001
		rating = (lo + hi) / 2
		if pp > expected_score ratings, rating
			lo = rating
		else
			hi = rating
	#echo 'performance_rating', pp, ratings,rating
	rating

summa = (arr) ->
	res = 0
	for item in arr
		res += item
	res
