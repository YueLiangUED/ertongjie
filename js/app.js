FastClick.attach(document.body);
var imgPath = './images/';
var imgs = [
	'bg.png',
    'music-bg.png',
    'block-bg.png',
    'broken.png',
    'no.png',
    'index-bg.jpg',
    'start-bg.png',
    'start-txt.png',
    'broken.png',
    'btn-back.png',
    'btn-x.png',
    'btn.png',
    'btn2.png',
    'btn3.png',
    'icon-fail.png',
    'icon-right.png',
    'm.png',
    'option.png',
    'page-result-bg.jpg',
    'plane.png',
    'psp.png',
    'q-think.png',
    'q-think2.png',
    'q2-n-bg.png',
    'q2-s-bg.png',
    'q4-tip.png',
    'q4-tip2.png',
    'q5-think.png',
    'q6-bg.jpg',
    'question.jpg',
    'shot.png',
];
var imgsL = imgs.length;
var loaded = 0;
var st1;
// 为了避免用户等待时间过长 设置15秒后隐藏加载页
st1 = setTimeout(function(){
    begin();
},15000);
var loadingImg = function(imgSrc,cb){
    var img = new Image();
    img.src = imgSrc;
    img.onload = function(){
        cb();
    }
}
var loadingImgCallback = function(){
    loaded++;
    $('.progress').text(parseInt(loaded*100/imgsL)+'%');
    if(loaded==imgsL)
    {
        clearTimeout(st1);
        begin();
    }else{
        loadingImg(imgPath+imgs[loaded],loadingImgCallback);
    }
}
loadingImg(imgPath+imgs[0],loadingImgCallback);
function begin(){
    $('.page-loading').remove();
    $('.page-index').show();
}
var dialog = {
    show:function(content,title,btnTxt,cb)
    {
        var title   = title || '温馨提示';
        var content = content || '操作成功';
        var btnTxt  = btnTxt || '确定';
        var cb     = cb || '';
        if($('#dialog').length)
        {
            $('#dialog').show().find('.weui_dialog_bd').html(content).end().find('a').text(btnTxt).end().find('.weui_dialog_hd h3').text(title);
        }else{
            var dialog ='<div class="weui_dialog_alert" id="dialog">';
                dialog+=    '<div class="weui_mask"></div>';
                dialog+=     '<div class="weui_dialog">';
                dialog+=      '<a class="btn btn-shot" href="javascript:;">针</a><a class="btn btn-x" href="javascript:;">X</a>';
                dialog+=        '<div class="weui_dialog_body">';
                dialog+=         '<div class="weui_dialog_hd">';
                dialog+=           '<h3>'+title+'</h3>';
                dialog+=          '</div>';
                dialog+=         '<div class="weui_dialog_bd">'+content+'</div>';
                dialog+=         '<div class="weui_dialog_ft">';
                dialog+=               '<a href="javascript:;" class="weui_btn_dialog primary">'+btnTxt+'</a>';
                dialog+=         '</div>';
                dialog+=       '</div>';
                dialog+=     '</div>';
                dialog+='</div>';
            $('body').append(dialog);
        }
        if(typeof cb ==='function')
        {
            $('body').on('click','a.weui_btn_dialog.primary',function(){
                cb();
            })
        }
    },
    hide:function()
    {
        $('#dialog').hide();
    }
}
$('body').on('click','a.weui_btn_dialog.primary,a.btn-x',function(){
    dialog.hide();
})

var bgFlag = true;//用户是否主动停止背景音乐的播放 true为未主动停止
var rightAudio = document.getElementById('rightAudio');
var wrongAudio = document.getElementById('wrongAudio');
var init = {
	qn : 1, //当前题目序号,
	answered : false,//当前题目是否已答
	rightAnswer:[0,1,1,3,2,1,2,3], //正确答案
	score      :0,             //得分
	titles     :
                [
                    '70后骨灰级大龄儿童',
                    '70后骨灰级大龄儿童',
                    '80后大龄儿童',
                    '80后大龄儿童',
                    '90后逆天儿童',
                    '90后逆天儿童',
                    '00后青葱儿童',
                    '00后青葱儿童',
                    '10后正版儿童',
                ],
	answerd    : [] //用户所选选项集合
}
$('a.btn-start').click(function(event) {
	$('.page-index').hide();
	// 初始化页面
	$('.page-question').show();
	$('.question-wrapper .q').hide().eq(init.qn-1).show().find('.show-box').hide().end().find('.show-box.q-show-normal').show();
});
function questionEnd(){
	$('.page-question').hide();
	$('.page-result').show();
	if(init.score>=8) init.score =8;
	$('#title').text(init.titles[init.score]);
    $('#rightAnswerNumber').text(init.score);
}

// 点击下一题按钮
$('a.btn-next').click(function(event) {
	if(!init.answered){
		dialog.show('请选择您认为正确的选项');
		return false;
	}
	if(init.qn==8){
		questionEnd();
		return false;
	}
	init.qn++;
	init.answered = false;
	if(init.qn==8){
		$('a.btn-next').text('完成');
	}
	$('.question-wrapper .q').hide().eq(init.qn-1).show().find('.show-box').hide().end().find('.show-box.q-show-normal').show();
});
$('.q-options li').click(function(event) {
	if($(this).parent('ul').find('li.active').length) return false;
	$(this).addClass('active');
	var _index = $(this).index();
	$('.q'+init.qn).find('.show-box').hide();
	if(init.rightAnswer[init.qn-1]==_index){
		init.score++;
		rightAudio.currentTime = 0;
		rightAudio.play();
		$(this).addClass('success');
		$('.q'+init.qn).find('.q-show-success').show();
	}else{
		wrongAudio.currentTime = 0;
		wrongAudio.play();
		$(this).addClass('error');
		$('.q'+init.qn).find('.q-show-error').show();
	}
	init.answerd.push(_index+1);
	setTimeout(function(){
		if(bgFlag){
			document.getElementById('bgAudio').play();
			$('a.btn-music').addClass('animate');
		}
	},1000)
	createAnimate(init.qn);
	init.answered = true;
});
/**
 * [createAnimate 答题完成后生成动画]
 * @param  {[type]} qn [第几题]
 * @return {[type]}    [description]
 */
function createAnimate(qn){
	$(".q"+qn+" .ani").each(function(index, el) {
		var effect = $(this).attr('animate-effect');
		var duration = $(this).attr('animate-duration');
		var delay = $(this).attr('animate-delay');
		$(this).css({
			animationName: effect,
			animationDuration:duration,
			animationDelay : delay

		})
	});
}
// 背景音乐
function audioAutoPlay(id){  
    var audio = document.getElementById(id);  
    audio.play();  
    document.addEventListener("WeixinJSBridgeReady", function () {  
            audio.play();  
    }, false);  
    document.addEventListener('YixinJSBridgeReady', function() {  
        audio.play();  
    }, false);  
}  
audioAutoPlay('bgAudio');
$('a.btn-music').click(function(event) {
    var audio = document.getElementById('bgAudio');
    if(audio.paused){
    	bgFlag = true;
        audio.play();
        $(this).addClass('animate');
    }else{
    	bgFlag = false;
        audio.pause();
        $(this).removeClass('animate');
    }
});
// 点击领取补助按钮
$('body').on('click','a.btn-get-subsidy',function(){
    if(init.score<8){
        dialog.show("哎呦，这是专门给<span class='red'>正版儿童</span>准备的补助哦~<p>偷偷告诉你：<span class='red'>答对8题</span>才能获得正版儿童称号，快去努力吧！<br/>（以历史最高成绩为准）</p>",'','不服再来',function(){
            if(!app_config.isShare){
                dialog.show('炫耀儿童证，解锁无限畅玩模式哦~','','确定',function(){
                    $('.page-guide').fadeIn();
                    dialog.hide();
                });
                return false;
            }
            $('.page-result').hide();
            $('.ani').attr('style','');
            init.qn = 1;
            init.answerd = false;
            init.score = 0;
            init.answerd = [];
            $('li').removeClass('error success active');
            $('.page-index').show();
            $('.page-question').hide();
            $('.question-wrapper .q').hide().eq(init.qn-1).show().find('.show-box').hide().end().find('.show-box.q-show-normal').show();

        })
        return false;
    }
	$('.page-subsidy').show();
	$('.page-result').hide();
})
// 立即查看按钮
$('a.btn-show-club').click(function(event) {
	$('.page-club').show();
	$('.page-subsidy').hide();
});
var ajaxFlag = true;
// 点击补助按钮
$('a.btn-get-200M').click(function(event) {
	if($(this).hasClass('disabled')) return false;
	if(app_config.hasPrize){
		dialog.show('您已经领取了奖励，不要贪心哦！');
		return false;
	}
	var content = "<div class='gprs-body modal-body'>";
		content+= "<h3>恭喜您获得</h3>";
		content+= "<p><strong class='red'>200MB本地流量</strong></p>";
		content+= "<p>是否确认现在领取</p>";
	    content += "</div>";
	dialog.show(content,'','确定',function(){
		if(!ajaxFlag) return false;
		ajaxFlag = false;
		// $.ajax({
		// 	url: '获取流量接口',
		// 	type: 'GET',
		// 	dataType: 'json',
		// 	data: {},
		// })
		// .done(function(data) {
		// 	if(data.errcode==0){
		// 	    app_config.hasPrize  = true;
		// 		var step2 = "<div class='gprs-body modal-body'>";
		// 		step2+= "<h3>您的号码</h3>";
		// 		step2+= "<p><strong>"+app_config.mobileNo+"</strong></p>";
		// 		step2+= "<p>已成功领取200MB安心用本地流量</p>";
		// 		step2+= "<p>流量将在48小时内充入您的账户</p>";
		// 		step2+= "<p>有效期至次月月底</p>";
		// 	    step2+= "</div>";
		// 	    dialog.show(step2);
		// 	 }else{
		// 		dialog.show(data.errmsg);
		// 	 }
		// })
		// .fail(function() {
		// 	dialog.show('出错了,请重试');
		// })
		// .always(function() {
		// 	ajaxFlag = true;
		// });
		//下面代码上线时请删除
		app_config.hasPrize  = true;
		var step2 = "<div class='gprs-body modal-body'>";
		step2+= "<h3>您的号码</h3>";
		step2+= "<p><strong>"+app_config.mobileNo+"</strong></p>";
		step2+= "<p>已成功领取200MB安心用本地流量</p>";
		step2+= "<p>流量将在48小时内充入您的账户</p>";
		step2+= "<p>有效期至次月月底</p>";
	    step2+= "</div>";
	    dialog.show(step2);
	});
});
// 点击返回按钮
$('a.btn-back').click(function(event) {
	$('.page-club').hide();
	$('.page-subsidy').show();
});
// 规则
$('a.btn-rule').click(function(event) {
	$('.page-rule').show();
});
$('.page-rule').click(function(event) {
	$(this).hide();
});

$('.page-guide').click(function(event) {
    $(this).fadeOut();
});
// 再答一次
$('a.btn-again').click(function(event) {
    if(!app_config.isShare){
        dialog.show('炫耀儿童证，解锁无限畅玩模式哦~','','确定',function(){
            $('.page-guide').fadeIn();
        });
        return false;
    }
    $('.page-result').hide();
    $('.ani').attr('style','');
    init.qn = 1;
    init.answerd = false;
    init.score = 0;
    init.answerd = [];
    $('li').removeClass('error success active');
    $('.page-index').show();
    $('.page-question').hide();
    $('.question-wrapper .q').hide().eq(init.qn-1).show().find('.show-box').hide().end().find('.show-box.q-show-normal').show();
});
var rightStr = '';
var ops = ['A','B','C','D'];
// 查看答案 按钮
$('a.btn-show-answer').click(function(event) {
    if(rightStr){
        dialog.show(rightStr);
        return ;
    }
    rightStr+='<ul class="rightHtml">';
    $('.question-wrapper .q').each(function(index, el) {
        var qu = $(this).find('.q-title h3').text();
        var an = $(this).find('.q-options li').eq(init.rightAnswer[index]).find('span').text();
        rightStr+='<li>';
        rightStr+='<h3>'+(index+1)+'.'+qu+'</h3>';
        rightStr+= '<p>'+ops[init.rightAnswer[index]]+' '+an+'</p>';
        rightStr+='</li>';
    });
    rightStr+='</ul>';
    dialog.show(rightStr,'正确答案');
});
$('img.base64').each(function(index, el) {
    var base64Id = $(this).attr('imgBase64Id');
    $(this).attr('src',imgBase64[base64Id]);
});
