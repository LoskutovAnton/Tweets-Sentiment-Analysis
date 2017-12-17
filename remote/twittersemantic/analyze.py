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

MODEL_PATH = os.path.join(ROOT, 'models/model_logreg_tf_idf.pkl')


def prepare_text(text):
    text = text.lower().strip()
    text = re.sub(r'@\S+', '', text) # delete @user_name
    text = re.sub(r'#\W+', '', text) # delete #hashtag
    text = re.sub(r'http\S+', ' ', text)
    text = re.sub(r'[o_, O_, dd, dddd, ddd, 0-9, \:, \(, \), \!, \-, \;, \?, rt, \#]+', ' ', text) # delete smiles
    return text

tokenizer = RegexpTokenizer('\w+|\S+')
r = RussianStemmer()

def tokenize(text):
    return tokenizer.tokenize(text)

def stem_text(text):
    return [r.stem(word) for word in text]

def analyse_text(text):
    text = prepare_text(text)
    text = tokenize(text)
    text = stem_text(text)
    text = [word for word in text if len(word) > 0]
    return text


# json = '{"tweets": [[{"text":"test", "time":101123}], [], []],"type":0}';
def analyse_tweets(tweets, TYPE):

    start = time.time()

    BOUND = 0.6
    if TYPE == "TWEET":
        BOUND = 0.6

    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f, encoding='latin1')

    predicted = [[], [], []]
    for text, date in tweets:
        prepared_text = analyse_text(text)
        if len(prepared_text) == 0:
            continue
        preds = model.predict_proba([' '.join(prepared_text)])[0]

        if preds[1] > BOUND:
            predicted[0].append({"text": text, "time": date})
        elif preds[0] > BOUND:
            predicted[2].append({"text": text, "time": date})
        else:
            predicted[1].append({"text": text, "time": date})

    print("Completed in %f seconds" % (time.time() - start))
    return predicted

