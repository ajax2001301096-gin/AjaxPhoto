from django.contrib.auth.views import LoginView,LogoutView
from django.urls import path
from . import views

app_name = "user"
urlpatterns = [
  path('login/',views.login_view,name='login'),
  path('logout/',views.smart_logout,name='logout'),
]