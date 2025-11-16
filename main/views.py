from django.shortcuts import render, get_object_or_404
from django.views import View
from photo.models import Photo
from blogPhoto.models import BlogPhoto
from location.models import Location
from collections import defaultdict
from django.views.decorators.cache import cache_page
from django.db.models import Count

class MainIndexView(View):
  def get(self,request):
    #ブログによって全部写真取得
    photos = Photo.objects.select_related(
            'blogPhoto',           # Load blog cùng lúc
            'blogPhoto__location'  # Load location luôn (tránh N+1)
        ).filter(
            blogPhoto__isnull=False  # Chỉ lấy photo có blog
        ).order_by(
            '-blogPhoto__update_date',  # Blog mới nhất
            'uploaded_at'
        )[:60] 

    #blog_idによる写真グループ
    photos_by_blog = defaultdict(list)
    for photo in photos :
      if photo.blogPhoto:
        photos_by_blog[photo.blogPhoto.blog_id].append(photo)

    blog_groups = []
    for blog_id, photo_list in photos_by_blog.items():
      blog_groups.append({
        'location':photo_list[0].blogPhoto.location,
        'photos': photo_list,
        'count':len(photo_list)
      })

    context = {
      'blog_groups':blog_groups
    }
    return render(request,'main/index.html',context)
  
def blog_detail(request,blog_id):
  #ブログ詳細を表示する
  #現在のブログを取得
  blog = get_object_or_404(BlogPhoto.objects.select_related('location'),blog_id=blog_id)
  #現在ブログの全部写真
  photos = Photo.objects.filter(blogPhoto=blog).order_by('uploaded_at')

  related_blogs = []
  if blog.location:
    same_location_blogs = BlogPhoto.objects.filter(location=blog.location).exclude(blog_id=blog_id).select_related('location').prefetch_related('photo_set').order_by('-update_date')[:3]

    related_blogs = list(same_location_blogs)

  if len(related_blogs) < 3:
    additional_blos = BlogPhoto.objects.exclude(blog_id=blog_id).exclude(blog_id__in=[b.blog_id for b in related_blogs]).select_related('location').prefetch_related('photo_set').order_by('-update_date')[:(3 - len(related_blogs))]
    related_blogs.extend(list(additional_blos))
  
  context = {
    'blog':blog,
    'photos':photos,
    'related_blogs':related_blogs
  }
  return render(request,'blog/detail.html',context)


mainindex = cache_page(60 * 5)(MainIndexView.as_view())
