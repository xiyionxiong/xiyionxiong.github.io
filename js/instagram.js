var Instagram = (function () {

	var _collection = [];

	var preLoad = function (data) {
		for (var em in data) {
			for (var i = 0, len = data[em].srclist.length; i < len; i++) {
				var src = data[em].bigSrclist[i];
				var img = new Image();
				img.src = src;
			}
		}
	}

	// data[em].bigSrclist[i]
	var render = function (data) {
		for (var em in data) {
			var liTmpl = "";
			for (var i = 0, len = data[em].srclist.length; i < len; i++) {
				liTmpl += '<li>\
								<div class="img-box">\
									<a class="img-bg" target="_blank" rel="example_group" href="' + data[em].linkList[i] + '" title="' + data[em].text[i] + '"></a>\
									<img src="' + data[em].srclist[i] + '" alt="">\
								</div>\
							</li>';
			}
			$('<section class="archives album"><h1 class="year">' + data[em].year + '年<em>' + data[em].month + '月</em></h1>\
				<ul class="img-box-ul">' + liTmpl + '</ul>\
				</section>').appendTo($(".instagram"));
		}

		// $(".instagram").lazyload();
		changeSize();

		setTimeout(function () {
			preLoad(data);
		}, 3000);

		// $("a[rel=example_group]").fancybox();
	}

	//这是一个 将图片转到墙内的方法
	var replacer = function (str) {
		if (str.indexOf("outbound-distilleryimage") >= 0) {
			var cdnNum = str.match(/outbound-distilleryimage([\s\S]*?)\//)[1];
			var arr = str.split("/");
			return "http://distilleryimage" + cdnNum + ".ak.instagram.com/" + arr[arr.length - 1];
		} else {
			var url = "http://photos-g.ak.instagram.com/hphotos-ak-xpf1/";
			var arr = str.split("/");
			return url + arr[arr.length - 1];
		}
	}

	var ctrler = function (data) {
		var imgObj = {};
		for (var i = 0, len = data.length; i < len; i++) {
			var d = new Date(data[i].created_time * 1000);
			var y = d.getFullYear();
			var m = d.getMonth() + 1;
			// var src = replacer(data[i].images.low_resolution.url);
			var src = data[i].images.low_resolution.url;
			let link = data[i].link;
			// var bigSrc = replacer(data[i].images.standard_resolution.url);
			var bigSrc = data[i].images.standard_resolution.url;
			var text = data[i].caption ? data[i].caption.text : '';
			var key = y + "-" + m;
			if (imgObj[key]) {
				imgObj[key].srclist.push(src);
				imgObj[key].bigSrclist.push(bigSrc);
				imgObj[key].text.push(text);
				imgObj[key].linkList.push(link);
			} else {
				imgObj[key] = {
					year: y,
					month: m,
					srclist: [bigSrc],
					bigSrclist: [bigSrc],
					linkList: [link],
					text: [text]
					// link: link
				}
			}
			// console.info("link:====>", link);
		}


		render(imgObj);

	}

	var getList = function (url) {
		$(".open-ins").html("图片来自instagram，正在加载中…");
		$.ajax({
			url: url,
			type: "GET",
			dataType: "jsonp",
			success: function (re) {
				if (re.meta.code == 200) {
					_collection = _collection.concat(re.data);
					var next = re.pagination.next_url;
					if (next) {
						getList(next);
					} else {
						$(".open-ins").html("图片来自instagram，点此访问");
						ctrler(_collection);
					}
				} else {
					alert("access_token timeout!");
				}
			}
		});
	}


	//不需要改变大小
	var changeSize = function () {
		if ($(document).width() <= 600) {
			$(".img-box").css({
				"width": "auto",
				"height": "auto"
			});
		} else {
			var width = $(".img-box-ul").width();
			var size = Math.max(width * 0.26, 157);
			$(".img-box").width(size).height(size);
		}
	}

	var bind = function () {
		$(window).resize(function () {
			changeSize();
		});
	}

	return {
		init: function () {
			var insid = $(".instagram").attr("data-client-id");
			var userId = $(".instagram").attr("data-user-id");
			if (!insid) {
				alert("Didn't set your instagram client_id.\nPlease see the info on the console of your brower.");
				console.log("Please open 'http://instagram.com/developer/clients/manage/' to get your client-id.");
				return;
			}
			getList("https://api.instagram.com/v1/users/2723120904/media/recent/?access_token=2723120904.f686a42.cd584bf27854444db0c658e4dcfc7375&count=100");
			// getList("https://api.instagram.com/v1/users/2723120904/media/recent/?access_token=2723120904.f686a42.cd584bf27854444db0c658e4dcfc7375&count=100");
			// getList("https://api.instagram.com/v1/users/" + userId + "/media/recent/?client_id="+insid+"&count=100");
			bind();
		}
	}
})();
$(function () {
	Instagram.init();
})


// getList("https://api.instagram.com/v1/users/2723120904/media/recent/?access_token=2723120904.f25912c.e5787853ef834a5c924aca0d6658e45d&count=100");


//  	 getList("https://api.instagram.com/v1/users/2723120904/media/recent/?client_id=f686a421cbfb41bcb96aa2507e09671d&count=100");

// access_token=2723120904.f686a42.cd584bf27854444db0c658e4dcfc7375
//	getList("https://api.instagram.com/v1/users/2723120904/media/recent/?access_token=2723120904.f25912c.e5787853ef834a5c924aca0d6658e45d&count=100");