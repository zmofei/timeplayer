const btnsSVG = {
    forward: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5762" width="16" height="16"><path d="M814.976 222.304c-10.432-5.504-23.168-4.832-32.96 1.824L576 364.288 576 250.592c0-11.872-6.56-22.72-17.024-28.288-10.432-5.504-23.168-4.832-32.96 1.824l-384 261.248C133.248 491.328 128 501.248 128 511.84s5.248 20.512 14.016 26.464l384 261.376c5.408 3.68 11.68 5.568 17.984 5.568 5.12 0 10.272-1.216 14.976-3.712C569.44 796 576 785.088 576 773.248l0-113.792 206.016 140.224c5.408 3.68 11.68 5.568 17.984 5.568 5.12 0 10.272-1.216 14.976-3.712C825.44 796 832 785.088 832 773.248L832 250.592C832 238.72 825.44 227.872 814.976 222.304z" p-id="5763"></path></svg>',
    next: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6081" width="16" height="16"><path d="M817.088 484.96l-512-323.744C295.232 154.976 282.752 154.592 272.576 160.224 262.336 165.856 256 176.608 256 188.256l0 647.328c0 11.648 6.336 22.4 16.576 28.032 4.8 2.656 10.112 3.968 15.424 3.968 5.952 0 11.904-1.664 17.088-4.928l512-323.616C826.368 533.184 832 522.976 832 512 832 501.024 826.368 490.816 817.088 484.96z" p-id="6082"></path></svg>',
    pause: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6307" width="16" height="16"><path d="M352 768c-17.664 0-32-14.304-32-32L320 288c0-17.664 14.336-32 32-32s32 14.336 32 32l0 448C384 753.696 369.664 768 352 768z" p-id="6308"></path><path d="M672 768c-17.696 0-32-14.304-32-32L640 288c0-17.664 14.304-32 32-32s32 14.336 32 32l0 448C704 753.696 689.696 768 672 768z" p-id="6309"></path></svg>'
}

const colors = {
    controlBtn: '#000'
}


class Control {
    dom: HTMLElement;
    speed: number;
    controlid: string;
    state: number; // 0: stop 1: play
    speedMax: number;
    speedMin: number;
    step: number;
    numberFix: number;
    value: number;
    valueMin: number;
    valueMax: number;
    allowLoop: boolean;
    interval: number;
    onChange: Function;
    colors: {
        [key: string]: string
    }
    private control: {
        forward: HTMLElement;
        backward: HTMLElement;
        previous: HTMLElement;
        play: HTMLElement;
        pause: HTMLElement;
        next: HTMLElement;
        up: HTMLElement;
        down: HTMLElement;
        speed: HTMLElement;
    }
    constructor(options: any) {
        const {
            speed = 1.0, speedMax = 10, speedMin = 0.1, value = 0, valueMax = 10, valueMin = 0, allowLoop = true, step = 0.1,
        } = options;
        this.colors = Object.assign(colors, options.colors || {});
        this.speed = speed;
        this.speedMax = speedMax;
        this.speedMin = speedMin;
        this.value = value;
        this.valueMax = valueMax;
        this.valueMin = valueMin;
        this.allowLoop = allowLoop;
        this.step = step;
        options.onChange && (this.onChange = options.onChange);

        this.speedMin = Math.max(this.speedMin, 0.1);

        this.state = 0;

        this.numberFix = this.step < 1 ? (this.step.toString().length - 2) : 0;
        this.controlid = `control_${+new Date()}`

        this.initDom();
        this.initEvent();
        this.draw();
    }

    private setCSS() {
        const { controlid } = this;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        .${controlid} {
            height: 20px;
            line-height: 20px;
            font-size: 10px;
            text-align: center;
        }
        .${controlid} span {
            cursor: pointer;
            border: 1px solid transparent;
            display: inline-block;
            vertical-align: middle;
            line-height: 18px;
            height: 18px;
            width: 18px;
            text-align: center;
            box-sizing: border-box;
            overflow: hidden;
        }
        .${controlid} span svg {
            float: left;
            height: 16px;
            width: 16px;
            fill: ${this.colors.controlBtn}
        }
        .${controlid} .space {
            width: 1px;
            overflow: hidden;
            margin: 0 3px;
            border-right: 1px solid #eee;
        }
        .${controlid} .play {
            border: 1px solid ${this.colors.controlBtn};
            width: 14px;
            height: 14px;
            border-radius: 100px;
        }
        .${controlid} .pause {
            border: 1px solid transparent;
            width: 16px;
            height: 16px;
            margin: 0 -1px;
        }
        .${controlid} .previous svg,
        .${controlid} .forward svg { 
            transform: rotate(180deg);
        }
        .${controlid} .up svg {
            transform: rotate(-90deg);
        }
        .${controlid} .down svg { 
            transform: rotate(90deg);
        }
        .${controlid} .play svg {
            width: 12px;
            height: 12px;
        }
        .${controlid} .speed {
            user-select: none;
            width: auto;
            color: ${this.colors.controlBtn}
        }
        
        `
        document.head.appendChild(style);
    }

    private initDom() {
        const controlid = this.controlid;

        this.setCSS();

        const btns = ['backward', 'previous', 'play', 'pause', 'next', 'forward', 'space', 'up', 'speed', 'down'];
        const btnSVGs = ['forward', 'next', 'next', 'pause', 'next', 'forward', '', 'next', '', 'next'];

        const controls: any = {};
        btns.forEach((item, index) => {
            const dom = document.createElement('span');
            dom.className = `${item}`;
            const key: string = btnSVGs[index];
            // @ts-ignore
            dom.innerHTML = btnsSVG[key] || '';
            controls[item] = dom;
        });


        const control = document.createElement('div');
        control.className = `${controlid}`;

        this.control = controls;

        for (let [key, dom] of Object.entries(this.control)) {
            control.appendChild(dom);
        }

        this.dom = control;
    }

    private initEvent() {
        const { control, speedMax, speedMin, step } = this;
        control.up.addEventListener('click', () => {
            this.speed += step;
            this.speed = Math.min(speedMax, this.speed);
            this.state = 0;
            this.draw();
        });

        control.down.addEventListener('click', () => {
            this.speed -= step;
            this.speed = Math.max(speedMin, this.speed);
            this.state = 0;
            this.draw();
        });

        control.next.addEventListener('click', () => {
            this.value += 1;
            this.value = Math.min(this.value, this.valueMax);
            this.state = 0;
            this.draw(true);
        });

        control.previous.addEventListener('click', () => {
            this.value -= 1;
            this.state = 0;
            this.value = Math.max(this.value, this.valueMin);
            this.draw(true);
        });


        control.backward.addEventListener('click', () => {
            this.value = this.valueMin;
            this.state = 0;
            this.draw(true);
        });

        control.forward.addEventListener('click', () => {
            this.value = this.valueMax;
            this.state = 0;
            this.draw(true);
        });


        control.play.addEventListener('click', () => {
            this.state = 1;
            window.clearInterval(this.interval);
            this.interval = window.setInterval(() => {
                this.value += 1;
                if (this.value > this.valueMax) {
                    if (this.allowLoop) {
                        this.value = this.valueMin;
                    } else {
                        this.state = 0;
                        window.clearInterval(this.interval);
                    }
                }
                this.draw(true);
            }, this.speed * 1000);
        });

        control.pause.addEventListener('click', () => {
            this.state = 0;
            window.clearInterval(this.interval);
            this.draw();
        });
    }


    private draw(isUpdate = false) {

        const { control, state, numberFix, value, valueMin, valueMax, speed, speedMin, speedMax } = this;
        control.speed.innerText = speed.toFixed(numberFix);

        if (state === 0) {
            control.pause.style.display = 'none';
            control.play.style.display = 'inline-block';
            window.clearInterval(this.interval);
        } else {
            control.pause.style.display = 'inline-block';
            control.play.style.display = 'none';
        }

        // value check
        control.backward.style.opacity = '1';
        control.previous.style.opacity = '1';
        control.forward.style.opacity = '1';
        control.next.style.opacity = '1';
        control.down.style.opacity = '1';
        control.up.style.opacity = '1';

        if (value <= valueMin) {
            control.backward.style.opacity = '0.5';
            control.previous.style.opacity = '0.5';
        } else if (value >= valueMax) {
            control.forward.style.opacity = '0.5';
            control.next.style.opacity = '0.5';
        }
        // speed check
        if (speed <= speedMin) {
            control.down.style.opacity = '0.5';
        } else if (speed >= speedMax) {
            control.up.style.opacity = '0.5';
        }

        if (isUpdate) {
            this.onChange(this.value);
        }
    }
}

export default Control;