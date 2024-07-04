from django.contrib import admin

from medical.models import LabTest, LabRequest

# Register your models here.
admin.site.register(LabTest)
admin.site.register(LabRequest)
