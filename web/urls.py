from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^bundle/(?P<bundle_id>[0-9]+)$', views.bundle, name='bundle'),
    url(r'^construction', views.construction, name='construction'),
]
