/**
 * 
 * @param {int} h [0,360]
 * @param {int} s [0,100]
 * @param {int} l [0,100]
 * @returns 
 */
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHSL(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      r = parseInt(result[1], 16);
      g = parseInt(result[2], 16);
      b = parseInt(result[3], 16);
      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;
      if(max == min){
        h = s = 0; // achromatic
      }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
    var HSL = [Math.round(h*360), Math.round(s*100), Math.round(l*100)]
    return HSL;
  }

class ColorPicker extends HTMLElement {
    constructor() {
        super(); // Call the HTMLElement constructor

        // Attach Shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // HTML structure
        shadow.innerHTML = `
        <style>
        :host,:host * {
            box-sizing: border-box;
        }
        :host {
            display: inline-block;
            background: var(--clr-p100);
            padding: 10px;
            border-radius: 10px;
            border: 1px solid var(--clr-p900);
        }

        .color-picker {
            display: flex;
            gap: 8px;
            align-items: center;
            }
        .group {
            height: 64px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
        }
        .swatch {
            width: 64px;
            height: 64px;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1)),
                        linear-gradient(to left, hsl(0, 100%, 50%), rgba(255, 255, 255, 1));
            position: relative;
            cursor: crosshair;
        }
        .swatch > .indicator {
            position: absolute;
            width: 8px;
            height: 8px;
            background: none;
            border: 1px solid black;
            pointer-events: none;
        }
        .slider {
            width: 64px;
            height: 16px;
            background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
            border-radius: 10px;
            border: 1px solid var(--clr-p800);
            position: relative;
            cursor: pointer;
        }
        .slider > .thumb {
            position: absolute;
            width: 12px;
            height: 12px;
            background: white;
            border: 1px solid black;
            border-radius: 50%;
            top: 1px;
        }
        .use-button {
            width: min-content;
            padding: 2px 10px;
            border: 2px solid var(--accent, var(--clr-p800));
            color: var(--clr-p800);
            border-radius: 20px;
            background: var(--clr-p200);
            cursor: pointer;
            font-size: 10px;
            text-align: center;
            font-weight: 500;
        }
        .sub-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        input {
            all: unset;
            width: 64px;
            height: 16px;
            font-size: 10px;
            letter-spacing: 0;
            padding: 2px 4px;
            border-radius: 8px;
            border: 1px solid var(--clr-p800);
            background-color: var(--clr-p200);
        }
        input:focus:invalid {
            border: 1px solid hsl(0, 77.80%, 61.20%);
        }
        input:focus:valid {
            border: 1px solid #4FE9A6;
        }
        </style>
        <div class="color-picker">
            <div class="swatch">
                <div class="indicator"></div>
            </div>
            <div class="group">
                <div class="sub-group">
                    <div class="slider">
                        <div class="thumb"></div>
                    </div>
                    <input type="text" value="#ffffff" minlength="6" maxlength="7" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" />
                </div>
                <button class="use-button">Use</button>
            </div>
        </div>
        `;

        // Add event listeners and state management here
        this._setupListeners();
    }

    // Expose methods and properties for interaction
    _setupListeners() {
        const swatch = this.shadowRoot.querySelector('.swatch');
        const indicator = this.shadowRoot.querySelector('.indicator');
        const slider = this.shadowRoot.querySelector('.slider');
        const thumb = this.shadowRoot.querySelector('.thumb');
        const button = this.shadowRoot.querySelector('.use-button');
        const input = this.shadowRoot.querySelector("input")
    
        // State
        let hue = 0;
        let saturation = 100;
        let brightness = 100;

        // Utility to constrain values within bounds
        const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
        
        // Swatch (with drag) support
        const handleSwatchInteraction = (event) => {          
            const isTouch = event.type.includes('touch');
            const point = isTouch ? event.touches[0] : event;
            const rect = swatch.getBoundingClientRect();
            const x = clamp(point.clientX - rect.left, 0, rect.width);
            const y = clamp(point.clientY - rect.top, 0, rect.height);
            const boundedX = clamp(x - 4, 0, rect.width - 8)
            const boundedY = clamp(y - 4, 0, rect.height - 8)
        
            // Update indicator position
            indicator.style.left = `${boundedX}px`;
            indicator.style.top = `${boundedY}px`;
        
            // Calculate saturation and brightness
            saturation = Math.round((x / rect.width) * 100);
            let verticalFactor = 1 - y / rect.height; // From top to bottom
            let horizontalLightness = 100 - (x / rect.width) * 50; // From left to right            
            brightness = Math.round(verticalFactor * horizontalLightness);

            
            this._updateColor(hue, saturation, brightness);
        }

        // Swatch interaction
        swatch.addEventListener('mousedown', (event) => {
            handleSwatchInteraction(event);
            document.addEventListener('mousemove', handleSwatchInteraction);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleSwatchInteraction);
            });
        });
        swatch.addEventListener('touchstart', (event) => {
            handleSwatchInteraction(event);
            document.addEventListener('touchmove', handleSwatchInteraction);
            document.addEventListener('touchend', () => {
                document.removeEventListener('touchmove', handleSwatchInteraction);
            });
        });
        
        // Slider (drag) support
        const handleSliderInteraction = (event) => {
            const isTouch = event.type.includes('touch');
            const rect = slider.getBoundingClientRect();
            const point = isTouch ? event.touches[0] : event;
            const x = clamp(point.clientX - rect.left, 0, rect.width);
            const bounedX = clamp(x - 6, 0, rect.width - 12)
            hue = Math.round((x / rect.width) * 360);

            // Update thumb position
            thumb.style.left = `${bounedX}px`;

            this._updateColor(hue, saturation, brightness);
        }

        // Slider interaction
        slider.addEventListener('mousedown', (event) => {
            handleSliderInteraction(event);
            document.addEventListener('mousemove', handleSliderInteraction);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleSliderInteraction);
            });
        });

        slider.addEventListener('touchstart', (event) => {
            handleSliderInteraction(event);
            document.addEventListener('touchmove', handleSliderInteraction);
            document.addEventListener('touchend', () => {
                document.removeEventListener('touchmove', handleSliderInteraction);
            });
        });
        
        // Input focus out
        input.addEventListener("focusout", e=>{
            console.log(e.target.value, e.target.validity);
            if (e.target.value && e.target.validity.valid) {
                // Hex string is valid
                const hsl = hexToHSL(e.target.value)
                hue = hsl[0]
                saturation = hsl[1]
                brightness = hsl[2]
                this._updateColor(hue, saturation, brightness)
            }
        })

        // Button click
        button.addEventListener('click', () => {
          const color = `hsl(${hue}, ${saturation}%, ${brightness}%)`;
          console.log('Selected Color:', color);
          indicator.style.background = color;
    
          // Dispatch a custom event
          this.dispatchEvent(new CustomEvent('color-selected', {
            detail: { color },
            bubbles: true,
            composed: true,
          }));
        });
      }
    
      _updateColor(hue, saturation, brightness) {        
        const colorPicker = this.shadowRoot.host;
        const swatch = this.shadowRoot.querySelector('.swatch');
        const thumb = this.shadowRoot.querySelector('.thumb');
        const indicator = this.shadowRoot.querySelector('.indicator');
        const input = this.shadowRoot.querySelector("input")

        swatch.style.background =  `linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1)),
                                    linear-gradient(to left, hsl(${hue}, 100%, 50%), rgba(255, 255, 255, 1))`;
        thumb.style.background = `hsl(${hue}, 100%, 50%)`
        const color = `hsl(${hue}, ${saturation}%, ${brightness}%)`;
        indicator.style.background = color;
        colorPicker.style.setProperty('--accent', color)
        colorPicker.style.setProperty('--accent-h', hue)
        colorPicker.style.setProperty('--accent-s', saturation)
        colorPicker.style.setProperty('--accent-l', brightness)

        const hexStr = hslToHex(hue, saturation, brightness)
        input.value = hexStr
      }
}

customElements.define('color-picker', ColorPicker);