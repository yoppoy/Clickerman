from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.decorators import login_required
from account.forms import LoginForm, RegisterForm, AddressForm, ProfileForm, UserForm
from web.models import Profile


def login(request):
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            auth_login(request, form.get_user())
            next_page = request.GET.get('next', '/')
            return HttpResponseRedirect(next_page)
    else:
        form = LoginForm()
    if request.user.is_authenticated():
        return HttpResponseRedirect('/')
    return TemplateResponse(request, 'account/login.html', {'form': form})


def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            new_user = authenticate(username=form.cleaned_data['username'],
                                    password=form.cleaned_data['password1'])
            auth_login(request, new_user)
            return HttpResponseRedirect('validated')
    else:
        form = RegisterForm()
    return TemplateResponse(request, 'account/register.html', {'form': form})


def register_enterprise_info(request):
    if request.method == 'POST':
        form = RegisterEnterpriseForm(request.POST)
        if form.is_valid():
            form.save()
            new_enterprise = authenticate(username=form.cleaned_data['username'],
                                        password=form.cleaned_data['password1'])
            auth_login(request, new_enterprise)
            return HttpResponseRedirect('validated')
    else:
        form = RegisterForm()
    return TemplateResponse(request, 'account/register_enterprise.html', {'form': form})


def validated(request):
    return TemplateResponse(request, 'account/validated.html')


@login_required(login_url='/account/login/')
def edit(request):
    profile_instance = Profile.objects.get_or_create(user=request.user.id)[0]
    address_object_list = request.user.profile.addresses.all()
    i = 0
    addresses = [[0 for x in range(2)] for y in range(len(address_object_list))]
    for address in address_object_list:
        addresses[i] = {
            'object': address,
            'form': AddressForm(request.POST or None, instance=address)
        }
        i += 1
    context = {
        'user_form': UserForm(request.POST or None, request.FILES or None, instance=request.user),
        'profile_form': ProfileForm(request.POST or None, request.FILES or None, instance=profile_instance),
        'addresses': addresses,
    }
    if request.method == 'POST':
        if context['user_form'].is_valid() and context['profile_form'].is_valid():
            context['user_form'].save()
            context['profile_form'].save()
    return TemplateResponse(request, 'account/edit.html', context)
