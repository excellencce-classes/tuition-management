from django.contrib import admin
from .models import StudentRegistration, Attendance

@admin.register(StudentRegistration)
class StudentRegistrationAdmin(admin.ModelAdmin):
    list_display = ('name', 'standard', 'board', 'branch', 'fees')  # Changed 'fees_amount' to 'fees'
    list_filter = ('standard', 'board', 'branch')
    search_fields = ('name', 'phone')
    
    
admin.site.register(Attendance)