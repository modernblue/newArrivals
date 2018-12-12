$(function(){

	// var csvList = "";

	function Newarrival(options) {
		this.num = options.num;
		this.value = options.value;
		this.termArr = [];
		this.todayObj = new Date();
		this.todayObj.setHours(this.todayObj.getHours() - 12);//先行販売の都合上12時間遅らせる(0時ではなく12時が基準になる)

		this.csvList = [];

		this.htmlTag = "";
		this.brandMenuTag = "";
		this.sexMenuTag = "";
		this.sexArr = [];
		this.brandArr = [];
		this.prefixArr = [];
		// this.host = "";
		this.cabinet_base_url = options.cabinet_base_url;

		this.base_url = "";
		this.shop = {};

	}

	Newarrival.prototype = {
		getShapedBrandName: function (brandName) {
			brandName = brandName.toLowerCase().replace(/\s/g,"").replace(/&/g,"").replace(/\./g,"");
			// console.log(brandName);
			if (brandName.indexOf("(") != -1) {
				return brandName.substring(0, brandName.indexOf("("));
			} else {
				return brandName;
			}

		},
		getSexCategory: function (sex) {
			// return brandName.toLowerCase().replace(/\s/g,"").replace(/&/g,"").replace(/\./g,"");
			if (sex.match(/^.*-N$/i)) {
				return "all unisex";
			} else if (sex.match(/^.*-M$/i)) {
				return "all men";
			} else if (sex.match(/^.*-L$/i)) {
				return "all women";
			} else if (sex.match(/^.*-K$/i)) {
				return "all kids";
			} else if (sex.match(/^.*-H$/i)) {
				return "all life";
			}

			return sex;
		},
		getReleaseDate: function (naisDate) {
			naisDate = String(naisDate);
			var year = naisDate.substr(0, 2);
			var month = naisDate.substr(2, 2);
			var day = naisDate.substr(4, 2);
			// return year + "." + month + "." + day + " ";
			return month + "月" + day + "日 ";
		},
		getHtmlTag: function (csvList, naisDate) {
			htmlTag = '<section class="main__article article">';
				htmlTag += '<h3 class="article__ttl">' + itemData.getReleaseDate(naisDate) + '入荷</h3>';
				htmlTag += '<ul class="article__items">';

				$.each(csvList, function(i) {
					// console.log(i);
					_self = this;
					if (_self[0] && _self[0] == 1) {
						htmlTag += '<li class="item' + ' ' + itemData.getShapedBrandName(_self[10]) + ' ' + itemData.getSexCategory(_self[3]) + '"><a href="' + itemData.getItemPageUrl(_self[6]) + '" target="_blank"><p class="item__image"><img src="' + itemData.getThumbPath(_self[11], 700, 700) + '" class="lazy"></p><p class="item__brand">' + _self[10] + '</p><p class="item__price">&yen; <span>' + itemData.getCompTax(_self[8]) + '</span></p></a></li>';
					}
				});

				htmlTag += '</ul>';
			htmlTag += '</section>';

			return htmlTag;
		},
		setSexArr: function (csvList) {
			$.each(csvList, function(i) {
				_self = this;
				if (_self[0] && _self[0] == 1) {
					// itemData.brandArr.push(itemData.getShapedBrandName(_self[10]));
					itemData.sexArr.push(_self[3]);
				}
			});
		},
		setBrandArr: function (csvList) {
			$.each(csvList, function(i) {
				_self = this;
				if (_self[0] && _self[0] == 1) {
					// itemData.brandArr.push(itemData.getShapedBrandName(_self[10]));
					itemData.brandArr.push(_self[10]);
				}
			});
		},
		getBrandMenuTag: function (brandArr) {
			// console.log(brandArr);
			uniqueBrandArr = brandArr.filter(function (x, i, self) {//重複を除く
				return self.indexOf(x) === i;
			});
			// console.log(uniqueBrandArr);

			uniqueBrandArr.sort(function (a, b) {//昇順に並び替える
				a = a.toString().toLowerCase();
				b = b.toString().toLowerCase();
				return (a > b) ?  1 : (b > a) ? -1 : 0;
			});
			// console.log(uniqueBrandArr);

			$.each(uniqueBrandArr, function(i, brand) {
				itemData.brandMenuTag += '<li class="item" data-narrow="' + itemData.getShapedBrandName(brand) + '"><a href="#main">' + brand + '</a></li>';
			});

			return itemData.brandMenuTag;
		},
		getSexMenuTag: function (sexArr) {
			// console.log(sexArr.slice(-2));

			$.each(sexArr, function(i, sex) {//ーM形式で性別を取得
				itemData.prefixArr.push(sex.slice(-2));
			});

			uniquePrefixArr = itemData.prefixArr.filter(function (x, i, self) {//重複を除く
				return self.indexOf(x) === i;
			});

			$.each(uniquePrefixArr, function(i, sex) {

				if (sex == "-N") {
					itemData.sexMenuTag += '<li class="item" data-narrow="unisex"><a href="#main">UNISEX</a></li>';
				} else if (sex == "-M") {
					itemData.sexMenuTag += '<li class="item" data-narrow="men"><a href="#main">MEN</a></li>';
				} else if (sex == "-L") {
					itemData.sexMenuTag += '<li class="item" data-narrow="women"><a href="#main">WOMEN</a></li>';
				} else if (sex == "-K") {
					itemData.sexMenuTag += '<li class="item" data-narrow="kids"><a href="#main">KIDS&amp;BABY</a></li>';
				} else if (sex == "-H") {
					itemData.sexMenuTag += '<li class="item" data-narrow="life"><a href="#main">LIFE STYLE</a></li>';
				}

			});
			// itemData.sexMenuTag += '<li class="item" data-brand="all"><a href="javascript:;">ALL</a></li>' + itemData.sexMenuTag;
			return '<li class="item" data-narrow="all"><a>ALL</a></li>' + itemData.sexMenuTag;

		},
		setBaseUrl: function (host) {
			if (host.indexOf("modern-blue.com") != -1) {
				itemData.base_url = "https://www.modern-blue.com/ec/pro/disp/1/";
				itemData.shop = "mb";
			} else if (host.indexOf("rakuten.ne.jp") != -1) {
				itemData.base_url = "https://item.rakuten.co.jp/mb/";
				itemData.shop = "rk";
			} else if (host.indexOf("shopping.geocities.jp") != -1) {
				itemData.base_url = "https://shopping.geocities.jp/mb-y/";
				itemData.shop = "yh";
			} else if (host.indexOf("localhost") != -1) {
				itemData.base_url = "https://www.modern-blue.com/ec/pro/disp/1/";
				itemData.shop.code = "mb";
			} else {
				itemData.base_url = "https://item.rakuten.co.jp/mb/";
				itemData.shop = "rk";
			}
		},
		getItemPageUrl: function (itemCode) {
			return itemData.base_url + itemCode;
		},
		getThumbPath: function (folderName, width, height) {
			return itemData.cabinet_base_url + folderName + "?_ex=" + width + "x" + height;
		},
		getCompTax: function(price) {
			if (price !== '') {
				return Math.floor(1 * (Number(price.replace(',', '')))).toLocaleString();
			} else {
				// console.log('argument is none.');
			}
		}
	}

	// インスタンスの作成
	var itemData = new Newarrival({
		num: 10,//ループする日数
		cabinet_base_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/mb/cabinet/",
		// csv_url: "../nais/"
		// csv_url: "https://www.rakuten.ne.jp/gold/mb/nais/"
	});
	// 店舗を判断してURLをセット
	itemData.setBaseUrl(location.hostname);

	//console.log(location);

	// yymmddの形式で日付を取得して配列termArrへ格納
	for (var i = 0; i < itemData.num; i++) {
		itemData.termArr.push(Number((itemData.todayObj.getFullYear() % 100) + ('0' + (itemData.todayObj.getMonth() + 1)).slice(-2) + ('0' + itemData.todayObj.getDate()).slice(-2)));

		itemData.todayObj.setDate(itemData.todayObj.getDate() -1);//配列をpushで格納後、日にちを減算
	}

	// 日付の配列を基にループでCSVファイルの存在をチェック
	$.each(itemData.termArr, function(i, value){

		result = $.ajax({
			// url: "../../nais/" + value + '.csv',//本番
			url: "../nais/" + value + '.csv',//ローカル
			cache: false,
			data: {},
			async: false
		})
		.done(function(data, textStatus, jqXHR){
			// console.log(data);
			// console.log(textStatus);
			// console.log(jqXHR.responseText);
		})
		.fail(function(e){
			// console.log(e);
		});

		// ファイルが存在すれば、内容をタグに変換しHTMLへ追加
		if (result.status == 200) {
			// console.log($.csv()(result.responseText));
			csvList = $.csv()(result.responseText);

			// アイテム一覧タグを取得
			itemData.htmlTag += itemData.getHtmlTag(csvList, value);
			// メニュー(ブランド)を取得
			// itemData.brandMenuArr += itemData.getBrandMenuArr(csvList);

			itemData.setSexArr(csvList);// メニュー作成用
			itemData.setBrandArr(csvList);// メニュー作成用

		}

	});

	// アイテム一覧タグを追加
	$(".main").html(itemData.htmlTag);

	$(".nav__sex").html(itemData.getSexMenuTag(itemData.sexArr));
	$(".nav__brand").html(itemData.getBrandMenuTag(itemData.brandArr));
});


/*======================================================
フィルタリング
======================================================*/
$(function() {
	$(".nav__items .item").click(function() {

		// $("body, html").animate({scrollTop: offset().top});//

		clicked = $(this).data("narrow");

		$('.article__items .item').hide();
		$('.' + clicked).fadeIn();

		$("section.main__article").each(function (i){
			// console.log($(".article__items .item", this));
			// console.log($(".article__items .item:visible", this).length);
			if ($(".article__items .item:visible", this).length == 0) {
				// $(this).parent("section").hide();
				$(".article__ttl", this).hide();
				$(this).css("height", 0);
				// console.log($(this));
			} else {
				$(".article__ttl", this).show();
				$(this).css("height", "inherit");
			}
		});

	});
});

/*======================================================
メニュー スライドtoggle
======================================================*/
$(function() {
	$(".nav .nav__ttl").click(function() {
		$(this).toggleClass("active");
		$(this).next("ul").slideToggle();

		// console.log("test!");
	});
});

/*======================================================
初期設定
======================================================*/
//セクションの高さの最小値
//var minHeight = 500;
//自動スクロールの速度（1000で1秒）
//var scrollSpeed = 1000;

$(function(){
    // $(".test").empty();
    // $(".test li").remove();
    // $(".test:empty").parent("section").remove();

    // $(".test").has(".item").each(function(){
    //     console.log($(this));
    // });

    if ($(".test").children("li").length) {
        // console.log($(".test"));
        // console.log("あります");
    } else {
        // console.log("ありません");
    }

    // console.log($(".test"));
});


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
ナビゲーションによるスクロール
======================================================*/
$(function() {
	// $('a').click(function() {
	$('a[href^="#"]').click(function() {

		var speed = 1000;
		var href= $(this).attr("href");//移動先を取得
		var target = $(href == "#" || href == "" ? "html" : href);
		var adjust = 0;//90

		var position = target.offset().top - adjust;//移動先を数値で取得、メニューの高さ分を差し引く
		$("body, html").animate({scrollTop:position}, speed, "swing");

		//return false;
	});
});

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
		effect_speed: 1200,
	});
});
