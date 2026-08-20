from PIL import Image
import os
for i in range(88):
    path = f'original files/assets/image_{i}.jpg'
    if not os.path.exists(path): continue
    try:
        img = Image.open(path)
        w, h = img.size
        if w != h:
            print(f'{path} is {w}x{h}')
    except: pass
