
const dom1 = document.getElementById('demo1');
const dom2 = document.getElementById('demo2');
const dom3 = document.getElementById('demo3');
const dom4 = document.getElementById('demo4');
const dom5 = document.getElementById('demo5');

// create date
const dates = [];
const largeDates = [];
const now = new Date();
now.setDate(-20);
for (var i = 0; i < 200; i++) {
    const str = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
    i < 20 && dates.push(str);
    largeDates.push(str);
    now.setDate(now.getDate() + 1);
}


const t1 = new Timeplayer(dom1, {
    dates: dates,
});

const t2 = new Timeplayer(dom2, {
    dates: largeDates,
    pointSpace: 40,
});

const t3 = new Timeplayer(dom3, {
    dates: largeDates,
    theme: 'dark'
});

const t4 = new Timeplayer(dom4, {
    dates: largeDates,
    colors: {
        scaleStart: '#000',
        scaleEnd: 'red',
        scaleLine: 'blue',
        scaleTextStart: 'green',
        scaleTextEnd: 'orange',
        scalePointsSmall: 'black',
        scalePointsBig: 'pink',
        activePointStroke: 'black',
        activePointFill: 'rgba(100, 191, 255, 1.0)',
        activeTipsBackground: 'rgba(100, 191, 255, 0.8)',
        activeTipsText: 'white',
        hoverPointStroke: 'black',
        hoverPointFill: 'rgba(0, 0, 0, 0.0)',
        hoverTipsBackground: 'rgba(0, 0, 0, 0.8)',
        hoverTipsText: 'white',
        controlBtn: '#3dc347'
    }
});

const t5 = new Timeplayer(dom5, {
    dates: dates
});

const tips = document.getElementById('tips');
const bindBtn = document.getElementById('bindEnv');
const rmvBtn = document.getElementById('removeEnv');
const env = (index, value) => {
    tips.innerText = `你点击了第${index}个时间，值为${value}`
};

bindBtn.addEventListener('click', function () {
    t5.on('change', env);
    tips.innerText = `绑定成功，请选择日期`
})

rmvBtn.addEventListener('click', function () {
    t5.off('change', env);
    tips.innerText = `已解除事件绑定，选择日期之后该处不会更新`
})







