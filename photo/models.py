from django.db import models
from pathlib import Path
from user.models import User
from location.models import Location

#写真テーブル
class Photo(models.Model):
  photo_id = models.IntegerField(primary_key=True,editable=True,verbose_name="写真ID")
  blog_content = models.TextField(verbose_name="ブログコンテンツ")
  title = models.CharField(max_length=50,verbose_name="タイトル")
  picture = models.ImageField(upload_to="photo/picture",blank=True,null=False,verbose_name="写真")
  location = models.ForeignKey(Location,on_delete=models.SET_NULL,null=True,verbose_name="撮影する場所")
  camera_info = models.TextField(verbose_name="設定情報")
  taken_date = models.DateField(verbose_name="撮影日付")
  uploaded_at = models.DateTimeField(auto_now_add=True,verbose_name="更新時間")
  update_number = models.IntegerField(default=0,verbose_name="更新番号")

  def __str__(self):
    return self.title
