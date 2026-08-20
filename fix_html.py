import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the sneak peek container
pattern = r'<div style="width: 160px; height: 240px; border: 1px solid #ccc; border-radius: 15px; overflow: hidden; box-shadow: 1px 2px 5px rgba\(0,0,0,0\.2\); background: #fff;">\s*<img id="sneak-img"[^>]*>\s*</div>'

replacement = '''<div style="width: 200px; height: 300px; border: 2px solid #b7cde5; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.15); background: #fff; position: relative;">
            <div id="sneak-track" style="display: flex; height: 100%; transition: transform 0.5s ease-in-out;">
                <!-- Images injected via JS -->
            </div>
        </div>'''

text = re.sub(pattern, replacement, text)

# Just in case the old inline styles were different:
pattern2 = r'<div style="width: 180px; height: 270px; border: 2px solid #b7cde5; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 8px rgba\(0,0,0,0\.15\); background: #fff;">\s*<img id="sneak-img"[^>]*>\s*</div>'
text = re.sub(pattern2, replacement, text)

# Try one more generic match for the sneak peek img wrapper
pattern3 = r'<div[^>]*>\s*<img id="sneak-img"[^>]*>\s*</div>'
text = re.sub(pattern3, replacement, text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
