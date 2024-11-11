# Backend/Apps/Users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)
    
    # Add any custom fieldsets or other configurations here
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ()}),  # Add your custom fields here
    )

# Simply register without trying to unregister first
admin.site.register(User, CustomUserAdmin)
