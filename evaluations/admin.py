from django.contrib import admin
from .models import StoreInformation, StoreEvaluation

@admin.register(StoreInformation)
class StoreInformationAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'audit_schedule')
    search_fields = ('name', 'address')

@admin.register(StoreEvaluation)
class StoreEvaluationAdmin(admin.ModelAdmin):
    list_display = ('store', 'evaluation_date', 'cleanliness', 'customer_service', 'efficiency', 'standard_spiel')
    list_filter = ('evaluation_date', 'store')
    search_fields = ('store__name',)
    date_hierarchy = 'evaluation_date'  # ⬅ Makes it easy to filter by year/month/day
