from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.template.response import TemplateResponse
from web.forms import SearchForm
from web.models import Bundle, Score


def home_enterprise(request):
    return HttpResponse('home_enterprise')


def home_clicker(request):
    if request.method == 'POST':
        form = SearchForm(request, data=request.POST)
        if form.is_valid():
            array('date_started', 'total_value', 'nb_clickers')
            bundles = Bundle.objects.filter(status='2', category=form.category).order_by(array[form.sort])
            #if form.order == 1
            #    bundles = bundles.reverse();
            for bundle in bundles:
                score = bundle.get_score_of_user(request.user)
                bundle.highscore_user = str(score.highscore)
                bundle.position_user = str(score.position())
            return TemplateResponse(request, 'home/clicker.html', {'bundles': bundles})        
    else:
        form = SearchForm()
    bundles = Bundle.objects.filter(status='2')
    for bundle in bundles:
        score = bundle.get_score_of_user(request.user)
        bundle.highscore_user = str(score.highscore)
        bundle.position_user = str(score.position())
    return TemplateResponse(request, 'home/clicker.html', {'bundles': bundles, 'form': form})


def home(request):
    if request.user.is_authenticated:
        if request.user.profile.enterprise is not None:
            return home_enterprise(request)
        else:
            return home_clicker(request)
    return TemplateResponse(request, 'home/visitor.html')


@login_required(login_url='/account/login/')
def bundle(request, bundle_id):
    if request.user.profile.enterprise is not None:
        return HttpResponse('404')
    try:
        bundle_obj = Bundle.objects.filter(status='2').get(id=bundle_id)
    except ObjectDoesNotExist:
        return HttpResponse('404')
    try:
        score_obj = Score.objects.filter(bundle=bundle_obj).get(user=request.user)
        score_obj.check_remaining_clicks()
    except ObjectDoesNotExist:
        score_obj = Score.objects.create(bundle=bundle_obj, user=request.user)
    return TemplateResponse(request, 'bundle.html', {'bundle': bundle_obj, 'score': score_obj})


def construction(request):
    return TemplateResponse(request, 'construction.html')
