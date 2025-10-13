from django.db import models
#ユーザーテーブルを再定義
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from pathlib import Path
import uuid 

#ユーザーを作るためのマネジャー
class CustomUserManager(BaseUserManager):
  def create_user(self,email,password=None,**extra_fields):
    if not email :
      raise ValueError("メールアドレスを設定しないといけない")
    email = self.normalize_email(email)
    user = self.model(email=email,**extra_fields)
    user.set_password(password)
    user.save(using=self._db)
    return user
  
  def create_superuser(self,email,password=None,**extra_fields):
    extra_fields.setdefault("is_staff",True)
    extra_fields.setdefault("is_superuser",True)
    return self.create_user(email,password,**extra_fields)
  
#ユーザーテーブル
class User(AbstractBaseUser,PermissionsMixin):
  user_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=True,verbose_name="ユーザーID")
  email = models.CharField(max_length=50,unique=True,verbose_name="メールアドレス")
  first_name = models.CharField(max_length=50,verbose_name="姓")
  last_name = models.CharField(max_length=50,verbose_name="名")
  update_user = models.ForeignKey('self',on_delete=models.SET_NULL,null=True,blank=True,verbose_name="更新ユーザー")
  update_at = models.DateTimeField(auto_now_add=True,verbose_name="最終更新時間")
  del_flg = models.BooleanField(default=False,verbose_name="削除フラグ")

  is_active = models.BooleanField(default=True)
  is_staff = models.BooleanField(default=True)
  USERNAME_FIELD = "email"
  REQUIRED_FIELDS = ["first_name","last_name"]

  objects = CustomUserManager()

  def __str__(self):
    return f"{self.first_name} {self.last_name}"