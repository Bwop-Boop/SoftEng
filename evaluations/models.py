from django.db import models

class StoreInformation(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    audit_schedule = models.DateField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Store Information"
        verbose_name_plural = "Stores Information"


class StoreEvaluation(models.Model):
    store = models.ForeignKey(StoreInformation, on_delete=models.CASCADE)

    # Likert scale choices for all categories (1-5)
    CHOICE = [(i, str(i)) for i in range(1, 6)]

    # CLEANLINESS (CL) questions
    cl1 = models.IntegerField(choices=CHOICE)
    cl2 = models.IntegerField(choices=CHOICE)
    cl3 = models.IntegerField(choices=CHOICE)
    cl4 = models.IntegerField(choices=CHOICE)
    cl5 = models.IntegerField(choices=CHOICE)
    cl6 = models.IntegerField(choices=CHOICE)
    cl7 = models.IntegerField(choices=CHOICE)

    # CONDITION (CN) questions
    cn1 = models.IntegerField(choices=CHOICE)
    cn2 = models.IntegerField(choices=CHOICE)
    cn3 = models.IntegerField(choices=CHOICE)
    cn4 = models.IntegerField(choices=CHOICE)
    cn5 = models.IntegerField(choices=CHOICE)
    cn6 = models.IntegerField(choices=CHOICE)
    cn7 = models.IntegerField(choices=CHOICE)
    cn8 = models.IntegerField(choices=CHOICE)
    cn9 = models.IntegerField(choices=CHOICE)
    cn10 = models.IntegerField(choices=CHOICE)
    cn11 = models.IntegerField(choices=CHOICE)

    # CUSTOMER ENGAGEMENT (CE) questions
    ce1 = models.IntegerField(choices=CHOICE)
    ce2 = models.IntegerField(choices=CHOICE)
    ce3 = models.IntegerField(choices=CHOICE)
    ce4 = models.IntegerField(choices=CHOICE)
    ce5 = models.IntegerField(choices=CHOICE)
    ce6 = models.IntegerField(choices=CHOICE)

    # PERSONNEL GROOMING (PG) question
    pg1 = models.IntegerField(choices=CHOICE)

    # ACCURACY (AC) questions
    ac1 = models.IntegerField(choices=CHOICE)
    ac2 = models.IntegerField(choices=CHOICE)
    ac3 = models.IntegerField(choices=CHOICE)

    # SPEED OF SERVICE (SS) questions
    ss1 = models.IntegerField(choices=CHOICE)
    ss2 = models.IntegerField(choices=CHOICE)
    ss3 = models.IntegerField(choices=CHOICE)

    # PRODUCT QUALITY (PQ) questions
    pq1 = models.IntegerField(choices=CHOICE)
    pq2 = models.IntegerField(choices=CHOICE)

    # Manually set the evaluation date (no auto_now_add)
    evaluation_date = models.DateField()

    # Optional remarks field
    remarks = models.TextField(blank=True, null=True)

    def cleanliness(self):
        return (self.cl1 + self.cl2 + self.cl3 + self.cl4 + self.cl5 + self.cl6 + self.cl7) / 7

    def customer_service(self):
        return (self.ce1 + self.ce2 + self.ce3 + self.ce4 + self.ce5 + self.ce6) / 6

    def efficiency(self):
        return (self.cn1 + self.cn2 + self.cn3 + self.cn4 + self.cn5 + self.cn6 + self.cn7 + self.cn8 + self.cn9 + self.cn10 + self.cn11) / 11

    def standard_spiel(self):
        return (self.pq1 + self.pq2) / 2

    def __str__(self):
        return f"Evaluation for {self.store.name} on {self.evaluation_date}"

    class Meta:
        verbose_name = "Store Evaluation"
        verbose_name_plural = "Store Evaluations"