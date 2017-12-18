import pandas as pd
import numpy as np
import tqdm
import regex
import os
import re
import time
import random
import pickle
import codecs
from nltk.stem.snowball import RussianStemmer
from nltk.tokenize import RegexpTokenizer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.metrics import roc_curve, auc
#from django.core.cache import cache


ROOT = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(ROOT, 'models/model_logreg_tf_idf.pkl')


# def prepare_text(text):
#     text = text.lower().strip()
#     text = re.sub(r'@\S+', '', text) # delete @user_name
#     text = re.sub(r'#\W+', '', text) # delete #hashtag
#     text = re.sub(r'http\S+', ' ', text)
#     text = re.sub(r'[o_, O_, dd, dddd, ddd, 0-9, \:, \(, \), \!, \-, \;, \?, rt, \#]+', ' ', text) # delete smiles
#     return text

def prepare_text(text):
    text = text.lower().strip()
    text = ' '.join(text.split())
    text = re.sub(r'@\S+', '', text) # delete @user_name
    text = re.sub(r'#\W+', '', text) # delete #hashtag
    text = re.sub(r'http\S+', ' ', text)
    text = re.sub(r'[\!\"\#\$\%\&\\\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\\\]\^\_\`\{\|\}\~, a-z, 0-9]+', ' ', text) # delete smiles
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


def is_retweet(prepared_text, tweet_preds):
    SIM_BOUND = 0.8
    for pred, text, date, prep in tweet_preds:
        new_set = set(prepared_text)
        cur_set = set(prep)
        if len(cur_set.intersection(new_set)) > SIM_BOUND * len(cur_set):
            return True
    return False

model = None
# json = '{"tweets": [[{"text":"test", "time":101123}], [], []],"type":0}';
def analyse_tweets(tweets, TYPE):

    start = time.time()

    global model
    if model == None:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f, encoding='latin1')

    # test_model = cache.get('test_model')
    # print(test_model)
    #
    # if test_model is None:
    #     print("loading model")
    #     with open(MODEL_PATH, 'rb') as f:
    #         test_model = pickle.load(f, encoding='latin1')
    #         cache.set('test_model', test_model, 300000)

    POS_BOUND = 0.7
    NEG_BOUND = 0.7

    predicted = [[], [], []]
    tweet_preds = []
    for text, date in tweets:
        prepared_text = analyse_text(text)
        if len(prepared_text) == 0:
            continue

        if is_retweet(prepared_text, tweet_preds):
            print("retweet")
            continue

        preds = model.predict_proba([' '.join(prepared_text)])[0]
        tweet_preds.append((preds, text, date, prepared_text))

    print("Predicted in %f" %(time.time() - start))

    NUM_POS = sum([1 for pred in tweet_preds if pred[0][1] > POS_BOUND])
    NUM_NEG = sum([1 for pred in tweet_preds if pred[0][0] > NEG_BOUND])

    if NUM_NEG == 0:
        NEG_BOUND -= 0.2
        print("Negative Bound Decreased")
    if NUM_POS == 0:
        POS_BOUND -= 0.2
        print("Positive Bound Decreased")

    print("NUM POS: %d" %(NUM_POS))
    print("NUM NEG: %d" %(NUM_NEG))

    for pred, text, date, prepared_text in tweet_preds:
        if pred[1] > POS_BOUND:
            predicted[0].append({"text": text, "time": date})
        elif pred[0] > NEG_BOUND:
            predicted[2].append({"text": text, "time": date})
        else:
            predicted[1].append({"text": text, "time": date})

    print("Completed in %f seconds" % (time.time() - start))
    return predicted

