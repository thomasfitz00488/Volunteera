from django.db import models
from django.contrib.auth.models import AbstractUser
import os
import json
from django.core.exceptions import ValidationError

class User(AbstractUser):
    email = models.EmailField(max_length=100, unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Interest(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='interests')
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Volunteer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', through='Friendship', symmetrical=False)
    interests = models.ManyToManyField(Interest, related_name='interests', blank=True, null=True)
    opportunities_completed = models.IntegerField(default = 0)
    last_completion = models.DateTimeField(null = True, blank=True)
    display_name = models.CharField(max_length = 16, unique = True)
    elderly_score = models.IntegerField(default = 0)
    medical_score = models.IntegerField(default = 0)
    sports_score = models.IntegerField(default = 0)
    animals_score = models.IntegerField(default = 0)
    disability_score = models.IntegerField(default = 0)
    greener_planet_score = models.IntegerField(default = 0)
    community_score = models.IntegerField(default = 0)
    education_score = models.IntegerField(default = 0)
    name_share_public = models.BooleanField(default = False)
    public_friends = models.BooleanField(default = False)


    def __str__(self):
        return self.user.email

class Friendship(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    from_volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='friendships_initiated')
    to_volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='friendships_received')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.from_volunteer == self.to_volunteer:
            raise ValidationError("You cannot be friends with yourself")
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ['from_volunteer', 'to_volunteer']

    def __str__(self):
        return f"{self.from_volunteer} -> {self.to_volunteer} ({self.status})"

class Organization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    charity_number = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='organization_logos/', null=True, blank=True)
    description = models.TextField()
    approved = models.BooleanField(default=False)
    automatic_accepting = models.BooleanField(default = False)

    def __str__(self):
        return self.name

class Opportunity(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='opportunities')
    title = models.CharField(max_length=200, unique = True)
    description = models.TextField()
    requirements = models.TextField()
    location_name = models.CharField(max_length=200)        #Make sure it is always a city please
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    categories = models.ManyToManyField(Category, related_name='opportunities')
    #------------------------------------------------------------------------------------------------- Alex Addded Below Need to talk through

    CHOICES = {
        "low" : "Low",
        "medium" : "Medium",
        "high" : "High"
    }
    # start and end time are reflective of the normal work hours like 9-5 where start is 9 and end is 17 since it is a 24 hour clock
    start_time = models.IntegerField() # add validators not more than 24 and not less than 0
    end_time = models.IntegerField() # add validators not more than 24 and not less than 0
    estimated_duration = models.IntegerField()
    estimated_effort_ranking = models.CharField(choices = CHOICES, max_length=6)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    capacity = models.IntegerField()
    current_volunteers_count = models.IntegerField(default = 0)

    def save(self, *args, **kwargs):
        file_path = os.path.join(os.path.dirname(__file__), "components", "gb.json")
        with open(file_path, "r") as file:
            data = json.load(file)

        for location in data:
            if self.location_name == location["city"]:
                self.latitude = location["lat"]
                self.longitude = location["lng"]
        return super().save(*args, **kwargs)


    def __str__(self):
        return self.title

    def pending_applications_count(self):
        return self.applications.filter(status='pending').count()

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('requesting_complete', 'Request Completion'),
        ('completed', 'Completed'),
        ('not_completed', 'Not Completed')
    ]

    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='applications')
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    current_volunteers = models.IntegerField()
    date_applied = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    dates_worked = models.CharField(max_length=1024)

    class Meta:
        unique_together = ['volunteer', 'opportunity']

    def __str__(self):
        return f"{self.volunteer} - {self.opportunity}"

class Messages(models.Model):
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    from_person = models.CharField(max_length = 50, blank = False, null = False)
    time_sent = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=1024)

    def __str__(self):
        return f"From {self.from_person}, To {self.volunteer}"

class Discussion(models.Model):
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE)
    title = models.CharField(max_length = 128)
    content = models.TextField(max_length = 2048)
    answer = models.TextField(max_length=2048, null = True, blank = True)
    time_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title