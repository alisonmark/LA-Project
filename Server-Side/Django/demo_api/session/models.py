from django.db import models

class Session(models.Model):
    id = models.AutoField(primary_key=True)
    # _id = models.IntegerField()
    application_id = models.IntegerField()
    # models.CharField(max_length=120)
    auth_key = models.TextField()
    # timestamp = models.IntegerField()
    nonce = models.IntegerField()
    signature = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    device_id = models.TextField()
    # _id = models.IntegerField()
    token = models.TextField()
    ts = models.IntegerField()
    user_id = models.IntegerField()

    # draft = models.BooleanField(default=False)
    # read_time = models.IntegerField(default=0)
    # updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    # created = models.DateTimeField(auto_now=False, auto_now_add=True)

    def __str__(self):
        return self.auth_key

    # class Meta:
    #     ordering = ["-created_at", "-updated_at"]