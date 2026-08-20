import re
with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

# I will find .mem-back { ... } and replace it cleanly!
pattern = re.compile(r'\.mem-back \{.*?(?=\.mem-back::after)', re.DOTALL)
clean_css = '''\.mem-back {
    background: radial-gradient(circle at 35% 30%, #f6ffdc, #b2db6e 65%);
    box-shadow: inset -4px -5px 10px rgba(0,0,0,0.15), inset 3px 4px 10px rgba(255,255,255,1), 1px 2px 4px rgba(0,0,0,0.25);
    border: 4px solid #fff;
    box-sizing: border-box;
    position: relative;
}
'''
text = re.sub(pattern, clean_css, text)

# Ensure closing bracket for .mem-front, .mem-back
text = text.replace('will-change: transform;\n.mem-back {', 'will-change: transform;\n}\n.mem-back {')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(text)
