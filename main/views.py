from django.shortcuts import render
from django.views import View
from photo.models import Photo
from location.models import Location
from collections import defaultdict
class MainIndexView(View):
  def get(self,request):
    #ブログによって全部写真取得
    photos = Photo.objects.select_related('blogPhoto').all().order_by('uploaded_at')

    #blog_idによる写真グループ
    photos_by_blog = defaultdict(list)
    for photo in photos :
      if photo.blogPhoto:
        photos_by_blog[photo.blogPhoto.blog_id].append(photo)

    blog_groups = []
    for location_id, photo_list in photos_by_blog.items():
      blog_groups.append({
        'location':photo_list[0].blogPhoto.location,
        'photos': photo_list,
        'count':len(photo_list)
      })

    context = {
      'blog_groups':blog_groups
    }
    return render(request,'main/index.html',context)
  
mainindex = MainIndexView.as_view()