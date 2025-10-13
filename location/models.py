from django.db import models
from pathlib import Path

#アドレステーブル
class Location(models.Model):
  location_id = models.IntegerField(primary_key=True,editable=True,blank=True,verbose_name="場所ID")
  location_name = models.TextField(verbose_name="場所名")
  maps_url = models.TextField(null=False,verbose_name="マップリンク")

  def __str__(self):
    return self.location_name