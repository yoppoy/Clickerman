from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm, UsernameField
from django.core.exceptions import ObjectDoesNotExist

from web.models import *

class LoginForm(AuthenticationForm):
    username = forms.CharField(
        label="Username",
        strip=False,
        widget=forms.TextInput(attrs={'placeholder': "Email ou Nom d'utilisateur", 'class': 'form_field', 'required': 'true'}),
    )
    password = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(attrs={'placeholder': 'Mot de passe', 'class': 'form_field', 'required': 'true'}),
    )
    def clean_username(self):
        username = self.data['username']
        if '@' in username:
            try:
                user = User.objects.get(email=username)
                username = user.username
            except ObjectDoesNotExist:
                return username
        return username


class RegisterForm(UserCreationForm):
    password1 = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(attrs={'placeholder': 'Mot de passe', 'class': 'form_field', 'required': 'true'}),
    )
    password2 = forms.CharField(
        label="Password confirmation",
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirmer Mot de passe', 'class': 'form_field', 'required': 'true'}),
        strip=False,
    )

    class Meta:
        model = User
        fields = ('username', 'email')
        field_classes = {'username': UsernameField}
        widgets = {
            'username': forms.TextInput(attrs={'class': 'login_input', 'placeholder': "Nom d'utilisateur", 'required': 'true'}),
            'email': forms.EmailInput(attrs={'class': 'login_input', 'placeholder': "Adresse mail", 'required': 'true'})
        }


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form_field'}),
            'first_name': forms.TextInput(attrs={'class': 'form_field'}),
            'last_name': forms.TextInput(attrs={'class': 'form_field'}),
            'email': forms.EmailInput(attrs={'class': 'form_field'})
        }


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('gender', 'media', 'social_networks', 'bio', 'date_birthday')
        widgets = {
            'gender': forms.Select(attrs={'class': 'form_field'})
        }


class AddressForm(forms.ModelForm):
    class Meta:
        model = Address
        fields = '__all__'
        widgets = {
            'alias': forms.TextInput(attrs={'class': 'form_title_field'}),
            'first_name': forms.TextInput(attrs={'class': 'form_field'}),
            'last_name': forms.TextInput(attrs={'class': 'form_field'}),
            'line1': forms.TextInput(attrs={'class': 'form_field'}),
            'line2': forms.TextInput(attrs={'class': 'form_field'}),
            'postcode': forms.TextInput(attrs={'class': 'form_field'}),
            'city': forms.TextInput(attrs={'class': 'form_field'}),
            'state': forms.TextInput(attrs={'class': 'form_field'}),
            'country': forms.TextInput(attrs={'class': 'form_field'}),
            'phone': forms.TextInput(attrs={'class': 'form_field'})
        }