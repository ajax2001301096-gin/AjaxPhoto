from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

def optimize_image(image_field, max_width=1920, max_height=1080, quality=85):
    """
    Tự động resize ảnh về max 1920x1080
    Giữ nguyên tỷ lệ aspect ratio
    """
    try:
        # Mở ảnh
        img = Image.open(image_field)
        original_size = img.size
        
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