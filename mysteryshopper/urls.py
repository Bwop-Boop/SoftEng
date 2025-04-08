from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),  # ✅ Ensure accounts URLs are included
    path('api/', include('evaluations.urls')),  # ✅ Include evaluations API routes
]