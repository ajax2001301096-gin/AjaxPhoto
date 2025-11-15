from django.db import models
from pathlib import Path
from user.models import User
from location.models import Location
from blogPhoto.models import BlogPhoto

#写真テーブル
class Photo(models.Model):
  photo_id = models.AutoField(primary_key=True,editable=True,verbose_name="写真ID")
  blogPhoto = models.ForeignKey(BlogPhoto,on_delete=models.SET_NULL,blank=True,null=True,editable=True,verbose_name="ブログ")
  picture = models.ImageField(upload_to="photo/picture",null=False,verbose_name="写真")
  uploaded_at = models.DateTimeField(auto_now=True,verbose_name="更新時間")
  update_number = models.IntegerField(default=0,verbose_name="更新番号")

  def __str__(self):
    return str(self.photo_id)
