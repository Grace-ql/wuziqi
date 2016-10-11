$(function() {
    var canvas=$('#canvas').get(0);
    var ctx=canvas.getContext('2d');///注意getContext中的C要大写
    var ROW=15;
    var width=canvas.width;
    var off=width/ROW;
    var flag=true;
    var blocks={};
    var ai=false;
    var blank={};
    $('.kaichang').on('click', function() {
        $('.kaichang .zuo').css({
            transform: 'translateX(-100%)'
        })
        $('.kaichang .you').css({
            transform: 'translateX(100%)'
        })
        $('.kaichang span').css({
            transform: 'translateY(-100%)'
        })
        $('.start .play,.exit').css('zIndex',100);
    })
    for (var i=0;i<ROW;i++){
        for(var j=0;j<ROW;j++){
            blank[p2k(i,j)]=true;
        }
    }
    // ctx.save();
    // ctx.fillText("3",300,300);//写文本
    // ctx.textAlign='center';
    // ctx.textBaseline="middle";
    // ctx.font="48px sans-serif";
    // ctx.restore();
    ////////////画棋子的小函数/////////////
    function v2k(position) {
        return position.x+"_"+position.y;
    }
    function p2k(x,y){
        return  x+"_"+y;
    }
    function k2o(key) {
        var arr=key.split('_');
        return {x:parseInt(arr[0]),y:parseInt(arr[1])}
    }
    function drawchess(position,color){
        ctx.save();
        //填充注意顺序
        /////////////////棋子的渐变///////////////////
        var r=ctx.createRadialGradient(-2,-2,3,0,0,15);
        r.addColorStop(0,'#ccc');
        r.addColorStop(0.9,'#000');
        r.addColorStop(1,'rgba(0,0,0,.8)');
        var f=ctx.createRadialGradient(-2,-2,3,0,0,15);
        f.addColorStop(0,'#fff');
        f.addColorStop(0.9,'#ccc');
        f.addColorStop(1,'rgba(255,255,255,.8)');
        // var img=new Image();
        // img.src="1.png";
        // img.onoad=function(){
        //     var r=ctx.createPattern(this,'repeat');
        //     ctx.fillStyle=r;
        //     ctx.fillRect(0,0,15,15);
        // }
        ///////////////绘制圆/////////////
        if(color==="#000"){
            ctx.fillStyle=r;
        }else{
            ctx.fillStyle=f;
        }
        ctx.beginPath();
        ctx.translate((position.x+0.5)*off+0.5,(position.y+0.5)*off+0.5);
        ctx.arc(0,0,15,0,2*Math.PI);
        ctx.fill()
        ctx.closePath();
        ctx.restore();
        blocks[v2k(position)]=color;
        delete blank[v2k(position)];
    }
    ////////////////制作5个小圆点///////////////
    function drawcircle(x,y){
        ctx.save();
        ctx.beginPath();
        ctx.arc(x*off , y*off, 3 , 0 ,2*Math.PI);
        ctx.fillStyle='#a55d31';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
     drawcircle(3.5,3.5);
     drawcircle(11.5,3.5);
     drawcircle(7.5,7.5);
     drawcircle(3.5,11.5);
     drawcircle(11.5,11.5);
    ////////////////////根据棋子的位置查询表////////////////////////
    function check(position,color){
        var rownum=1,
            colnum=1,
            leftnum=1,
            rightnum=1;
        var table={};
        var tx=position.x;
        var ty=position.y;
        for(var i in blocks){
        if(blocks[i]==color){
            table[i]=true;
        }
      }
        //////横排//////
        while(table[p2k(tx+1,ty)]){
            rownum++;
            tx++;
        }
        tx=position.x;ty=position.y;
        while(table[p2k(tx-1,ty)]){
            rownum++;
            tx--;
        }
        tx=position.x;ty=position.y;
        ////////////竖排//////
        while(table[p2k(tx,ty+1)]){
            colnum++;
            ty++;
        }
        tx=position.x;ty=position.y;
        while(table[p2k(tx,ty-1)]){
            colnum++;
            ty--;
        }
        tx=position.x;ty=position.y;
        ///////左斜//////
        while(table[p2k(tx-1,ty-1)]){
            leftnum++;
            tx--;
            ty--;
        }
        tx=position.x;ty=position.y;
        while(table[p2k(tx-1,ty+1)]){
            leftnum++;
            tx--;
            ty++;
        }
        tx=position.x;ty=position.y;
        ///////右斜//////
        while(table[p2k(tx+1,ty-1)]){
            rightnum++;
            tx++;
            ty--;
        }
        tx=position.x;ty=position.y;
        while(table[p2k(tx+1,ty+1)]){
            rightnum++;
            tx++;
            ty++;
        }
        // return rownum >=5 || colnum>=5 || leftnum>=5|| rightnum>=5;
        return Math.max(rownum,colnum,leftnum,rightnum);
    }
    //////////绘制行线、竖线/////////
    function draw(){
        ctx.beginPath();
        for(var i=0; i<ROW; i++){
            var sep=off/2;
            var startPoint={x:sep+0.5,y:sep+0.5+i*off}
            var endPoint={x:(ROW-0.5)*off+0.5,y:off/2 + 0.5 + i*off}
            ctx.moveTo(startPoint.x,startPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
        }
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        for(var i=0; i<ROW; i++){
            ctx.moveTo(off/2+0.5+ i*off, off/2 + 0.5);
            ctx.lineTo(off/2 + 0.5+ i*off,(ROW-0.5)* off + 0.5);
        }
        ctx.stroke();
        ctx.closePath();
    }
    draw();
    ////////////drawText////////////////////
    function drawText(position,text,color){
        ctx.save();
        ctx.font="15px 微软雅黑";
        if(color=="#000"){
            ctx.fillStyle="#fff";
        }else{
            ctx.fillStyle="#000";
        }
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText(text,(position.x+0.5)*off,(position.y+0.5)*off);
        ctx.restore();
    }
    ///////////////////review棋谱////////////////////
    function  review(){
        var i=1;
        for (var position in blocks){
            drawText(k2o(position),i,blocks[position]);
            i++;
        }
    }
    /////////////////重新开始游戏/////////////////
    function restart(){
        ctx.clearRect(0,0,width,width);
        blocks={};
        flag=true;
        $(canvas).off('click').on('click',handleclick);
        drawcircle(3.5,3.5);
        drawcircle(11.5,3.5);
        drawcircle(7.5,7.5);
        drawcircle(3.5,11.5);
        drawcircle(11.5,11.5);
        draw();
    }
    //////////////AI/////////////////////
    function AI(){
        var pos1;
        var pos2;
        var max1=-Infinity;
        var max2=-Infinity;
        for(var i in blank){
            //把自己当成黑棋为这个位置打分
            var score1=check(k2o(i),'#000');
            var score2=check(k2o(i),'#fff');
            if(score1>max1){
                pos1=k2o(i);
                max1=score1;
            }
            if(score2>max2){
                pos2=k2o(i);
                max2=score2;
            }

        }
        if(max2 >= max1){
            return pos2
        }else{
            return pos1;
        }
    }
    ///////////////////秒表针//////////////////
    var date=0;
    function baimiao() {
        var canvasbai=$('#bai').get(0);
        var ctxbai=canvasbai.getContext('2d');///注意getContext中的C要大写
        ctxbai.clearRect(0,0,80,80);
        ctxbai.save();
        ctxbai.beginPath();
        ctxbai.translate(40,40);
        date++;
        ctxbai.rotate(2*Math.PI *date/60);
        ctxbai.moveTo(0,14);
        ctxbai.lineTo(0,6);
        ctxbai.moveTo(6,0);
        ctxbai.arc(0,0,6,0,2*Math.PI)
        ctxbai.moveTo(0,-6);
        ctxbai.lineTo(0,-22);
        ctxbai.closePath();
        ctxbai.stroke();
        ctxbai.restore();
        if(date===60){
             clearInterval(t)
             alert('时间已到，请白棋走');
        }
    }
    function heimiao(){
        var canvashei=$('#hei').get(0);
        var ctxhei=canvashei.getContext('2d');
        ctxhei.clearRect(0,0,80,160);
        ctxhei.save();
        ctxhei.beginPath();
        ctxhei.translate(40,40);
        date++;
        ctxhei.rotate(2*Math.PI *date/60);
        ctxhei.moveTo(0,14);
        ctxhei.lineTo(0,6);
        ctxhei.moveTo(6,0);
        ctxhei.arc(0,0,6,0,2*Math.PI);
        ctxhei.moveTo(0,-6);
        ctxhei.lineTo(0,-22);
        ctxhei.closePath();
        ctxhei.stroke();
        ctxhei.restore();
         if(date===60){
             clearInterval(t)
             alert('时间已到，请白棋走');
           }
    }    
   function handleclick(e) {
       var position={x:Math.round((e.offsetX-off/2)/off),
           y:Math.round((e.offsetY-off/2)/off)};
       if(blocks[v2k(position)]){return};//注意括号
       if(ai){
           drawchess(position,"#000");
            clearInterval(t)
           b=setInterval(baimiao,1000);
           if(check(position,"#000")>=5){
               $('.alert-h').animate({
                   'opacity': 1
               }, 2000, function() {
                   setTimeout(function() {
                       $('.alert').animate({
                           'opacity': 0,zIndex:-100
                       },2000)
                   })
               });
               clearInterval(tt)
               if(confirm("是否生成棋谱")){
                   review();
               }
               $(canvas).off('click');
               return;
           }
           drawchess(AI(),"#fff");
           clearInterval(b);
           t=setInterval(heimiao,1000);//若不加t相当于重新启动了一个
           if(check(AI(),"#fff")>5){
               $('.alert-b').animate({
                   'opacity': 1
               }, 2000, function() {
                   setTimeout(function() {
                       $('.alert').animate({
                           'opacity': 0,zIndex:-100
                       },2000)
                   })
               });
               clearInterval(tt)
               if(confirm("是否生成棋谱")){
                   review();
               }
               $(canvas).off('click');
               return;
           }
           // flag=true;
           return;
       }
       if(flag){
           drawchess(position,"#000");
           clearInterval(t)
           b=setInterval(baimiao,1000);
           if(check(position,"#000")>=5){
               $('.alert-h').animate({
                   'opacity': 1
               }, 2000, function() {
                   setTimeout(function() {
                       $('.alert').animate({
                           'opacity': 0,zIndex:-100
                       },2000)
                   })
               });
               clearInterval(tt)
               if(confirm("是否生成棋谱")){
                   review();
               }
               $(canvas).off('click');
               return;
           }
       }else{
           drawchess(position,"#fff");
           clearInterval(b);
           t=setInterval(heimiao,1000);//若不加t相当于重新启动了一个
           if(check(position,"#fff")>=6){
               $('.alert-b').animate({
                   'opacity': 1
               },1000, function() {
                   setTimeout(function() {
                       $('.alert').animate({
                           'opacity': 0,zIndex:-100
                       },1000)
                   })
               });
               clearInterval(tt)
               if(confirm("是否生成棋谱")){
                   review();
               }
               $(canvas).off('click');
               return;
           }
       }
       flag=!flag;
   }
    /////////////点击事件   下棋子//////////////////////
    // $(canvas).on('click',handleclick);
    $(".reset").off('click');
    $(".reset").on('click',function () {
        $(this).toggleClass('active');
        restart();
    });
    $('.btn .btn-q').on('click',function(){
        restart();
        jishi();
        $('.alert-h').css('display','none')
        $('.alert-b').css('display','none')
    })
    $('.over-over').on('click',function(){
    	$(this).toggleClass('active');
        clearInterval(t)
        clearInterval(b)
    	clearInterval(tt)
    })
    // $(".reset").on('dblclick',restart);
    $('#ai').on('click',function () {
        $(this).toggleClass('active');
        ai=true;
        $('.alert').animate({
            'opacity': 1
        }, 1000, function() {
            setTimeout(function() {
                $('.alert').animate({
                    'opacity': 0,zIndex:-100
                },2000)
            })
        });
        // $(canvas).on('click',handleclick);
    })
    $('#ai').off('click',false);
    ///////////////////////////
    $('.play').on('click',function(){
        $('.start').addClass('animate');
        $('.big-box').addClass('hua');
        $('#canvas').addClass('zhuan')
        $('.kaichang').css('zIndex',-300)
    })
    $('.rule').on('click',function(){
        $(this).toggleClass('active');
        $('.dis-rule').addClass('left-hua');
    })
   $('.over').on('click',function(){
       $(this).toggleClass('active');
       $('.alert-renji').animate({
           'opacity': 1
       }, 1000, function() {
           setTimeout(function() {
               $('.alert-renji').animate({
                   'opacity': 0,zIndex:-100
               },2000)
           })
       });
       restart();
      t=setInterval(heimiao,1000); 
      jishi();
   })
    var hei = {};
    var bai = {};
    var flag= true;
    var isAi=true;
    var time = 0;
    var  min=0;
    var second=0;
    $(".jsq span").html("0:00");
    function jishi(){
        tt=setInterval(function(){
            time +=1;
            second=time%60;
            if(time%60 == 0){
                min = parseInt(min);
                min += 1;
                min = (min<10)?'0'+min:min;
            }
            second = (second<10)?'0'+second:second;
            $(".jsq span").html(min +':'+second);

        },1000);
    }
})
