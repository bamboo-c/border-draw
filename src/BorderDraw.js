const BORDER_POINT = 40;

const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

class BorderDraw  {

  constructor(i_now) {
    this.now = i_now;

    this.canvasEl    = 'loadBorder';
    this.elClass     = '.js-draw-border';
    this.borderColor = 'rgba(199, 199, 199, 1)';
    this.velocity    = 15;

    this.isDone1 = false;
    this.isDone2 = false;
    this.isDone3 = false;
    this.isDone4 = false;

    this.init();
  }

  init() {
    this.canvas = document.getElementById(this.canvasEl);
    this.canvas.width = $(window).width();
    this.canvas.height = $(window).height();

    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = this.borderColor;
    this.borderLength = $(this.elClass).length;

    this.getPoint();
  }

  getPoint() {
    this.obj = $(this.elClass)[this.now];
    this.rectObject = this.obj.getBoundingClientRect();

    this.x = this.rectObject.left; // x軸 始点
    this.y = this.rectObject.top; // y軸 始点
    this.x2 = this.x + this.rectObject.width;
    this.y2 = this.y + this.rectObject.height;

    this.midX = this.rectObject.left; // x軸 線の補完
    this.midY = this.rectObject.top; // y軸 線の補完
    this.midX2 = this.rectObject.left;
    this.midY2 = this.rectObject.top;

    this.endLineX = this.x2 + (BORDER_POINT * 2); // x軸 終点
    this.endLineY = this.y2 + (BORDER_POINT * 2); // y軸 終点

    this.draw();
  }

  draw() {
    // line 1
    this.border1();

    if ( this.isDone1 === false || this.isDone2 === false ||  this.isDone3 === false || this.isDone4 === false) {
      requestAnimationFrame($.proxy( this.draw, this ));
    }
  }

  border1() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x - .5, this.y - BORDER_POINT);
    this.ctx.lineTo(this.x - .5, this.midY - BORDER_POINT);
    this.ctx.stroke();

    if(this.endLineY - this.midY < this.velocity && (this.endLineY - this.midY) / this.velocity < 1) {
      this.midY = this.endLineY;
      this.isDone1 = true;
    } else {
      this.midY = this.midY + this.velocity;
    }

    if((this.endLineY - this.y) - (this.endLineY - this.midY) > (this.endLineY - this.y) * 0.6) {
      this.border2();
    }
  }

  border2() {
    if(this.endLineX - this.midX < this.velocity && (this.endLineX - this.midX) / this.velocity < 1) {
      this.midX = this.endLineX;
      this.isDone2 = true;
    } else {
      this.midX = this.midX + this.velocity;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.x - BORDER_POINT - .5, this.y - .5);
    this.ctx.lineTo(this.midX - BORDER_POINT - .5, this.y - .5);
    this.ctx.stroke();

    if((this.endLineX - this.x) - (this.endLineX - this.midX) > (this.endLineX - this.x) * 0.2) {
      this.border3();
    }
  }

  border3() {
    if(this.endLineY - this.midY2 < this.velocity && (this.endLineY - this.midY2) / this.velocity < 1) {
      this.midY2 = this.endLineY;
      this.isDone3 = true;
    } else {
      this.midY2 = this.midY2 + this.velocity;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.x2 - .5, this.y - BORDER_POINT);
    this.ctx.lineTo(this.x2 - .5, this.midY2 - BORDER_POINT);
    this.ctx.stroke();

    if((this.endLineY - this.y) - (this.endLineY - this.midY2) > (this.endLineY - this.y) * 0.2) {
      this.border4();
    }
  }

  border4() {
    if(this.endLineX - this.midX2 < this.velocity && (this.endLineX - this.midX2) / this.velocity < 1) {
      this.midX2 = this.endLineX;
      this.isDone4 = true;
    } else {
      this.midX2 = this.midX2 + this.velocity;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.x - BORDER_POINT - .5, this.y2 - .5);
    this.ctx.lineTo(this.midX2 - BORDER_POINT - .5, this.y2 - .5);
    this.ctx.stroke();

    if(this.now === this.borderLength - 1) {
      $(".content").addClass("is-active");
      $("#loadBorder").addClass("is-hide");
    }
  }
};

$(window).on("load", function(){
  if (!window.HTMLCanvasElement) return;

  let i = 0;
  const timer = setInterval(function() {

    new BorderDraw(i);

    i++;

    if(i === this.borderLength){
      clearInterval(timer);
    }
  }, 30);
});
