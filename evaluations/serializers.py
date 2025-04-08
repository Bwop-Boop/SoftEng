from rest_framework import serializers
from .models import StoreInformation, StoreEvaluation

class StoreInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreInformation
        fields = ["id", "name", "address", "audit_schedule"]

class StoreEvaluationSerializer(serializers.ModelSerializer):
    store_details = StoreInformationSerializer(source="store", read_only=True)  # To fetch store details if needed

    class Meta:
        model = StoreEvaluation
        fields = [
            'id', 'store', 'store_details', 'evaluation_date',
            'cl1', 'cl2', 'cl3', 'cl4', 'cl5', 'cl6', 'cl7',
            'cn1', 'cn2', 'cn3', 'cn4', 'cn5', 'cn6', 'cn7', 'cn8', 'cn9', 'cn10', 'cn11',
            'ce1', 'ce2', 'ce3', 'ce4', 'ce5', 'ce6',
            'pg1', 'ac1', 'ac2', 'ac3',
            'ss1', 'ss2', 'ss3',
            'pq1', 'pq2',
            'remarks',  # Include the new remarks field
        ]


class StoreReportSerializer(serializers.Serializer):
    average_cleanliness = serializers.FloatField()
    average_condition = serializers.FloatField()
    average_customer_engagement = serializers.FloatField()
    average_personnel_grooming = serializers.FloatField()
    average_accuracy = serializers.FloatField()
    average_speed_of_service = serializers.FloatField()
    average_product_quality = serializers.FloatField()