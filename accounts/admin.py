from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "first_name", "last_name", "role", "is_staff", "is_active")  # ✅ Show in Admin Panel

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "email")}),  # ✅ Added First & Last Name
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
        ("Role", {"fields": ("role",)}),  # ✅ Only one "role" field here
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "password1", "password2", "first_name", "last_name", "email", "role", "is_staff", "is_active"),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
