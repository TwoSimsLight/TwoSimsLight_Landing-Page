with open('backup2/style.css', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('width: 610px;\n    height: 480px;', 'width: 750px;\n    height: 650px;')
text = text.replace('width: 170px;', 'width: 230px;')

text = text.replace('width: 90px; height: 90px;', 'width: 115px; height: 115px;')
text = text.replace('width: 76px; height: 76px;\n    border: 5px dashed #9bc45c;', 'width: 98px; height: 98px;\n    border: 6px dashed #9bc45c;')
text = text.replace('width: 62px; height: 62px;', 'width: 80px; height: 80px;')
text = text.replace('width: 3px; height: 26px;', 'width: 4px; height: 34px;')
text = text.replace('left: -35px;\n    top: 50%;\n    transform: translateY(-50%);\n    width: 32px; height: 32px;', 'left: -42px;\n    top: 50%;\n    transform: translateY(-50%);\n    width: 38px; height: 38px;')

text = text.replace('min-width: 0; min-height: 0;', 'width: 85px; height: 85px; margin: auto;')
text = text.replace('width: 100%;\n    height: 100%;\n    max-width: 72px;\n    max-height: 72px;\n    aspect-ratio: 1 / 1;', 'width: 85px;\n    height: 85px;')
text = text.replace('transition: transform 0.4s;', 'transition: transform 0.3s ease-out;')

import re
# Now CAREFULLY replace ONLY .mem-back {...}
text = re.sub(r'\n\.mem-back\s*\{[^}]*\}', '''\n.mem-back {
    background: radial-gradient(circle at 35% 30%, #f6ffdc, #b2db6e 65%);
    box-shadow: inset -4px -5px 10px rgba(0,0,0,0.15), inset 3px 4px 10px rgba(255,255,255,1), 1px 2px 4px rgba(0,0,0,0.25);
    border: 4px solid #fff;
    box-sizing: border-box;
    position: relative;
}
.mem-back::after {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: url('assets/plumbob_trans.png') center/50% no-repeat;
    opacity: 0;
    transition: opacity 0.3s ease;
}
.mem-card:hover:not(.flipped):not(.matched) .mem-back::after {
    opacity: 0.85;
}''', text, count=1)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(text)
