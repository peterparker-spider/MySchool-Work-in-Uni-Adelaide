import operator
import math
import sys


class Node:
    def __init__(self):
        self.label = None
        self.attr = None
        self.splitval = None
        self.left = None
        self.right = None


def dtl(samples, minleaf):
    # condition1
    if len(samples) <= minleaf:
        newnode = Node()
        labels = {}
        for sample in samples:
            if sample[-1] not in labels:
                labels[sample[-1]] = 1
            else:
                labels[sample[-1]] += 1
        label_return = [key for key, value in labels.items() if value == max(labels.values())]
        if len(label_return) == 1:
            for label in label_return:
                newnode.label = label
            return newnode
        else:
            newnode.label = "unknown"
            return newnode
    # condition2
    is_attribute_same = True
    for j in range(len(samples)-1):
        if samples[j][0:-1] != samples[j + 1][0:-1]:
            is_attribute_same = False
            break
    if is_attribute_same == True:
        newnode = Node()
        labels = {}
        for sample in samples:
            if sample[-1] not in labels.keys():
                labels[sample[-1]] = 1
            else:
                labels[sample[-1]] += 1
        label_return = [key for key, value in labels.items() if value == max(labels.values())]
        if len(label_return) == 1:
            for label in label_return:
                newnode.label = label
            return newnode
        else:
            newnode.label = "unknown"
            return newnode
    # condition3
    is_label_same = True
    for i in range(len(samples) - 1):
        if samples[i][-1] != samples[i + 1][-1]:
            is_label_same = False
            break
    if is_label_same == True:
        newnode = Node()
        newnode.label = samples[-1][-1]
        return newnode
    # If Above condition is not satisfied
    best_attr, best_splitval = Choosesplit(samples)
    Newnode = Node()
    Newnode.attr = best_attr
    Newnode.splitval = best_splitval
    left = []
    right = []
    for sample in samples:
        if sample[Newnode.attr] <= Newnode.splitval:
            left.append(sample)
        else:
            right.append(sample)
    Newnode.left = dtl(left, minleaf)
    Newnode.right = dtl(right, minleaf)

    return Newnode


def Choosesplit(samples):
    best_gain = None
    best_attr = None
    best_splitval = None
    labels_for_i = {}
    i_sum = 0
    for sample in samples:
        if sample[-1] not in labels_for_i.keys():
            labels_for_i[sample[-1]] = 1
        else:
            labels_for_i[sample[-1]] += 1
    for label in labels_for_i:
        i_value = labels_for_i[label] / len(samples)
        i_value = (math.log(i_value, 2)) * i_value
        i_sum += -i_value
    for i in range(11):
        attr_data = []  # clear
        for sample in samples:
            attr_data.append(sample[i])
        attr_data.sort()
        # for i = 1, 2, ...N − 1 do
        for j in range(len(attr_data) - 1):
            splitval = (attr_data[j] + attr_data[j + 1]) * 0.5
            split_left = {}
            split_right = {}
            left_count = 0
            right_count = 0
            left_reminder = 0
            right_reminder = 0
            # gain ← Information gain of (attr, splitval)
            for sample in samples:
                if sample[i] < splitval:
                    if sample[-1] not in split_left:
                        split_left[sample[-1]] = 1
                        left_count += 1
                    else:
                        split_left[sample[-1]] += 1
                        left_count += 1
                else:
                    if sample[-1] not in split_right:
                        split_right[sample[-1]] = 1
                        right_count += 1
                    else:
                        split_right[sample[-1]] += 1
                        right_count += 1
            for label in split_left:
                reminder_value = split_left[label] / left_count
                reminder_value = (math.log(reminder_value, 2)) * reminder_value
                left_reminder += -reminder_value
            left_reminder = left_reminder * (left_count / len(samples))
            for label in split_right:
                reminder_value = split_right[label] / right_count
                reminder_value = (math.log(reminder_value, 2)) * reminder_value
                right_reminder += -reminder_value
            right_reminder = right_reminder * (right_count / len(samples))
            Gain = i_value - (left_reminder + right_reminder)
            if best_gain is None:
                best_gain = Gain
                best_attr = i
                best_splitval = splitval
            if Gain > best_gain:
                best_gain = Gain
                best_attr = i
                best_splitval = splitval
            split_left.clear()
            split_right.clear()
        attr_data.clear()

    return best_attr, best_splitval


def predict_DTL(root, data):
    node = root
    while node.left is not None and node.right is not None:
        if data[node.attr] <= node.splitval:
            node = node.left
        else:
            node = node.right
    return node.label


samples = []
train = sys.argv[1]
test = sys.argv[2]
minleaf = sys.argv[3]
minleaf = int(minleaf)

file = open(train)
content = file.readlines()
content2 = content[1:]
for line in content2:  # read rest of lines
    samples.append([float(x) for x in line.split()])

node = dtl(samples,minleaf)
with open(test) as u:
    next(u)
    for line in u:  # read rest of lines
        data = [float(x) for x in line.split()]
        labeloutput = predict_DTL(node, data)
        print(int(labeloutput))
u.close()
