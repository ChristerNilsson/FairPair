export echo = console.log
export range = _.range

export global =

	players : []
	player : null

	results : [] # ronder x bord. cell: 'x', '0', '1' eller '2'
	rounds  : [] # ronder x bord. cell: [w,b] 
	longs   : [] # players x ronder. cell: [w,b,col,res]

	currScreen : 'A' # one of A B C
	currRound : 0
	currTable : 0
	currSort : '#' # one of # E N P R

	frirond : null # ingen frirond. Annars index för frironden

	berger : null
	fairpair : null

export settings =
	TITLE : 'No Title'
	GAMES : 1 # antal partier per rond
	ROUNDS : 0 # antal ronder
	# TIME : "10 5" # minutes
	SORT : 1 # om spelarna initialt ska sorteras på elo
	ONE : 1 # ONE = 1 # 0=dev 1=prod 
	BALANCE : 1 # färgbalans
	DECIMALS : 0 # Antal decimaler i PR
	A : 1 # antal A-kolumner
	B : 1 # antal B-kolumner
	C : 1 # antal C-kolumner
	P : 0 # antal players. 0 = alla
