$(function () {
    doRegisterPcrmNumberFormattingEvents();

    $("#id_inputField_1").configNumberFormatting();

    $("#id_inputField_2").configNumberFormatting({ nfInputSign: "$" });

    $("#id_inputField_3").configNumberFormatting({ nfIsAllowDecimal: "true" });

    $("#id_inputField_4").configNumberFormatting({ nfDecimalMinLength: "1" });

    $("#id_inputField_5").configNumberFormatting({ nfDecimalMaxLength: "2" });

    $("#id_inputField_6").configNumberFormatting({ nfIsAllowNegative: "true" });

    $("#id_inputField_7").configNumberFormatting({ nfMinNumber: "10" });

    $("#id_inputField_8").configNumberFormatting({ nfMaxNumber: "1000" });

    $("#id_inputField_9").configNumberFormatting({ nfStepValue: "0.5" });

    $("#id_inputField_10").configNumberFormatting({ nfInputArrowBtn: "true" });

    window.onscroll = function () { scrollFunction() };
})

function isElementPartiallyInViewport(el) {
    if (typeof jQuery !== 'undefined' && el instanceof jQuery)
        el = el[0];

    let rect = el.getBoundingClientRect();
    let windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    let windowWidth = (window.innerWidth || document.documentElement.clientWidth);
    let vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    let horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

    return (vertInView && horInView);
}

function scrollFunction() {
    let $topBtn = $("#id_backtoTopBtn");

    if (isElementPartiallyInViewport($(".nfUsageDiv")) || isElementPartiallyInViewport($(".nfOptionsDiv"))) {
        $topBtn.hide();
    } else {
        $topBtn.show();
    }
}

function backtoTopFn() {
    let scrollTopVal = $(".nfOptionsDiv").offset().top;
    $("html, body").stop().animate({ scrollTop: scrollTopVal }, "slow");
}