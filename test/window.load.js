$(function () {
	$('#tag_analysis').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.module-container').css('display', 'none');
	});
	$('#equipment_analysis').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.module-container').css('display', 'none');
        
	});
	$('#article_analysis').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.module-container').css('display', 'none');

	});
});