/*
AUTHOR: 7Color
*/

var color = {};
color.tools = {};
//加载js
color.tools.loadJsFile = function(src) {
    var head_script = document.createElement("script");
    head_script.setAttribute("type", "text/javascript");
    head_script.setAttribute("src", src);
    head_script.setAttribute("defer", "defer");
    document.getElementsByTagName("head")[0].appendChild(head_script)
};
//加载css
color.tools.loadCssFile = function(href) {
    var head_link = document.createElement("link");
    head_link.setAttribute("rel", "stylesheet");
    head_link.setAttribute("type", "text/css");
    head_link.setAttribute("href", href);
    document.getElementsByTagName("head")[0].appendChild(head_link)
};
//浮动状态
color.tools.fixable = function(elem, options) {
    var elem_obj = $(elem);
    if (elem_obj) {
        if ($.browser.msie && $.browser.version < 7 && $.support.style) {
            elem_obj.css("position", "absolute");
            var offset_height = (options.top || $(window).height());
            elem_obj[0].style.setExpression("top", "eval((document.documentElement||document.body).scrollTop+" + offset_height + ") + 'px'")
        } else {
			elem_obj.css("position", "fixed");
        }
        elem_obj.css(options)
    }
};

color.timer = {};
color.sidecatalog = {};
color.sidecatalog.step = 20;
color.sidecontentList = [];
color.sidesubitemList = [];
color.sidecatalog.vHeight = 80;
color.sidecatalog.togglestatus = false;
//检查sidecatalog是否显示
color.sidecatalog.checkToShow = function() {
    var scrollTop = $(window).scrollTop();
    var clientHeight = $(window).height();
    var min_height = Math.min(clientHeight * 2, 200);
    if (scrollTop < min_height) {
        return false
    } else {
        return true
    }
};
//内容scroll
color.sidecatalog.contentScroll = function(step_length) {
    var side_title_list = $("#side-title-list");
    var steps = step_length * color.sidecatalog.step;
    var vHeight = color.sidecatalog.vHeight;
    var totalHeight = color.sidecatalog.getTotalHeight() - 40;
    if (vHeight <= 0) {
        return
    }

    var top = parseInt(side_title_list.position().top) || 0;
    var height = top + steps;
    var status = "normal";
    if (height >= 0) {
        height = 0;
        status = "top"
    }
    if (height + totalHeight <= vHeight) {
        height = Math.min( - totalHeight + vHeight, 0);
        status = (status == "top") ? "both": "bottom"
    }

    color.sidecatalog.statuschange(status);
    height = height - height % color.sidecatalog.step;
	
	side_title_list.animate({ 
		top: height
  	}, 
  	300, "linear");
};
//初始化
color.sidecatalog.init = function() {
    if ($(".toc").size == 0) {
        $("#sidebar").css("visibility", "hidden");
    } else {
        color.sidecatalog.contentbuild();
        $("#side-catalog-up").mousedown(
        function() {
            clearInterval(color.timer.ele_side_catalog_scroll);
            color.timer.ele_side_catalog_scroll = setInterval(function() {
                color.sidecatalog.contentScroll(3)
            },
            300)
        });
		$("#side-catalog-up").mouseup(
        function() {
            clearInterval(color.timer.ele_side_catalog_scroll)
        });
		$("#side-catalog-up").click(
        function() {
            clearInterval(color.timer.ele_side_catalog_scroll);
            color.sidecatalog.contentScroll(3)
        });
		$("#side-catalog-down").mousedown(
        function() {
            clearInterval(color.timer.ele_side_catalog_scroll);
            color.timer.ele_side_catalog_scroll = setInterval(function() {
                color.sidecatalog.contentScroll( - 3)
            },
            300)
        });
		$("#side-catalog-down").click(
        function() {
            clearInterval(color.timer.ele_side_catalog_scroll);
            color.sidecatalog.contentScroll( - 3)
        });
		$("#side-catalog-down").mouseup(
        function() {
            clearInterval(color.timer.ele_side_catalog_scroll)
        });
		$("#side-catalog-up").mouseover(
        function() {
            if (this.className != "disabled") {
				$(this).addClass("hover")
            }
        });
		$("#side-catalog-up").mouseout(
        function() {
			$(this).removeClass("hover")
        });
		$("#side-catalog-down").mouseout(
        function() {
			$(this).removeClass("hover")
        });
		$("#side-catalog-down").mouseover(
        function() {
            if (this.className != "disabled") {
				$(this).addClass("hover")
            }
        });
    }
};
//sidecatalog 向上向下箭头状态
color.sidecatalog.statuschange = function(status) {
    switch (status) {
		case "top":
			$("#side-catalog-up").addClass("disable");
			$("#side-catalog-down").removeClass("disable");
			break;
		case "bottom":
			$("#side-catalog-down").addClass("disable");
			$("#side-catalog-up").removeClass("disable");
			break;
		case "normal":
			$("#side-catalog-up").removeClass("disable");
			$("#side-catalog-down").removeClass("disable");
			break;
		case "both":
			$("#side-catalog-down").addClass("disable");
			$("#side-catalog-up").addClass("disable");
			break;
    }
};
//sidecatalog 内容构建
color.sidecatalog.contentbuild = function() {
	var content = $("#content");
	var h2 = $("h2", content);
	var h3 = $("h3", content);
	var h4 = $("h4", content);
    $.each([h2.toArray(), h3.toArray(), h4.toArray()], 
    function(i, v) {
        $.each(v, 
        function(ii,vv) {
            $(vv).addClass("bk-sidecatalog-title")
        })
    });
	
    var contentList = [];
    var sidecatalog_title = $(".bk-sidecatalog-title", content);

    function set_tag(elem, tag_h_num) {
        return {
            ele: elem,
            title: $(elem).text(),
            level: tag_h_num
        }
    }
    $.each(sidecatalog_title, 
    function(i, elem) {
        var tag_h_num = elem.tagName.substr(1);
        var temp_content = set_tag(elem, tag_h_num);
        contentList.push(temp_content)
    });
	
    color.sidecontentList = contentList;
    color.sidecatalogDomInit();
};

//初始化sidecatelog DOM
color.sidecatalogDomInit = function() {
    var side_title_panel = document.createElement("div");
    var side_title_list = document.createElement("div");
    var side_catalog_up = document.createElement("div");
    var side_catalog_down = document.createElement("div");
    side_title_list.id = "side-title-list";
    side_title_panel.id = "side-title-panel";
    side_catalog_up.id = "side-catalog-up";
    side_catalog_down.id = "side-catalog-down";
	
    $.each(color.sidecontentList, 
    function(i, obj) {
        var h_tag = document.createElement("h" + obj.level);
		var code_title = (obj.title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");//编码
        var h_tag_link = ["<a href='#' data-index = '" + i + "'", "title='", code_title, "'>", obj.title, "</a>"];
        h_tag.innerHTML = h_tag_link.join("");
        side_title_list.appendChild(h_tag);
        obj.item = h_tag;
        h_tag = null
    });
	
    side_title_panel.appendChild(side_title_list);
    var side_catalog_content = $("#side-catalog-content");
    side_catalog_up.innerHTML = "<div></div>";
    side_catalog_down.innerHTML = "<div></div>";
    side_catalog_content.append(side_catalog_up);
    side_catalog_content.append(side_title_panel);
    side_catalog_content.append(side_catalog_down);
    var a_links = $("a", side_title_list);
    for (var i = 0, link_length = a_links.length; i < link_length; i++) {
        $(a_links[i]).click(
        function(e) {
            color.sidecatalog.scrollto($(this).attr("data-index"));
            e.preventDefault()
        })
    }
    D = null;
    side_title_list = side_title_panel = side_catalog_up = side_catalog_down = F = null
};
//Animate 自定义效果
color.sidecatalog.scrollto = function(index) {
	if (color.sidecontentList[index]) {
		var target = $(color.sidecontentList[index].ele);
		if (!target) return;
		var targetOffset = $(target).offset().top;
		$('html,body').animate({scrollTop: targetOffset+'px'}, 400);
    }
};
//展开,隐藏sidecatalog
color.sidecatalog.toggle = function() {
    var toggle_status = false;
    return function() {
        $("#side-catalog-content").css('display', toggle_status ? "none": "block");
		if(!toggle_status){
			$(".sidebar").addClass('show');	
		}else{
			$(".sidebar").removeClass('show');	
		}
		
        toggle_status = !toggle_status;
        color.sidecatalog.togglestatus = toggle_status;
        var scroll_event = color.sidecatalog.tofocus;
        if ($.browser.msie && $.browser.version < 7 && $.support.style) {
            scroll_event = color.sidecatalog.delayfocus;

        }
        if (toggle_status) {
            color.sidecatalog.tofocus();
            $(window).bind("scroll", scroll_event);
        } else {
            try {
                $(window).unbind("scroll", scroll_event);
            } catch(e) {}
        }
    }
};
//延迟聚焦
color.sidecatalog.delayfocus = function() {
    clearTimeout(color.timer.scroll_catalogfocus);
    color.timer.scroll_catalogfocus = setTimeout(color.sidecatalog.tofocus, 200)
};
//聚焦
color.sidecatalog.tofocus = function() {
    if (color.sidecatalog.togglestatus) {
        var scrollTop = $(window).scrollTop() + 40;
        var side_title_list = $("#side-title-list");
        if (side_title_list) {
            var vHeight = color.sidecatalog.vHeight;
            var totalHeight = color.sidecatalog.getTotalHeight() - 40;
            if (vHeight <= 0 || totalHeight == 0) {
                return
            }
            for (var i = 0, sidecontentList_length = color.sidecontentList.length; i < sidecontentList_length; i++) {
                var current = color.sidecontentList[i];
                if ($(current.ele).position().top <= scrollTop && ((i + 1 == sidecontentList_length) || ((i + 1 < sidecontentList_length) && $(color.sidecontentList[i + 1].ele).position().top > scrollTop))) {
                    var height = i * color.sidecatalog.step;
                    var half_vHeight = vHeight / 2;
                    half_vHeight = half_vHeight - half_vHeight % 20;
                    var temp_height = Math.min(vHeight - height - half_vHeight, 0);
                    var status = "normal";
                    if (temp_height + totalHeight <= vHeight) {
                        temp_height = -totalHeight + vHeight;
                        status = "bottom"
                    }
                    if (temp_height == 0) {
                        status = (status == "bottom") ? "both": "top"
                    }
                    color.sidecatalog.statuschange(status);
                    side_title_list.css("top", temp_height);
                    $(current.item).addClass("on")
                } else {
                    $(current.item).removeClass("on")
                }
            }
        }
    }
};

//获取catalog总高度
color.sidecatalog.getTotalHeight = function() {
    return (color.sidecontentList.length * color.sidecatalog.step + 40)
};
//resize事件
color.sidecatalog.resize = function(e) {
    var sidecatalog = $("#sidecatalog");
    var side_catalog_content = $("#side-catalog-content");
    var totalHeight = color.sidecatalog.getTotalHeight();
    var min_height = Math.min($(window).height() - 200, 500);
    min_height = min_height - min_height % 20;
    if (totalHeight > min_height) {
        totalHeight = min_height
    }
    if (totalHeight < 100) {
        totalHeight = 100
    }

    color.sidecatalog.vHeight = totalHeight - 40;

    color.tools.fixable(sidecatalog, {
        top: ($(window).height() - 160),
        right: (0)
    });
    color.tools.fixable(side_catalog_content, {
        overflow: "hidden",
        height: totalHeight,
        top: ($(window).height() - totalHeight - 70),
        right: (27)
    });
    var side_title_panel = $("#side-title-panel");
    if (side_title_panel) {
        side_title_panel.css("height", totalHeight - 40)
    }
    color.sidecatalog.tofocus()
};
//scroll事件
color.sidecatalog.scroll = function(B) {
    var sidecatalog = $("#sidecatalog");
    if (!color.sidecatalog.checkToShow()) {
        $(".sidebar").removeClass('show');
        $("#side-catalog-content").hide();
    } else {
		if (color.sidecatalog.togglestatus) {
			$(".sidebar").addClass('show');
			$("#side-catalog-content").show();
		}
    }

};

$(function(){
	//container 高度补全
	if($('body').innerHeight() < $(window).height()){
		$('#container').css('height', $(window).height() - 80);
		$(window).resize(function(){$('#container').css('height', $(window).height() - 80)});
		$("#sidecatalog").hide();
	}else{
	//Category 插件加载
		color.sidecatalog.init();
		color.sidecatalog.resize();
		color.sidecatalog.scroll();
		$(window).scroll(function(){color.sidecatalog.scroll()})
		$('.sidebar').click(color.sidecatalog.toggle());
		$(window).resize(function(){color.sidecatalog.resize()});
	}
    //链接新窗口打开
    $('a[href]').each(function() {
        if (this.href.indexOf(window.location.host) == -1) $(this).attr({target: '_blank', title: this.href });
    });
	
	//代码高亮
    var syntaxHighlight = function() {
        color.tools.loadCssFile(root_path + 'syntax/styles/shCoreDefault.css');
        $.getScript(root_path + 'syntax/scripts/shCore.js', function() {
            $.getScript(root_path + 'syntax/scripts/shAutoloader.js', function(){
                SyntaxHighlighter.autoloader(
                  'js jscript javascript '+ root_path + 'syntax/scripts/shBrushJScript.js',
                  'php '+ root_path + 'syntax/scripts/shBrushPhp.js',
                  'css CSS Css '+ root_path + 'syntax/scripts/shBrushCss.js'
                );
                 
                SyntaxHighlighter.all();
            });
        });
    };
    syntaxHighlight();
});