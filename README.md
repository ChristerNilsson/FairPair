# Floating Berger

[Try it!](https://christernilsson.github.io/FloatingBerger/)

Add the players elo ratings and names 

```
TITLE = Summer tournament RIO 2025
GAMES = 1
ROUNDS = 4
SORT = 0
BALANCE = 1

1698 Onni Aikio
1558 Helge Bergström
1549 Jonas Hök
1679 Lars Johansson
1400 Per Eriksson

1653 Christer Nilsson
1673 Per Hamnström
1504 Thomas Paulin
1706 Abbas Razavi
1650 Jouko Liistamo

```

If you are playing double rounds, set GAMES = 2

Enter the result for **white** in the Table list order  

Explanation
```
r1 = round 1

0 = white loss
1 = draw
2 = white win
x = game not played yet
```

# Usage

* Click on other columns, sorts the players

# Differences against other pairing systems

* The elo rating decides. The differences are minimized
* Tie breaks are seldom needed
* All rounds are paired initially
* You mey play the games in any order
* No need to divide the tournament in separate Berger groups
* All players know when they will meet whom. Like Berger
* Simple handling of the pairing process
* All information is stored in the url, ready to be published

# Mind this

* After starting the tournament, you are only allowed to edit the results
* Changing elos, SORT, ROUNDS, BALANCE or GAMES is not allowed
* Always print the Table lists. These are your backups

# BALANCE

* BALANCE == 0. Mainly double round
* BALANCE == 1. Mainly single round

# Development

ONE is used to show zero or one based indexes


