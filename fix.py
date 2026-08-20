with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i in range(len(lines)):
    if '.mem-back {' in lines[i]:
        if '}' not in lines[i-1]:
            lines.insert(i, '}\n')
            break
with open('style.css', 'w', encoding='utf-8') as f:
    f.writelines(lines)
