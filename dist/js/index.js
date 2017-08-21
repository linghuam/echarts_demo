
$(function () {
    window.dialogPopover = new Dialog();
});

$(function () {
    var taglayoutInstance = new TagLayout('tag_container');
    var eqplayoutInstance = new EquipMentLayout('eqp_container');

    $('#tag_analysis').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.module-container').css('display', 'none');
        taglayoutInstance.start();
    });

    $('#equipment_analysis').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.module-container').css('display', 'none');
        eqplayoutInstance.start();
    });

    $('#article_analysis').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.module-container').css('display', 'none');

    });

    $('#tag_analysis').click();
});