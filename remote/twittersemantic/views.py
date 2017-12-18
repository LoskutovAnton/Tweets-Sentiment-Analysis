from django.shortcuts import render
from .forms import SearchLineForm
from django.http import Http404, JsonResponse, HttpResponse
from django.db import models
from django.contrib.auth.decorators import login_required
import os
import pickle
import django
import re
import datetime
from .analyze import analyse_tweets
from django.views.decorators.csrf import ensure_csrf_cookie
from tweepy import StreamListener
from tweepy import Stream
import tweepy

os.environ['DJANGO_SETTINGS_MODULE'] = 'project.settings'
django.setup()

ROOT = os.path.dirname(os.path.abspath(__file__))

def get_api_model():
    access_token = "713106538-mp6L2FjeZBC7IGkBjxGd20VqSGnCMe32fITNjDHA"
    access_token_secret = "Dw73yZFxCZHDgLZwTiMc4o93vLbHN1CCr2mcr1LSY5WC4"
    consumer_key = "9oPFg8iUjWOrLvZ13C8FoXX5a"
    consumer_secret = "jliZF603JchC2IHHCEWxdtCSQPN0US8phBxMmP7sredb7VJmHH"

    api = None
    try:
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        api = tweepy.API(auth)
    except Exception:
        print("Auth error")
    return api

# returns (request_type, data)
def parse(text):
    if text[0] == '@':
        return "NAME", text.strip()
    elif text[0] == "#":
        return "TAG", text.strip()
    else:
        return "TWEET", text.strip()


def prepare_text(text):
    text = text.lower().strip()
    text = re.sub(r'@\S+', '', text) # delete @user_name
    text = re.sub(r'#\W+', '', text) # delete #hashtag
    text = re.sub(r'http\S+', ' ', text)
    text = re.sub(r'[o_, O_, dd, dddd, ddd, 0-9, \:, \(, \), \!, \-, \;, \?, rt, \#]+', ' ', text) # delete smiles
    return text


def get_hashtag_recent_tweets(hashtag, count=100):
    api = get_api_model()
    tweets = []
    MIN_SYMBOLS_NUM = 20

    try:
        tweets = tweepy.Cursor(api.search, q=hashtag[1:], lang='ru', full_text=True, tweet_mode="extended").items(count)
    except Exception:
        print("Getting Cursor error")
    tweets = [(tweet.full_text, tweet.created_at) for tweet in tweets]

    return tweets

def get_user_recent_tweets(username, count):
    api = get_api_model()
    tweets = []
    MIN_SYMBOLS_NUM = 20

    try:
        user = api.get_user(username)
        tweets = [(tweet.full_text, tweet.created_at) for tweet in user.timeline(count=count, full_text=True, tweet_mode="extended")]
    except Exception:
        print("Getting timeline error")
    # tweets = [prepare_text(tweet) for tweet in tweets]
    # tweets = [tweet for tweet in tweets if len(tweet) > MIN_SYMBOLS_NUM]
    return tweets


def search(request):
    print("search view")
    if request.method == 'POST':
        print("POST request")
        print(request.body.decode('utf-8'))
        request_text = request.body.decode('utf-8')

        if len(request_text) == 0:
            return JsonResponse({})
        request_type, data = parse(request_text)

        print("Request type: ", request_type)
        print("Data: ", data)

        TYPE = 0
        tweets = []
        if request_type == "NAME":
            tweets = get_user_recent_tweets(data, 100)
            print("prepared %d tweets" %len(tweets))
            TYPE = 1
        elif request_type == "TAG":
            tweets = get_hashtag_recent_tweets(data, 100)
            print("prepared %d tweets" %len(tweets))
            TYPE = 2
        elif request_type == "TWEET":
            tweets = [(data, 0)]
            TYPE = 0

        predicted = analyse_tweets(tweets, TYPE)

        return JsonResponse({"tweets": predicted, "type": TYPE})


    else:
        print("GET request")
        print(request)

    return render(request, 'twittersemantic/index.html')