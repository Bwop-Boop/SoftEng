from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StoreInformationViewSet, StoreEvaluationViewSet, store_report, delete_evaluation

router = DefaultRouter()
router.register(r'stores', StoreInformationViewSet, basename="store")
router.register(r'evaluations', StoreEvaluationViewSet, basename="evaluation")

urlpatterns = [
    path('', include(router.urls)),  # Keep routes available at /api/
    path('stores/<int:store_id>/report/', store_report, name='store_report'),
    path('evaluations/<int:evaluation_id>/', delete_evaluation, name='delete_evaluation'),
]