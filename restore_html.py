with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_clock = '''<div class="clock-container">
                                <button id="pause-btn" class="pause-btn-container" title="Pause Game">
                                    <div class="pause-icon"></div>
                                    <div class="play-icon"></div>
                                </button>
                                <div class="clock-outer">'''

new_clock = '''<div class="clock-container">
                                <!-- Gender icons attached to clock -->
                                <div style="position: absolute; left: -10px; top: -5px; width: 22px; height: 22px; background: linear-gradient(to bottom, #fff, #d0e0cd); border: 2px solid #85a4ce; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #85a4ce; font-size: 14px; font-weight: bold; z-index: 1;">♂</div>
                                <div style="position: absolute; left: -10px; bottom: -5px; width: 22px; height: 22px; background: linear-gradient(to bottom, #fff, #d0e0cd); border: 2px solid #85a4ce; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #85a4ce; font-size: 14px; font-weight: bold; z-index: 1;">♀</div>
                                
                                <button id="pause-btn" class="pause-btn-container" title="Pause Game">
                                    <div class="pause-icon"></div>
                                    <div class="play-icon"></div>
                                </button>
                                <div class="clock-outer">'''
text = text.replace(old_clock, new_clock)

# also fix the start buttons if they were lost during backup
text = text.replace('src="assets/sim_male.png"', 'src="assets/m_stage4.jpg" style="width: 100%; height: 100%; object-fit: cover; object-position: top center;"')
text = text.replace('src="assets/sim_female.png"', 'src="assets/f_stage4.jpg" style="width: 100%; height: 100%; object-fit: cover; object-position: top center;"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
