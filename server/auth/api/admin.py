from django.contrib import admin
from .models import Profile, Subscription

class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user_id',
        'get_username',
        'get_email',
        'subscription_id',
        'lastLoggedIn',
        'created_at'
    )

    def get_username(self, obj):
        return obj.user_id.username   # ✅ access the User object
    get_username.short_description = 'Username'

    def get_email(self, obj):
        return obj.user_id.email     # ✅ access the User object
    get_email.short_description = 'Email'

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        'subscription_id',
        'subscription_plan',
        'bought_by',
        'subscription_bought_date',
        'subscription_expiry_date',
        'created_at'
    )

admin.site.register(Profile, ProfileAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
