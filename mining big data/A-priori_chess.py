from itertools import combinations


sample_percentage = input("Sample percentage")
sample_percentage = float(sample_percentage)
content = None
NumberOfItems = None
support = 0.01
dictionary = {}


with open('chess.dat') as f:
    content = f.readlines()
    NumberOfItems = len(content)
f.close()
sample_number = NumberOfItems*sample_percentage


lines = 0
for line in content:  # read rest of lines
    if lines > sample_number:
        break
    else:
        lines += 1
    for x in line.split():
        if x not in dictionary:
            dictionary[x] = 1
        else:
            dictionary[x] += 1

print("The L1 list:")
L1 = []
for x in dictionary:
    if dictionary[x] >= sample_number*support:
        L1.append(x)
        print("{" , x  , "}" , ":" ,dictionary[x])

comb = combinations(L1,2)

comb = list(comb)



L1_dictionary = {}

for x in comb:
    L1_dictionary[x] =0

lines = 0
for line in content:  # read rest of lines
    if lines > sample_number:
        break
    else:
        lines += 1
    Item = []
    for x in line.split():
        Item.append(x)
    pair = combinations(Item, 2)
    pair = list(pair)
    for x in pair:
        if x in comb:
            L1_dictionary[x] += 1

print("The L2 list:")
for x in L1_dictionary:
    if L1_dictionary[x] >= sample_number*support:
        print(x,L1_dictionary[x])

