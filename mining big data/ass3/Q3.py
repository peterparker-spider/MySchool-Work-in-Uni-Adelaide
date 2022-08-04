# Code source: Gaël Varoquaux
# Modified for documentation by Jaques Grobler
# License: BSD 3 clause
import math
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from sklearn import datasets
from sklearn.decomposition import PCA
import numpy as np
# import some data to play with
iris = datasets.load_iris()


data1 = iris.data[:, :2]






data = []
for x in data1:
    list = []
    list.append(x[0])
    list.append(x[1])
    data.append(list)

centroids = [[4.3,3.0],
             [5.5,4.2],
             [6.3,3.3],
             [7.9,3.8]]
clusters =[[],[],[],[]]

for item in data:
    minDistance = 999999999
    for i in range(len(centroids)):
        distance = (item[0] - centroids[i][0]) ** 2 + (item[1] - centroids[i][1]) ** 2
        distance = math.sqrt(distance)
        if distance < minDistance:
            minDistance = distance
            cluster_index = i
    clusters[cluster_index].append(item)

for x in clusters:
    print(x)
    print(len(x))

new_centroids = []
for x in clusters:
    the_centroid = []
    x_sum = 0
    y_sum = 0
    for y in x:
        x_sum += y[0]
        y_sum += y[1]
    centroid_x = x_sum / len(x)
    centroid_y = y_sum / len(x)
    the_centroid.append(centroid_x)
    the_centroid.append(centroid_y)
    new_centroids.append(the_centroid)



while new_centroids != centroids:
    centroids = new_centroids
    clusters = [[], [], [], []]

    for item in data:
        minDistance = 999999999
        for i in range(len(centroids)):
            distance = (item[0] - centroids[i][0]) ** 2 + (item[1] - centroids[i][1]) ** 2
            distance = math.sqrt(distance)
            if distance < minDistance:
                minDistance = distance
                cluster_index = i
        clusters[cluster_index].append(item)

    new_centroids = []
    for x in clusters:
        the_centroid = []
        x_sum = 0
        y_sum = 0
        for y in x:
            x_sum += y[0]
            y_sum += y[1]
        centroid_x = x_sum / len(x)
        centroid_y = y_sum / len(x)
        the_centroid.append(centroid_x)
        the_centroid.append(centroid_y)
        new_centroids.append(the_centroid)


print(centroids)
for x in clusters:
    print(x)
    print(len(x))





plt.figure(2, figsize=(8, 6))
plt.clf()
plt.xlim(4,8)
plt.ylim(1.5,5)
plt.grid()

colors = ["red","green","blue","yellow"]

colors_index = 0
for x in clusters:
    for y in x:
        plt.scatter(y[0],y[1],c=colors[colors_index])
    colors_index +=1

for x in centroids:
    plt.plot(x[0],x[1],marker='^',c="black" )
plt.show()
