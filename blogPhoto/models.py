from django.db import models
from pathlib import Path
from location.models import Location


#写真ブログテーブル
class BlogPhoto(models.Model):
  blog_id = models.AutoField(primary_key=True,editable=True,blank=True,verbose_name="ブログID")
  blog_title = models.TextField(verbose_name="タイトル")
  blog_body = models.TextField(null=False,verbose_name="ブログコンテンツ")
  location = models.ForeignKey(Location,on_delete=models.SET_NULL,null=True,verbose_name="アドレス")
  camera_info = models.TextField(verbose_name="カメラ情報")
  update_date = models.DateTimeField(auto_now_add=True,verbose_name="更新日")
  update_number = models.IntegerField(default=0,verbose_name="更新番号")


  def __str__(self):
    return self.blog_title