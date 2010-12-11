var kwiki = {
    getCSS: function(url) {
        var tag = '<link rel="stylesheet" href="' + url + '" />';
        $('body').append(tag);
    },
    insertCSS: function(url) {
        $.get(url, function(res) {
            var tag = '<style>' + res + '</stle>';
            $('body').append(tag);
        });
    },
    insertScript: function(url, bottle) {
        var tag = '<script src=' + url + '></script>';
        if (!bottle) bottle = 'head';
        $(bottle).append(tag);
    }
};

$(document).ready(function() {
	if(document.body.clientHeight < document.documentElement.clientHeight){
		$('#container').css('height', document.documentElement.clientHeight - 80);
		$(window).resize(function(){$('#container').css('height', document.documentElement.clientHeight - 80)});
	}
	var inner_width = window.innerWidth || document.documentElement.clientWidth;
    if (inner_width >= 460) {
        var toggler = $('<div class="toggler" title="点击展开/收起，Shift+Z 隐藏或打开">目录</div>'),
        toc = $('.toc');
        toc.wrap('<div class="tocWrap"></div>');

        $('.tocWrap').prepend(toggler)
        .delay(500)
        .fadeTo(500, '0.25')
        .hover(function() {
            $(this).stop().fadeTo(300, '0.9');
        }, function() {
            $(this).stop().fadeTo(300, '0.25');
        });

        $('html').keypress(function(e) {
            if (e.shiftKey && (e.charCode || e.keyCode) == '90') {
				
				if ( e && e.preventDefault ) {
					e.preventDefault(); 
				}else {
					window.event.returnValue = false;
				}
                $('div.tocWrap').toggle(200);
            }
        });

        toggler.click(function() {
            $('div.toc').slideToggle(300);
        });
    }

    //外链处理
    $('a[href]').each(function() {
        if (this.href.indexOf(window.location.host) == -1) $(this).attr({target: '_blank', title: this.href });
    });

    $('a[href^=#][href!=#]').click(function() {
        var target = document.getElementById(this.hash.slice(1));
        if (!target) return;
        var targetOffset = $(target).offset().top;
        $('html,body').animate({scrollTop: targetOffset+'px'}, 400);
        return false;
    });
	
	//代码高亮
    var syntaxHighlight = function() {
        kwiki.getCSS(root_path + 'syntax/styles/shCoreDefault.css');
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
