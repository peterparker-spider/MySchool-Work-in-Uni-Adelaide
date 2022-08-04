import sys
import numpy as np
#LocalInput = sys.argv[1]

class location:
    def __init__(self, i, j,map):
        self.i = i
        self.j = j
        self.n = None
        self.e = None
        self.s = None
        self.w = None
        self.NeighborIndicator = ''
        height = len(map)
        length = len(map[0])
        if i > 0:
            if map[i-1][j] == '0':
                self.n = [i-1,j]
        if j < length-1:
            if map[i][j+1] == '0':
                self.e = [i,j+1]
        if i < height-1:
            if map[i+1][j] == '0':
                self.s = [i+1,j]
        if j > 0:
            if map[i][j-1] == '0':
                self.w = [i,j-1]
    #Start to indicate the signal of the neighbor of this location
        if self.n is not None:
            self.NeighborIndicator += '0'
        else:
            self.NeighborIndicator += '1'
        if self.e is not None:
            self.NeighborIndicator += '0'
        else:
            self.NeighborIndicator += '1'
        if self.s is not None:
            self.NeighborIndicator += '0'
        else:
            self.NeighborIndicator += '1'
        if self.w is not None:
            self.NeighborIndicator += '0'
        else:
            self.NeighborIndicator += '1'



def DistributeProbability2(item, S):
    count = 0
    index = []

    if item.n is not None:
        count +=1
    if item.e is not None:
        count +=1
    if item.s is not None:
        count +=1
    if item.w is not None:
        count +=1
    if count > 0:
        Probability = 1.0/count
    else:
        Probability = 0

    for i in range(len(S)):
        coordinate = [S[i].i,S[i].j]
        if item.n is not None:
            if coordinate == item.n:
                index.append(i)
        if item.e is not None:
            if coordinate == item.e:
                index.append(i)
        if item.s is not None:
            if coordinate == item.s:
                index.append(i)
        if item.w is not None:
            if coordinate == item.w:
                index.append(i)
    return Probability,index

def GetError(str, state):
    error_count = 0

    if str[0] != state.NeighborIndicator[0]:
        error_count+=1

    if str[1] != state.NeighborIndicator[1]:
        error_count+=1

    if str[2] != state.NeighborIndicator[2]:
        error_count+=1

    if str[3] != state.NeighborIndicator[3]:
        error_count+=1

    return error_count






file_content = []
K = 0
map = []
S = []
LocalInput = sys.argv[1]
with open(LocalInput) as f:
    for line in f:
        file_content.append(line.strip())
f.close()


for i in range(len(file_content)):

    if i == 0:

        l0 = file_content[i].split(' ')
        N = int(l0[0]) * int(l0[1])
        height = int(l0[0])
        length = int(l0[1])


    elif i < height + 1:
        line = file_content[i].split(' ')
        print(line)
        map.append(line)


    elif i == height + 1:
        T = int(file_content[i])
        Y = []
    elif i <= height + T + 1:
        Y.append(file_content[i])
    else:
        error_rate = float(file_content[i])
i = 0
for row in map:
    j = 0
    for colum in row:
        if colum == '0':
            S.append(location(i, j, map))
            K += 1
        j += 1
    i += 1
P = np.array([1.0 / K] * K)



Tm = np.arange(K * K).reshape((K , K))
Tm = np.zeros_like(a = Tm, dtype = float) # Tm, transition matrix of size KxK

i = 0
for x in S:
    probability, index = DistributeProbability2(x, S)
    print(probability)
    print(index)
    for j in index:
        Tm[i][j] = probability
    i += 1


Tm =  Tm.T


Em = np.arange(K*T).reshape((K,T))
Em = np.zeros_like(a = Em, dtype = float)

for t in range(T):
    for k in range(K):
        errorNum = GetError(Y[t], S[k])
        Em[k][t] = pow(error_rate, errorNum) * pow(1- error_rate, 4- errorNum)



trellis = np.arange(K*T, dtype = float).reshape((K,T))
trellis = np.zeros_like(a = trellis, dtype = float)

for i in range(K):
    trellis[i][0] = P[i] * Em[i][0]




for j in range(1,T):
    for i in range(K):
        tmp = 0
        for k in range(K):
            if Tm[i][k] == 0:
                continue

            tmp = max(tmp, trellis[k][j-1] * Tm[i][k] * Em[i][j])
        trellis[i][j] = tmp



map = np.arange(N).reshape(height, length)

maps = []

for i in range(len(trellis.T)):
    map = np.zeros_like(a = map, dtype = float)
    for j in range(len(S)):
        map[S[j].i][S[j].j] = trellis[j][i]
    maps.append(map)

np.savez("output.npz", *maps)
