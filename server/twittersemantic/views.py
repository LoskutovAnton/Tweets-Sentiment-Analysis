from django.shortcuts import render
from .forms import SearchLineForm
from django.http import Http404, JsonResponse, HttpResponse
from django.db import models
from django.contrib.auth.decorators import login_required
import os
import pickle
import django
import datetime
from .analyze import analyse_request

os.environ['DJANGO_SETTINGS_MODULE'] = 'project.settings'
django.setup()

ROOT = os.path.dirname(os.path.abspath(__file__))

def search(request):
    print("search view")
    if request.method == 'POST':
        print("POST request")
        if "search_button" in request.POST:
            text = request.POST['search']
            print(text)
            pred = analyse_request(text)
            print("pred=", pred)

    else:
        print("GET request")
    return render(request, 'twittersemantic/index.html')