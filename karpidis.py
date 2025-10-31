# Denna fil skapar Berger-lottningar

def savePairing(r, A, half, n):
	lst = [A[n - 1], A[0]] if r % 2 == 0 else [A[0], A[n - 1]]

	for i in range(1,half):
		lst.append([A[i], A[n - 1 - i]])
	return lst

def makeKarpidisBerger(n):
	if n % 2 == 1: n += 1
	half = n // 2
	A = list(range(1, n + 1))
	rounds = []
	for i in range(1, n):
		rounds.append(savePairing(i, A, half, n))
		A.pop()
		A = A[half:] + A[:half]
		A.append(n)
	return rounds

rounds = makeKarpidisBerger(10)
print(rounds)
z=99
