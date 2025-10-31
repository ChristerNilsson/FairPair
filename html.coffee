echo = console.log

wrap = (type,attr,b...) ->
	b = b.join ""
	if 0 == _.size attr
		"<#{type}>#{b}</#{type}>"
	else 
		attr = ("#{key}=\"#{value}\"" for key,value of attr).join ' '
		return "<#{type} #{attr}>#{b}</#{type}>"

export a     = (attr,b...) -> wrap 'a',    attr,b...
export div   = (attr,b...) -> wrap 'div',  attr,b...
export h2    = (attr,b...) -> wrap 'h2',   attr,b...
export p     = (attr,b...) -> wrap 'p',    attr,b...
export pre   = (attr,b...) -> wrap 'pre',  attr,b...
export table = (attr,b...) -> wrap 'table',attr,b...
export td    = (attr,b...) -> wrap 'td',   attr,b...
export th    = (attr,b...) -> wrap 'th',   attr,b...
export thead = (attr,b...) -> wrap 'thead',attr,b...
export tr    = (attr,b...) -> wrap 'tr',   attr,b...

# Exempel 1

console.assert "<table><tr><td>Christer</td><td>Nilsson</td></tr></table>" == table {}, tr {},
	td {}, "Christer"
	td {}, "Nilsson"

# Exempel 2

console.assert '<table><tr><td style="text-align:left" color="red">JanChrister</td><td style="text-align:left">Nilsson</td></tr></table>' == table {},
	tr {},
		td {style: "text-align:left", color: "red"}, "Jan", "Christer"
		td {style: "text-align:left"}, "Nilsson"

# Resultaten av funktionerna ovan blir alltid en html-sträng

# document.getElementById('tables').innerHTML = tabell
