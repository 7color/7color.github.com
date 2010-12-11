$(function(){
	if(document.body.clientHeight < document.documentElement.clientHeight){
		$('#container').css('height', document.documentElement.clientHeight - 80);
		$(window).resize(function(){$('#container').css('height', document.documentElement.clientHeight - 80)});
	}

});

google.load('search', '1', {language:'zh-CN', "nocss":true});
google.setOnLoadCallback(function() {
var customSearchControl = new google.search.CustomSearchControl('013030817900856272774:gca-nrnvrcq');
customSearchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
var options = new google.search.DrawOptions();
options.setAutoComplete(true);
customSearchControl.draw('cse', options);
customSearchControl.setNoResultsString('什么也没找到，请重试');
customSearchControl.setResultSetSize(google.search.Search.SMALL_RESULTSET);
customSearchControl.setLinkTarget(google.search.Search.LINK_TARGET_SELF);
var inCallback = false;
var t;
$('.gsc-search-button').val('OK');
customSearchControl.setSearchCompleteCallback(null,function() {
	if(t){window.clearTimeout(t);}
	inCallback = true;
	$('input.gsc-input').select();
	var searchwords = $('input.gsc-input').val();
	$('.page-title').text('搜索: '+searchwords)
	$('.gsc-branding').css('display', 'none');
	document.title = "搜索："+searchwords+" - 七彩映像.Wiki";
	location.hash = searchwords;
	$("#toc_1").text("搜索："+searchwords);
	$('a.gs-title').addClass('new').unwrap().wrap('<h3></h3>').each(function() {
		var title=$(this).html().replace(/\- 七彩映像.Wiki$/, "");
		$(this).html(title);
	});
	$('b:contains("...")').contents().unwrap();
	$('.gsc-cursor-current-page').removeClass('gsc-cursor-page');

	t=window.setTimeout(function(){inCallback=false; t=null;}, 100);
});

var k = location.hash.substring(1);
if(!k){
	var m = location.search.match(/[?&]q=([^&]*)(&|$)/);
	if(m && m[1]){
		k = m[1];
	}
}
if(k){
	customSearchControl.execute(decodeURIComponent(k));
}

window.onhashchange = function(){
	if(inCallback){
		inCallback = false;
		return;
	}
	var k = location.hash.substring(1);

	if(k){
		customSearchControl.execute(decodeURIComponent(k));
	}
};
}, true);
