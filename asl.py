from db import get_all_data, NUM_FEATURES
import collections

# Contains arrays. Each array is a datarow of features 
# (currently 0 - 59, so each array has 60 values).
# Each feature is represented by a float number.
data = []

# Contains the corresponding class to the
# datarow with the same index (e.g. 'a', 'b', ...)
target = []

for row in get_all_data():
    dataRow = []
    for featureNumber in range(NUM_FEATURES):
        dataRow.append(row['feat' + str(featureNumber)])
    data.append(dataRow)
    target.append(row['sign'])
