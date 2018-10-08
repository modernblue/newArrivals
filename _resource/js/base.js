/*======================================================
初期設定
======================================================*/
//セクションの高さの最小値
//var minHeight = 500;
//自動スクロールの速度（1000で1秒）
//var scrollSpeed = 1000;

/*======================================================
デバイスを取得
======================================================*/
var device = (function() {
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        return 'sp';
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        return 'tab';
    } else {
        return 'other';
    }
})();

/*======================================================
トップに戻るボタン
======================================================*/
var topBtn = $("#totop");

$(window).scroll(function(){
	if ($(this).scrollTop() > 200) {
		topBtn.fadeIn('fast');
	} else {
		topBtn.fadeOut('fast');
	}
});

/*======================================================
Lazy Loadの起動
======================================================*/
$(function() {
	$('img.lazy').lazyload({
		threshold: 100, // 100pxの距離まで近づいたら表示する
		effect: "fadeIn",
		effect_speed: 1000,
	});
});

/*======================================================
Color Box
======================================================*/
$(function() {
	if (device == "sp") {
		var width = "90%";
		var height = "90%";
		var maxWidth = "90%";
		var maxHeight = "90%";
        var scrolling = true;
        var fixed = true;
	} else {
		var width = 480;
		var height = 780;
		var maxWidth = 480;
		var maxHeight = 780;
        var scrolling = true;
        var fixed = false;
	}
	$(".inline").colorbox({
		height: height,
		width: width,
		maxHeight: maxHeight,
		maxWidth: maxWidth,
		// minHeight: 500,
		// height: 850,
		// maxWidth: 480,
		// width: "100%",
        scrolling: scrolling,
		fixed: fixed,
		className: "",
		inline: true,
		opacity: 0.5,
		transition: "none",
		returnFocus: false,
		onOpen: function(){
			// console.log(this);
			$(".qv__img .img__main").attr("src", this.dataset.img);
			$(".qv__info .info__btn a").attr("href", this.dataset.link);
			$(".qv__info .info__brand").empty().text(this.dataset.brand);
			$(".qv__info .info__item").empty().text(this.dataset.item);
			$(".qv__info .info__explain").empty().text(this.dataset.explain);


		},
		// onClosed: function(){
		// }
	});
});

/*======================================================
フィルタリング
======================================================*/
$(function() {
	$(".nav__items .item").click(function() {
		//console.log(this.className);

		var initial = this.children[0].className;

		//if (initial == "isK" || initial == "isL") {
        if (initial == "isL") {
			return false;
		}

		$(".nav__items .item").removeClass("active");
		$(this).addClass("active");


		$('.article__items .item').hide();
		if (initial == "isAll") {
			$('.article__items .item').fadeIn();
		} else {
			$('.article__items .item__sex--' + initial).fadeIn();
		}

	});
});
