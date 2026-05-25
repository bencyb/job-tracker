from django.contrib import admin
from jobs.models import JobApplication, Profile, JobNote

# Register your models here.
admin.site.register(JobApplication)
admin.site.register(Profile)
admin.site.register(JobNote)
