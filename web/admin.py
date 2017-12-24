from django.contrib import admin

from .models import *
from django.contrib.auth.admin import UserAdmin as OriginalUserAdmin
from django.contrib.auth.models import User


admin.site.unregister(User)


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['alias', 'name']
    ordering = ['alias']


@admin.register(SocialNetwork)
class SocialNetworkAdmin(admin.ModelAdmin):
    list_display = ['name']
    ordering = ['name']


@admin.register(SocialNetworkLink)
class SocialNetworkLinkAdmin(admin.ModelAdmin):
    list_display = ['social_network', 'url']
    ordering = ['social_network']


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False


@admin.register(User)
class UserAdmin(OriginalUserAdmin):
    inlines = [ProfileInline]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    ordering = ['name']


class PrizeInline(admin.StackedInline):
    model = Prize
    can_delete = True


@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    list_display = ['name', 'enterprise', 'description']
    ordering = ['name']
    inlines = [PrizeInline]


@admin.register(Enterprise)
class EnterpriseAdmin(admin.ModelAdmin):
    list_display = ['name', 'siren', 'is_active']
    ordering = ['name']


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ['bundle', 'user']
