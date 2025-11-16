from PIL import Image, ExifTags
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

def optimize_image(image_field, max_width=1920, max_height=1080, quality=85):
    """
    Tự động resize ảnh về max 1920x1080
    Giữ nguyên tỷ lệ aspect ratio
    ✅ FIX: Xử lý EXIF orientation để ảnh không bị xoay
    """
    try:
        # Mở ảnh
        img = Image.open(image_field)
        original_size = img.size
        
        # ✅ XỬ LÝ EXIF ORIENTATION (fix ảnh bị xoay)
        try:
            # Lấy thông tin EXIF
            exif = img._getexif()
            if exif is not None:
                # Tìm tag orientation
                orientation_key = None
                for tag, value in ExifTags.TAGS.items():
                    if value == 'Orientation':
                        orientation_key = tag
                        break
                
                if orientation_key and orientation_key in exif:
                    orientation = exif[orientation_key]
                    
                    # Xoay ảnh theo EXIF orientation
                    if orientation == 3:
                        img = img.rotate(180, expand=True)
                    elif orientation == 6:
                        img = img.rotate(270, expand=True)
                    elif orientation == 8:
                        img = img.rotate(90, expand=True)
                    
                    print(f"✅ Fixed EXIF orientation: {orientation}")
        except (AttributeError, KeyError, IndexError, TypeError):
            # Không có EXIF data hoặc lỗi khi đọc
            pass
        
        # Convert sang RGB nếu là PNG/RGBA
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'RGBA':
                background.paste(img, mask=img.split()[-1])
            else:
                background.paste(img)
            img = background
        
        # Resize nếu ảnh quá lớn
        if img.width > max_width or img.height > max_height:
            img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
            print(f"✅ Resized: {original_size} → {img.size}")
        else:
            print(f"ℹ️ No resize needed: {img.size}")
        
        # Lưu vào BytesIO với compression
        output = BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        
        # Tạo file mới
        return InMemoryUploadedFile(
            output,
            'ImageField',
            f"{image_field.name.split('.')[0]}.jpg",
            'image/jpeg',
            sys.getsizeof(output),
            None
        )
    except Exception as e:
        print(f"❌ Error optimizing image: {e}")
        # Nếu lỗi, trả về ảnh gốc
        return image_field