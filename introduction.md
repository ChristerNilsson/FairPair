## Introduction   

### History of tournament systems

[Swiss/Monrad/Dutch](https://en.wikipedia.org/wiki/Swiss-system_tournament)

|English name|Swedish name|Method            |Winning criteria      |Tiebreaks|Inventor         |Country|Year|
|-           |-           |-                 |-                     |:-:      |-                |:-:    |-   |
|Elimination |Cup         |one loss and out  |                      |         |                 |UK     |1851|
|Round Robin |Berger      |all versus all    |Score                 |Yes      |Johann Berger    |AU     |1895|
|Swiss/Old   |Monrad      |same score meet   |Score                 |Yes      |Dr. Julius Müller|CH     |1895|
|Swiss       |Schweizer   |same score meet   |Score                 |Yes      |(unknown)        |NL     |197•|
|FairPair    |FairPair    |**same elos meet**|**Performance Rating**|No       |Christer Nilsson |SE     |2024|

#### The main difference between Swiss/Old and Swiss (or as we say in Sweden, Monrad and Schweizer)

Example: Ten players, sorted in strength, with the same score:
```
Swiss/Old: 1-2  3-4  5-6  7-8  9-10  (Monrad)
Swiss:     1-6  2-7  3-8  4-9  5-10  (Schweizer)
```

#### The main differences between Swiss and FairPair

* Players with **similar elo** rating meet
* **Performance Rating** is used to decide the winner

#### Similarity between Round Robin and FairPair

* The pairing of all rounds may be done **before** the first round

### Comparison of Swiss and FairPair

Hans Rånby, rated 1893, scored 4 points of 8 (50%) in Tyresö Open 2024.  
He lost 3 games against stronger players and won 4 games against weaker players, almost as expected.  
He had the following elo differences:  

|Type    |      1|    2|   3|   4|   5|   6|   7|    8|Abs Avg|
|-       |     -:|   -:|  -:|  -:|  -:|  -:|  -:|   -:|     -:|
|Swiss   |   -271|  215|-160|-115|-252| 442| -93|  153|213    |
|Score   |      1|    0|   0|   1|   1|   0|   1|    0|50%    |
|FairPair|     13|  -30| -14|   7|   8|   3|  -4|    4|10     |

[Graph](https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4WErr8g0UL_Nb5Qp4Qkh-sVEBT9Hc7OpTtBbnWJgLUajzIMLzNeyB20g6PZo5Rl4dlUITOWRlkqNF/pubchart?oid=1489485842&format=interactive)

### Swiss vs FairPair (matrix)

Tyresö Open 2024 (78 players, 8 rounds)  

* The players are aligned horizontally and vertically
* Elo sorted, the strongest player is in the upper, left, corner
* The cells contains the round numbers, 1 to 8
* The main diagonal is not used, as a player can't meet himself

#### Round numbers

  * [Swiss Matrix](matrices/dutch-78.html)  
  * [FairPair Matrix](matrices/fairpair-78.html)  

#### Tournament tables

  * [Swiss](https://member.schack.se/ShowTournamentServlet?id=13664&listingtype=2)
  * [FairPair](https://christernilsson.github.io/FloatingBerger/?TITLE=Tyres%C3%B6+Open+2024&GAMES=1&ROUNDS=8&SORT=1&ONE=1&BALANCE=1&A=1&B=1&C=1&p=2416+Hampus+S%C3%B6rensen&p=2413+Michael+Wiedenkeller&p=2366+Joar+%C3%96lund&p=2335+Joar+%C3%96stlund&p=2272+Vidar+Grahn&p=2235+Leo+Crevatin&p=2213+D+Vesterbaek+Pedersen&p=2141+Victor+Muntean&p=2113+Filip+Bj%C3%B6rkman&p=2109+Vidar+Seiger&p=2108+Pratyush+Tripathi&p=2093+Erik+Dingertz&p=2076+Michael+Duke&p=2065+Matija+Sakic&p=2048+Michael+Mattsson&p=2046+Lukas+Willstedt&p=2039+Lavinia+Valcu&p=2035+Oliver+Nilsson&p=2031+Lennart+Evertsson&p=2022+Jussi+Jakenberg&p=2001+Aryan+Banerjee&p=1985+Tim+Nordenfur&p=1977+Elias+Kingsley&p=1954+Per+Isaksson&p=1944+C+Rose+Mariano&p=1936+Lo+Ljungros&p=1923+Herman+Enholm&p=1907+Carina+Wickstr%C3%B6m&p=1897+Joel+%C3%85hfeldt&p=1896+Stefan+Nyberg&p=1893+Hans+R%C3%A5nby&p=1889+Mikael+Blom&p=1886+Joar+Berglund&p=1885+Mikael+Helin&p=1880+Olle+%C3%85lgars&p=1878+Jesper+Borin&p=1871+K+Sergelenbaatar&p=1852+Roy+Karlsson&p=1848+Fredrik+M%C3%B6llerstr%C3%B6m&p=1846+Kenneth+Fahlberg&p=1835+Peder+Gedda&p=1833+Karam+Masoudi&p=1828+Christer+Johansson&p=1827+Anders+Kallin&p=1818+Morris+Bergqvist&p=1803+Martti+Hamina&p=1800+Bj%C3%B6rn+L%C3%B6fstr%C3%B6m&p=1796+N+Bychkov+Zwahlen&p=1794+Jonas+Sandberg&p=1793+Rohan+Gore&p=1787+Kjell+Jernselius&p=1783+Radu+Cernea&p=1778+Mukhtar+Jamshedi&p=1768+Neo+Malmquist&p=1763+Joacim+Hultin&p=1761+Lars-%C3%85ke+Pettersson&p=1748+Andr%C3%A9+J+Lindebaum&p=1733+Lars+Eriksson&p=1733+Hugo+Hardwick&p=1728+Hugo+Sundell&p=1726+Simon+Johansson&p=1721+Jouni+Kaunonen&p=1709+Eddie+Parteg&p=1695+Sid+Van+Den+Brink&p=1691+Svante+N%C3%B6dtveidt&p=1688+Anders+Hillbur&p=1680+Sayak+Raj+Bardhan&p=1671+Salar+Banavi&p=1650+Patrik+Wiss&p=1641+Anton+Nordenfur&p=1624+Jens+Ahlstr%C3%B6m&p=1622+Hanns+Ivar+Uniyal&p=1579+Christer+Carmegren&p=1575+Christer+Nilsson&p=1524+M%C3%A5ns+N%C3%B6dtveidt&p=1480+Karl-Oskar+Rehnberg&p=1417+David+Broman&p=1406+Vida+Radon&p=1400+M+de+Lafonteyne&p=1400+Ivar+Arnshav&p=1400+Kristoffer+Schultz&p=0000+BYE)

