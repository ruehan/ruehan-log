export class TouchController {
    elem: any;
    walkTouch: any;
    boundingRect: any;
    width: any;
    height: any;
    x: any;
    y: any;
    cx: any;
    cy: any;
    bar: any;

    constructor() {
        this.elem = document.querySelector('.mobile-controller');
        this.bar = this.elem.querySelector('.mobile-controller-bar')
        console.log(this.bar)
        this.setPosition();

        this.elem.addEventListener('touchstart', event => {
            this.walkTouch = event.targetTouches[0];
        })
        this.elem.addEventListener('touchmove', event => {
            this.walkTouch = event.targetTouches[0];

        })
        this.elem.addEventListener('touchend', event => {
            this.walkTouch = null;
        })

    }

    setPosition(){
        this.boundingRect = this.elem.getBoundingClientRect();
        this.width = this.boundingRect.width;
        this.height = this.boundingRect.height;
        this.x = this.boundingRect.x;
        this.y = this.boundingRect.y;
        this.cx = this.x + this.width/2;
        this.cy = this.y + this.height/2;
    }

    setAngleOfBar(radian: any){
        this.bar.style.transform = `rotate(${radian * 180 / Math.PI + 90}deg)`
    }
}