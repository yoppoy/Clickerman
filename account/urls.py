from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    url(r'^login', views.login, name='login'),
    url(r'^logout', auth_views.logout, {'next_page': '/'}, name='logout'),
    url(r'^register', views.register, name='register'),
    url(r'^edit', views.edit, name='edit'),
    url(r'^validated', views.validated, name='validated'),
]
