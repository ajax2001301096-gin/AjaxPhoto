from django.urls import path
from . import views

app_name = 'main'
urlpatterns = [
  path('',views.mainindex,name='index'),
  path('blog/<int:blog_id>/', views.blog_detail, name='blog_detail'),
]