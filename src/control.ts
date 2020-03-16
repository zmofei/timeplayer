const btnsSVG = {
    forward: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5762" width="16" height="16"><path d="M814.976 222.304c-10.432-5.504-23.168-4.832-32.96 1.824L576 364.288 576 250.592c0-11.872-6.56-22.72-17.024-28.288-10.432-5.504-23.168-4.832-32.96 1.824l-384 261.248C133.248 491.328 128 501.248 128 511.84s5.248 20.512 14.016 26.464l384 261.376c5.408 3.68 11.68 5.568 17.984 5.568 5.12 0 10.272-1.216 14.976-3.712C569.44 796 576 785.088 576 773.248l0-113.792 206.016 140.224c5.408 3.68 11.68 5.568 17.984 5.568 5.12 0 10.272-1.216 14.976-3.712C825.44 796 832 785.088 832 773.248L832 250.592C832 238.72 825.44 227.872 814.976 222.304z" p-id="5763"></path></svg>',
    next: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6081" width="16" height="16"><path d="M817.088 484.96l-512-323.744C295.232 154.976 282.752 154.592 272.576 160.224 262.336 165.856 256 176.608 256 188.256l0 647.328c0 11.648 6.336 22.4 16.576 28.032 4.8 2.656 10.112 3.968 15.424 3.968 5.952 0 11.904-1.664 17.088-4.928l512-323.616C826.368 533.184 832 522.976 832 512 832 501.024 826.368 490.816 817.088 484.96z" p-id="6082"></path></svg>',
    pause: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6307" width="16" height="16"><path d="M352 768c-17.664 0-32-14.304-32-32L320 288c0-17.664 14.336-32 32-32s32 14.336 32 32l0 448C384 753.696 369.664 768 352 768z" p-id="6308"></path><path d="M672 768c-17.696 0-32-14.304-32-32L640 288c0-17.664 14.304-32 32-32s32 14.336 32 32l0 448C704 753.696 689.696 768 672 768z" p-id="6309"></path></svg>'
}


class Control {
    dom: HTMLElement;
    speed: number;
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
    constructor() {
        this.speed = 1.0;

        this.initDom();

        this.draw();
    }

    private initDom() {
        const controlid = `control_${+new Date()}`
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        .${controlid} {
            height: 20px;
            line-height: 20px;
            font-size: 10px;
            text-align: center;
        }
        .${controlid} svg {
            vertical-align: middle;
            height: 16px;
            width: 16px;
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
        }
        .${controlid} .space{
            width: 1px;
            overflow: hidden;
            margin: 0 3px;
            background: #eee;
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
        .${controlid} .play {
            border: 1px solid #000;
            width: 14px;
            height: 14px;
            border-radius: 100px;
        }
        .${controlid} .play svg {
            width: 12px;
            height: 12px;
        }
        `
        document.head.appendChild(style);

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

    private draw() {
        const { control } = this;
        control.speed.innerText = this.speed.toFixed(1);
    }
}

export default Control;