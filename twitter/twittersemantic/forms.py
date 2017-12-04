from django import forms

class SearchLineForm(forms.Form):
    text_request = forms.CharField(max_length=240)