from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm, UsernameField
from django.core.exceptions import ObjectDoesNotExist
from web.models import *

CHOICE_SORT = (
    ('date_started', 'Date de diffusion'), #date_started
    ('total_value', 'Valeur'), #total_value
    ('nb_clickers', 'Nombre de participants'), #nb_clickers
)

CHOICE_ORDER = (
    ('0', 'Croissant'),
    ('1', 'Decroissant')
)

class SearchForm(forms.Form):
    category = forms.ModelChoiceField(queryset=Category.objects.all(), empty_label="Toutes categories", required=False)
    sort = forms.ChoiceField(choices=CHOICE_SORT, required=False)
    order = forms.ChoiceField(choices=CHOICE_ORDER, required=False)
