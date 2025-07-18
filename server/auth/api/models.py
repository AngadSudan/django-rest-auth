import uuid
from django.db import models
from django.contrib.auth.models import User


class Subscription(models.Model):
    subscription_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription_plan = models.CharField(max_length=100)
    subscription_bought_date = models.DateField()
    amount = models.BigIntegerField(null=False,blank=False,default=0)
    subscription_expiry_date = models.DateField()
    bought_by = models.ForeignKey('Profile', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subscription_plan} ({self.subscription_id})"

class Profile(models.Model):
    user_id  = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='profile'
    )
    subscription_id = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    lastLoggedIn = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.user_id.pk)
