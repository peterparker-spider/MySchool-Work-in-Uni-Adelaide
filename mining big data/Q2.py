# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import operator

PR_value_list = {}
graph = {}
FromNode_PRValue = {}
length = 875713

with open('web-Google.txt') as f:
    next(f)
    next(f)
    next(f)
    next(f)
    for line in f:  # read rest of lines
        list = []
        for x in line.split():
            list.append(int(x))
        if list[0] not in graph:
            graph[list[0]] = {}
        graph[list[0]][list[1]] = None
f.close()
print(graph)
for x in graph:
    FromNode_PRValue[x] = 1 / length

for x in graph:
    for y in graph[x]:
        graph[x][y] = FromNode_PRValue[x] / (len(graph[x]))

for x in graph:
    if x not in PR_value_list:
        PR_value_list[x] = (1 - 0.85) / length
    for y in graph[x]:
        if y not in PR_value_list:
            PR_value_list[y] = (1 - 0.85) / length + 0.85 * graph[x][y]
        else:
            PR_value_list[y] += 0.85 * graph[x][y]


for x in FromNode_PRValue:
    FromNode_PRValue[x] = PR_value_list[x]


PR_value_list.clear()

for i in range(20):
    for x in graph:
        for y in graph[x]:
            graph[x][y] = FromNode_PRValue[x] / (len(graph[x]))
    PR_value_list = {}
    for x in graph:
        if x not in PR_value_list:
            PR_value_list[x] = (1 - 0.85) / length
        for y in graph[x]:
            if y not in PR_value_list:
                PR_value_list[y] = (1 - 0.85) / length + 0.85 * graph[x][y]
            else:
                PR_value_list[y] += 0.85 * graph[x][y]
    for x in FromNode_PRValue:
        FromNode_PRValue[x] = PR_value_list[x]

sorted_x = sorted(PR_value_list.items(), key=operator.itemgetter(1))

Top_10_list = sorted_x[-10:]
Top_10_list.reverse()
for x in Top_10_list:
    print(x[0], x[1])

with open("PR-value2.txt", 'w', encoding='utf-8') as result_file:
    for x in PR_value_list:
        result_file.write(str(x))
        result_file.write(" ")
        result_file.write(" ")
        result_file.write(str(PR_value_list[x]))
        result_file.write("\n")
result_file.close()