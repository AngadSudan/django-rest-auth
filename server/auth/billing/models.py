import uuid
from django.db import models
from api.models import User

class Subscription(models.Model):
    subscription_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription_plan = models.CharField(max_length=100)
    subscription_bought_date = models.DateField()
    subscription_expiry_date = models.DateField()
    bought_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subscription_plan} for {self.bought_by.name}"
