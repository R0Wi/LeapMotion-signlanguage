# Loads the classifier model from the
# clf.pkl-file (scikit-learn python lib)
from sklearn import svm
from sklearn.externals import joblib

clf = joblib.load('clf.pkl')
