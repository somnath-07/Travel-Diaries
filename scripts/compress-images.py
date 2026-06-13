import os
import re
from PIL import Image

def clean_filename(filename):
    # Split name and extension
    name, ext = os.path.splitext(filename)
    # Convert name to lowercase and replace spaces/special chars with underscores
    name_clean = re.sub(r'[^a-zA-Z0-9_\-]', '_', name.lower())
    # Clean multiple consecutive underscores
    name_clean = re.sub(r'_{2,}', '_', name_clean)
    name_clean = name_clean.strip('_')
    return f"{name_clean}.webp"

def compress_images():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    source_dir = os.path.join(base_dir, 'images')
    dest_dir = os.path.join(base_dir, 'public', 'images')
    output_file = os.path.join(base_dir, 'src', 'data', 'loaderImages.js')

    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir, exist_ok=True)

    print(f"Source directory: {source_dir}")
    print(f"Destination directory: {dest_dir}")
    print(f"Output JS file: {output_file}")

    image_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    source_files = [f for f in os.listdir(source_dir) if f.lower().endswith(image_extensions)]
    
    print(f"Found {len(source_files)} images in source directory.")

    # Convert and compress each image
    webp_paths = []
    generated_filenames = set()

    for filename in source_files:
        src_path = os.path.join(source_dir, filename)
        base_new_name = clean_filename(filename)
        
        # Avoid filename collisions
        new_name = base_new_name
        counter = 1
        name_part, ext_part = os.path.splitext(base_new_name)
        while new_name in generated_filenames:
            new_name = f"{name_part}_{counter}{ext_part}"
            counter += 1
            
        dest_path = os.path.join(dest_dir, new_name)
        generated_filenames.add(new_name)
        
        try:
            with Image.open(src_path) as img:
                # Convert RGBA/P to RGB if saving to WebP, or just keep format
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img = img.convert('RGBA')
                else:
                    img = img.convert('RGB')
                
                # Resize if max dimension is greater than 400px
                max_size = 400
                width, height = img.size
                if max(width, height) > max_size:
                    if width > height:
                        new_width = max_size
                        new_height = int(height * (max_size / width))
                    else:
                        new_height = max_size
                        new_width = int(width * (max_size / height))
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    print(f"Resized {filename}: {width}x{height} -> {new_width}x{new_height}")
                
                # Save as WebP with high compression
                img.save(dest_path, 'WEBP', quality=60)
                file_size = os.path.getsize(dest_path)
                print(f"Compressed & Saved: {new_name} ({file_size / 1024:.2f} KB)")
                
                webp_paths.append(f"/images/{new_name}")
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    # Remove old images from public/images that are not in the new generated files
    all_dest_files = os.listdir(dest_dir)
    removed_count = 0
    for filename in all_dest_files:
        if filename not in generated_filenames:
            try:
                os.remove(os.path.join(dest_dir, filename))
                removed_count += 1
            except Exception as e:
                print(f"Error removing old file {filename}: {e}")
    
    if removed_count > 0:
        print(f"Cleaned up {removed_count} old/unused images from destination directory.")

    # Write src/data/loaderImages.js
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    # Sort webp paths to maintain a deterministic order
    webp_paths.sort()
    
    js_content = f"export const loaderImages = [\n"
    for path in webp_paths:
        js_content += f"  \"{path}\",\n"
    js_content += "];\n"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Updated {output_file} with {len(webp_paths)} images.")

if __name__ == '__main__':
    compress_images()
