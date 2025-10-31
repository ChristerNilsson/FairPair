echo = console.log

ass = (a,b) ->
	if _.isEqual a, b then return
	echo 'Assertion failed: (open the Assertion below to find the failing assertion)'
	echo '  expect', JSON.stringify a 
	echo '  actual', JSON.stringify b
	console.assert false # can be used to track the assert
ass 7, 3 + 4

import {expand} from './tournament.js'
ass [[[1,2],[3,4]],[[2,1],[4,3]],[[1,4],[2,3]],[[4,1],[3,2]]], expand 2, [[[1,2],[3,4]], [[1,4],[2,3]]]

# import {findNumberOfDecimals} from './tournament.js'
# ass 0, findNumberOfDecimals [1200,1200]
# ass 0, findNumberOfDecimals [1200,1201]
# ass 0, findNumberOfDecimals [1200.23,1200.23]
# ass 1, findNumberOfDecimals [1200.23,1200.3]
# ass 1, findNumberOfDecimals [1200.23,1200.3]
# ass 3, findNumberOfDecimals [1200.23,1200.2345]
# ass 0, findNumberOfDecimals [1200.12345,1200.12345]

import {longForm} from './tournament.js'
# ass [
# 	[ 0,11,'w','F']
# 	[ 1,10,'w','0']
# 	[ 2, 9,'w','r']
# 	[ 3, 8,'w','1']
# 	[ 4, 7,'w','0']
# 	[ 5, 6,'w','r']
# 	[ 6, 5,'b','r']
# 	[ 7, 4,'b','1']
# 	[ 8, 3,'b','0']
# 	[ 9, 2,'b','r']
# 	[10, 1,'b','1']
# 	[11, 0,'b','1']
# ], longForm [[1,10], [2,9], [3,8], [4,7], [5,6], [0,11]], "0r10r"
# ass [[1,10,"0"], [2,9,"r"], [3,8,"1"], [4,7,"0"], [5,6,"r"], [0,11,"x"]], longForm [[1,10], [2,9], [3,8], [4,7], [5,6], [0,11]], "0r10rx"

import {other} from './tournament.js'
ass '2', other '0'
ass '1', other '1'
ass '0', other '2'
ass 'x', other 'x'

import {prettyResult} from './tournament.js'
ass "-",     prettyResult 'x'
ass "0 - 1", prettyResult '0'
ass "½ - ½", prettyResult '1'
ass "1 - 0", prettyResult '2'

# import {shortForm} from './tournament.js'
# ass [[1,10,"0"], [2,9,"r"], [3,8,"1"], [4,7,"0"], [5,6,"r"], [0,11,"F"]], shortForm [[1,10], [2,9], [3,8], [4,7], [5,6], [0,11]], "0r10r"
# ass [[1,10,"0"], [2,9,"r"], [3,8,"1"], [4,7,"0"], [5,6,"r"], [0,11,"x"]], shortForm [[1,10], [2,9], [3,8], [4,7], [5,6], [0,11]], "0r10rx"

echo 'Ready!'