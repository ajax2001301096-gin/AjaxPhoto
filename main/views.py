from django.shortcuts import render
from django.views import View
from photo.models import Photo
from location.models import Location
from collections import defaultdict
class MainIndexView(View):
  def get(self,request):
    #アドレスによって全部写真取得
    photos = Photo.objects.select_related('location').all().order_by('uploaded_at')

    #location_idによる写真グループ
    photos_by_location = defaultdict(list)
    for photo in photos :
      if photo.location:
        photos_by_location[photo.location.location_id].append(photo)

    location_groups = []
    for location_id, photo_list in photos_by_location.items():
      location_groups.append({
        'location':photo_list[0].location,
        'photos': photo_list,
        'count':len(photo_list)
      })

    context = {
      'location_groups':location_groups
    }
    return render(request,'main/index.html',context)
  
mainindex = MainIndexView.as_view()