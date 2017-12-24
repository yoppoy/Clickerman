# coding=utf-8
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres import fields as postgresModels
from django.core.exceptions import ObjectDoesNotExist
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
import datetime
import time


class Address(models.Model):
    alias = models.CharField(max_length=100)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    line1 = models.TextField()
    line2 = models.TextField(null=True, blank=True)
    postcode = models.CharField(max_length=10)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)

    def name(self):
        return self.alias + ': ' + self.first_name + ' ' + self.last_name

    def __str__(self):
        return self.name()


class SocialNetwork(models.Model):
    name = models.CharField(max_length=50)
    class_name = models.CharField(max_length=100, blank=True)
    url = models.URLField()
    is_shareable = models.BooleanField()
    is_followable = models.BooleanField()

    def __str__(self):
        return self.name


class SocialNetworkLink(models.Model):
    social_network = models.ForeignKey(SocialNetwork)
    url = models.URLField()

    def __str__(self):
        return self.socialnetwork.name


class Enterprise(models.Model):
    name = models.CharField(max_length=100)
    siren = models.CharField(max_length=50)
    url = models.URLField()
    is_active = models.BooleanField()
    date_joined = models.DateField(auto_now_add=True)
    date_deleted = models.DateField(null=True, blank=True)
    addresses = models.ManyToManyField(Address, blank=True)
    media = models.ImageField(blank=True, null=True)
    social_networks = models.ManyToManyField(SocialNetworkLink, blank=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female')
    )
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    date_birthday = models.DateField(null=True, blank=True)
    addresses = models.ManyToManyField(Address, blank=True)
    media = models.ImageField(blank=True, null=True)
    social_networks = models.ManyToManyField(SocialNetworkLink, blank=True)
    enterprise = models.ForeignKey(Enterprise, blank=True, null=True, default=None)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Category(models.Model):
    name = models.CharField(max_length=50)
    parent_category = models.ForeignKey('Category', blank=True, null=True)
    media = models.ImageField(blank=True, null=True)

    def __str__(self):
        return self.name


class Bundle(models.Model):
    enterprise = models.ForeignKey(Enterprise)
    name = models.CharField(max_length=100)
    description = models.TextField()
    total_value = models.IntegerField()
    date_started = models.DateTimeField()
    date_ended = models.DateTimeField()
    STATUS_CHOICES = (
        ('0', 'Draft'),
        ('1', 'Waiting'),
        ('2', 'Validated'),
        ('3', 'Finished'),
    )
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, blank=True)
    media = models.ImageField(blank=True, null=True)
    categories = models.ManyToManyField(Category, blank=True)
    total_clickers = models.IntegerField(default=-1, null=False, blank=False)

    def __str__(self):
        return self.name

    def url(self):
        return '/bundle/' + str(self.id)

    def nb_clickers(self):
        nb_clickers = Score.objects.filter(bundle_id=self.id).count()
        if nb_clickers is not None:
            return str(nb_clickers)
        return '0'

    def get_total_clickers(self):
        if self.total_clickers is -1:
            return '∞'
        return self.total_clickers

    def highscore(self):
        highscore = Score.objects.filter(bundle_id=self.id).aggregate(models.Max('highscore'))['highscore__max']
        if highscore is not None:
            return str(highscore)
        return '0'

    def leaderboard(self, num=10):
        return Score.objects.order_by("-highscore").filter(bundle=self)[:num]

    def time_left(self):
        timestamp = int(time.mktime(self.date_ended.timetuple())) - int(
            time.mktime(datetime.datetime.now().timetuple()))
        return datetime.datetime.fromtimestamp(timestamp).strftime('%dj %H:%M:%S')

    def get_score_of_user(self, user):
        try:
            score = Score.objects.filter(bundle=self).get(user=user)
        except ObjectDoesNotExist:
            score = Score.objects.create(bundle=self, user=user)
        score.check_remaining_clicks()
        return score

    def get_highscore_of_user(self, user):
        score = self.get_score_of_user(user)
        return score.highscore


class Prize(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField()
    bundle = models.ForeignKey(Bundle, on_delete=models.CASCADE, null=False)
    media = models.ImageField(blank=True, null=True)
    quantity = models.IntegerField(default=1)
    value = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Score(models.Model):
    bundle = models.ForeignKey(Bundle, null=False)
    user = models.ForeignKey(User, null=False)
    highscore = models.IntegerField(default=0)
    clicks = models.BigIntegerField(default=0)
    regeneration_date = models.DateTimeField(default=timezone.now)
    remaining_clicks = models.IntegerField(default=100)
    last_clicks = postgresModels.ArrayField(models.IntegerField(default=0), size=10, default=None,
                                            blank=True, null=True)

    def __str__(self):
        return str(self.bundle.name) + ' - ' + str(self.user.username) + ' : ' + str(self.highscore) + ', ' + \
               str(self.clicks)

    def check_remaining_clicks(self):
        if self.regeneration_date + datetime.timedelta(hours=1) < timezone.now():
            self.regeneration_date = timezone.now()
            self.remaining_clicks = 100

    def position(self):
        scores = Score.objects.order_by("-highscore").filter(bundle_id=self.bundle_id)
        i = 0
        for score in scores:
            if score == self:
                return str(i + 1)
            i += 1
        return str(i + 1)

    def add_click(self, num):
        if self.last_clicks is None:
            self.last_clicks = []
            for i in range(0, 10):
                self.last_clicks.append(0)
        else:
            for i in range(9, 0, -1):
                self.last_clicks[i] = self.last_clicks[i - 1]
        self.last_clicks[0] = num
        self.clicks += 1
        self.remaining_clicks -= 1
        self.highscore = self.get_highscore()

    def get_highscore(self):
        highscore = 0
        for i in range(0, 10):
            if self.last_clicks[i] > highscore:
                highscore = self.last_clicks[i]
        return highscore

    def get_regeneration_date(self):
        timestamp = int(time.mktime(self.regeneration_date.timetuple())) - \
                    int(time.mktime(datetime.datetime.now().timetuple()))
        return datetime.datetime.fromtimestamp(timestamp).strftime('%M')
