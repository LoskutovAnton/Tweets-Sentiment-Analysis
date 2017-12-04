import pandas as pd
import numpy as np
import tqdm
import regex
import os
import re
import time
import random
import pickle
from nltk.stem.snowball import RussianStemmer
from nltk.tokenize import RegexpTokenizer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.metrics import roc_curve, auc

ROOT = os.path.dirname(os.path.abspath(__file__))


def prepare_text(text):
    text = text.lower().strip()
    text = re.sub(r'@\S+', '', text) # delete @user_name
    text = re.sub(r'#\W+', '', text) # delete #hashtag
    text = re.sub(r'[o_, O_, dd, dddd, ddd, 0-9, \:, \(, \), \!, \-, \;, \?, rt, \#]+', ' ', text) # delete smiles
    return text

tokenizer = RegexpTokenizer('\w+|\S+')
r = RussianStemmer()

def tokenize(text):
    return tokenizer.tokenize(text)

def stem_text(text):
    return [r.stem(word) for word in text]

def analyse_request(text):
    print("analyzing text")
    MODEL_PATH = os.path.join(ROOT, 'models/model_logreg_tf_idf.pkl')
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f, encoding='latin1')

    text = prepare_text(text)
    text = tokenize(text)
    text = stem_text(text)
    pred = model.predict_proba([' '.join(text)])
    return pred


