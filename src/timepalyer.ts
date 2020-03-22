import Control from './control';

interface TimeplyerOptions {
    width?: number,
    height?: number,
    theme?: 'dark',
    colors: { [key: string]: string },
    dates: string[],
}

enum Events {
    change = 'change'
}

const Config = {
    minHeight: 40,
    minWidth: 100,
    padding: 8,
    pointSpace: 10,
    defaultColors: {
        scaleStart: '#000',
        scaleEnd: '#000',
        scaleLine: '#000',
        scaleTextStart: '#333',
        scaleTextEnd: '#333',
        scalePointsSmall: '#0063a9',
        scalePointsBig: '#0190f5',
        activePointStroke: 'black',
        activePointFill: 'rgba(100, 191, 255, 1.0)',
        activeTipsBackground: 'rgba(100, 191, 255, 0.8)',
        activeTipsText: 'white',
        hoverPointStroke: 'black',
        hoverPointFill: 'white',
        hoverTipsBackground: 'rgba(0, 0, 0, 0.8)',
        hoverTipsText: 'white',
        controlBtn: '#000',
    },
    darkColors: {
        scaleStart: '#bbb',
        scaleEnd: '#bbb',
        scaleLine: '#bbb',
        scaleTextStart: '#ccc',
        scaleTextEnd: '#ccc',
        scalePointsSmall: '#fff',
        scalePointsBig: '#fff',
        activePointStroke: '#fff',
        activePointFill: 'rgba(100, 191, 255, 1.0)',
        activeTipsBackground: 'rgba(100, 191, 255, 0.8)',
        activeTipsText: 'white',
        hoverPointStroke: '#fff',
        hoverPointFill: '#eee',
        hoverTipsBackground: '#666',
        hoverTipsText: 'white',
        controlBtn: '#fff',
    },
}

class Timeplyer {
    private dom: HTMLElement; // the main dom where we put the component
    private height: number; // the height of the dom
    private width: number; // the width of the dom
    private canvas: HTMLCanvasElement;  // the main canvas element
    private ctx: CanvasRenderingContext2D; // the context of the canvas
    private dates: string[]; // the dates we want to show
    private _activeIndex: number; // the indexof active data ;
    private hoverIndex: number | null; // the index
    private Config: { [key: string]: any };
    private colors: {
        scaleStart: string;
        scaleEnd: string;
        scaleLine: string;
        scaleTextStart: string;
        scaleTextEnd: string;
        scalePointsSmall: string;
        scalePointsBig: string;
        activePointStroke: string;
        activePointFill: string;
        activeTipsBackground: string;
        activeTipsText: string;
        hoverPointStroke: string;
        hoverPointFill: string;
        hoverTipsBackground: string;
        hoverTipsText: string;
        controlBtn: string;
    };
    private padding: number; // the padding of the right and left side
    private events: {
        [key in Events]?: Function[];
    }
    private control: Control;

    constructor(dom: HTMLElement, options: TimeplyerOptions) {
        this.dom = dom;
        this.dates = options.dates;
        this.Config = Object.assign({}, Config, options);
        this._activeIndex = this.dates.length - 1;
        const domStyle = getComputedStyle(this.dom);
        this.padding = this.Config.padding;
        this.height = options.height || Math.max(parseFloat(domStyle.height), this.Config.minHeight);
        this.width = options.width || Math.max(parseFloat(domStyle.width), this.Config.minWidth) - this.padding * 2;
        // them
        if (options.colors) {
            this.colors = Object.assign({}, this.Config.defaultColors, options.colors);
        } else {
            this.colors = options.theme === 'dark' ? this.Config.darkColors : this.Config.defaultColors;
        }

        // set upcontrol
        this.setupControl();

        // create canvas
        this.setupCanvas();
        this.setupEvens();

        // draw everything
        this.draw();
    }

    private setupControl() {
        const { controlBtn } = this.colors;
        this.control = new Control({
            valueMax: this.dates.length - 1,
            value: this._activeIndex,
            colors: { controlBtn },
            onChange: (value: number) => {
                this.activeIndex = value;
                this.draw();
            },
        });
        this.dom.appendChild(this.control.dom);
    }

    private setupCanvas() {
        const { padding, height, dom } = this;
        const width = this.width + padding * 2;

        // create canvas
        const canvas = this.canvas = document.createElement('canvas');
        const ctx = this.ctx = canvas.getContext('2d');
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        dom.appendChild(canvas);

        // scale canvas
        var dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }

    private setupEvens() {
        const { canvas, padding, width, dates } = this;

        this.events = {};

        canvas.onmousemove = (e: MouseEvent) => {
            const offset = e.offsetX - padding;
            const precent = offset / width;
            let index = Math.round(precent * (dates.length - 1));
            index = Math.max(0, index);
            index = Math.min(dates.length - 1, index);
            this.hoverIndex = index;
            this.draw();
        };

        canvas.onmouseleave = () => {
            this.hoverIndex = null;
            this.draw();
        };

        canvas.onclick = (e: MouseEvent) => {
            const offset = e.offsetX - padding;
            const precent = offset / width;
            let index = Math.round(precent * (dates.length - 1));
            index = Math.max(0, index);
            index = Math.min(dates.length, index);
            this.activeIndex = index;

            this.control.setActive(index);

            this.draw();
        };
    }

    private draw() {
        const { ctx } = this;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.drawScale();
        this.drawHover();
        this.drawActive();

    }

    private drawScale() {
        const { ctx, padding, width, height, dates, colors, Config } = this;
        const step = width / (dates.length - 1);

        // draw left and right end line
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(padding, 0);
        ctx.lineTo(padding, height);
        ctx.strokeStyle = colors.scaleStart;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width + padding, 0);
        ctx.lineTo(width + padding, height);
        ctx.strokeStyle = colors.scaleEnd;
        ctx.stroke();

        // draw horizontal line
        ctx.beginPath();
        ctx.moveTo(padding, height / 2);
        ctx.lineTo(width + padding, height / 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = colors.scaleLine;
        ctx.stroke();

        // draw start and end text
        ctx.textBaseline = 'top';
        ctx.font = "10px Orbitron";
        ctx.textAlign = 'left';
        ctx.fillStyle = colors.scaleTextStart;
        ctx.fillText(dates[0], padding + 4, 0);

        ctx.textAlign = 'right';
        ctx.fillStyle = colors.scaleTextEnd;
        ctx.fillText(dates[dates.length - 1], width + padding - 4, 0);

        // draw scale points
        ctx.beginPath();
        let stepWidth = 0;
        const bigPoints = [];
        for (let i = 1; i * step < width; i++) {
            stepWidth += step;
            let fillcolor;
            let pointWidth;
            if (stepWidth >= Config.pointSpace) {
                stepWidth = 0;
                pointWidth = 4;
                bigPoints.push({
                    leftX: i * step - pointWidth / 2 + padding,
                    leftY: height / 2 - pointWidth / 2,
                });
            } else {
                pointWidth = 1.5;
                fillcolor = colors.scalePointsSmall;
                const leftX = i * step - pointWidth / 2 + padding;
                const leftY = height / 2 - pointWidth / 2;
                ctx.fillStyle = fillcolor;
                ctx.fillRect(leftX, leftY, pointWidth, pointWidth);
            }
        }

        bigPoints.forEach(({ leftX, leftY }) => {
            ctx.fillStyle = colors.scalePointsBig;
            ctx.fillRect(leftX, leftY, 4, 4);
        })
    }

    private drawHover() {
        const { width, height, ctx, dates, padding, hoverIndex, colors } = this;
        if (hoverIndex !== null) {
            const step = width / (dates.length - 1);
            ctx.beginPath();
            ctx.arc(step * hoverIndex + padding, height / 2, 4, 0, Math.PI * 2);
            ctx.lineWidth = 1;
            ctx.fillStyle = colors.hoverPointFill;
            ctx.strokeStyle = colors.hoverPointStroke;
            ctx.stroke();
            ctx.fill()

            ctx.textBaseline = 'top';

            const textInfo = ctx.measureText(dates[hoverIndex]);

            let bgLeft;
            let textX;
            const bgOffset = 5;
            const textOffset = 5;
            if (hoverIndex > dates.length / 2) {
                ctx.textAlign = 'right';
                bgLeft = step * hoverIndex + padding - textInfo.width - textOffset * 2 - bgOffset;
                textX = step * hoverIndex + padding - textOffset - bgOffset;
            } else {
                ctx.textAlign = 'left';
                bgLeft = step * hoverIndex + padding + bgOffset;
                textX = bgLeft + textOffset;
            }

            ctx.fillStyle = colors.hoverTipsBackground;
            ctx.fillRect(bgLeft, 0, textInfo.width + 10, 14);

            ctx.fillStyle = colors.hoverTipsText;
            ctx.fillText(dates[hoverIndex], textX, 2);
        }
    }

    private drawActive() {
        const { width, dates, ctx, _activeIndex, height, colors, padding } = this;
        const step = width / (dates.length - 1);

        ctx.beginPath();
        ctx.arc(step * _activeIndex + padding, height / 2, 4, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = colors.activePointStroke;
        ctx.fillStyle = colors.activePointFill;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        //

        ctx.font = "12px Orbitron";
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'center';
        const textInfo = ctx.measureText(dates[_activeIndex]);

        let bgLeft;
        let textX;
        let textPadding = 5;
        let bgOffset = 5;
        const rectWidth = textInfo.width + textPadding * 2;

        if (_activeIndex > dates.length / 2) {
            ctx.textAlign = 'right';
            bgLeft = step * _activeIndex + padding - rectWidth - bgOffset;
            textX = step * _activeIndex + padding - bgOffset - textPadding;
        } else {
            ctx.textAlign = 'left';
            bgLeft = step * _activeIndex + padding + bgOffset;
            textX = bgLeft + textPadding;
        }
        ctx.fillStyle = colors.activeTipsBackground;
        ctx.fillRect(bgLeft, height - 14, rectWidth, 14);
        //
        ctx.fillStyle = colors.activeTipsText;
        ctx.fillText(dates[_activeIndex], textX, height);
    }

    on(type: Events, fn: Function) {
        console.log(this.events)
        this.events[type] = this.events[type] || [];
        this.events[type].push(fn);
    }

    off(type: Events, fn: Function) {
        const index = this.events[type].indexOf(fn);
        if (index !== -1) {
            this.events[type].splice(index, 1);
        }
    }

    set activeIndex(index: number) {
        this._activeIndex = index;
        (this.events['change'] || []).forEach(fn => {
            fn(index, this.dates[index]);
        });
    }

    get activeIndex(): number {
        return this._activeIndex;
    }

}


export default Timeplyer;