from PIL import Image, ExifTags
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
import os

def optimize_image(image_field, max_width=1920, max_height=1080, quality=85):
    """
    Tự động resize ảnh về max 1920x1080
    Giữ nguyên tỷ lệ aspect ratio
    ✅ FIX: Xử lý EXIF orientation để ảnh không bị xoay
    ✅ FIX: Đảm bảo tên file đúng
    """
    try:
        # Mở ảnh
        img = Image.open(image_field)
        original_size = img.size
        
        # ✅ XỬ LÝ EXIF ORIENTATION (fix ảnh bị xoay)
        try:
            exif = img._getexif()
            if exif is not None:
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
        
        # ✅ FIX: Xử lý tên file đúng cách
        # Lấy tên file gốc (không có extension)
        original_filename = os.path.basename(image_field.name)
        filename_without_ext = os.path.splitext(original_filename)[0]
        new_filename = f"{filename_without_ext}.jpg"
        
        print(f"📁 Original: {image_field.name}")
        print(f"📁 New filename: {new_filename}")
        
        # Tạo file mới
        return InMemoryUploadedFile(
            output,
            'ImageField',
            new_filename,
            'image/jpeg',
            sys.getsizeof(output),
            None
        )
    except Exception as e:
        print(f"❌ Error optimizing image: {e}")
        import traceback
        traceback.print_exc()
        # Nếu lỗi, trả về ảnh gốc
        return image_field