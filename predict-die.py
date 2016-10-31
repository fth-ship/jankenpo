import tensorflow as tf
import numpy as np
from numpy import genfromtxt

from sklearn import datasets
from sklearn.cross_validation import train_test_split
import sklearn

def buildDataFromIris():
    iris = datasets.load_iris()
    X_train, X_test, y_train, y_test = train_test_split(iris.data,iris.target,test_size=.33,random_state=42)
    f=open('cs-training.csv','w')
    for i,j in enumerate(X_train):
        k=np.append(np.array(y_train[i]),j)
        f.write(",".join([str(s) for s in k]) + '\n')
    f.close()
    f=open('cs-testing.csv','w')
    for i,j in enumerate(X_test):
        k=np.append(np.array(y_test[i]),j)
        f.write(",".join([str(s) for s in k]) + '\n')
    f.close()

def convertOneHot(data):
    y=np.array([int(i[0]) for i in data])
    y_onehot=[0]*len(y)
    for i,j in enumerate(y):
        y_onehot[i]=[0]*(y.max()+1)
        y_onehot[i][j]=1
    return (y,y_onehot)

buildDataFromIris()

data = genfromtxt('cs-training.csv',delimiter=',')
test_data = genfromtxt('cs-testing.csv',delimiter=',')

#x_train = np.array([i[1::] for i in data])
#y_train,y_train_onehot = convertOneHot(data)
#x_test=np.array([i[1::] for i in test_data])
#y_test,y_test_onehot = convertOneHot(test_data)

#A=data.shape[1]-1
#B=len(y_train_onehot[0])
#tf_in = tf.placeholder('float',[None,A])
#tf_weight = tf.Variable(tf.zeros([A,B]))
#tf_bias = tf.Variable(tf.zeros([B]))
#tf_softmax= tf.nn.softmax(tf.nn.softmax(tf.matmul(tf_in,tf_weight) + tf_bias))
#tf_softmax_correct = tf.placeholder('float', [None,B])
#tf_cross_entropy = -tf.reduce_sum(tf_softmax_correct*tf.log(tf_softmax))
#tf_train_step = tf.train.GradientDescentOptimizer(0.01).minimize(tf_cross_entropy)
