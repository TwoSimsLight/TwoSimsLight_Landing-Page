import os
import shutil

for i in range(42, 71, 2):
    src = f'original files/assets/image_{i}.jpg'
    dst = f'assets/image_{i}.jpg'
    if os.path.exists(src):
        shutil.copy(src, dst)
