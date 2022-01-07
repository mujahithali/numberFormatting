function doRegisterPcrmNumberFormattingEvents(config, el) {
    let numberConfig = {};

    let getNumbInputFieldObj = function (el) {
        let currVal = $(el).val().trim();
        let inputSign = $(el).attr("nfInputSign");
        let minNumber = $(el).attr("nfMinNumber");
        let maxNumber = $(el).attr("nfMaxNumber");
        let stepValue = $(el).attr("nfStepValue");
        let isAllowDecimal = $(el).attr("nfIsAllowDecimal");
        let decimalMinLength = $(el).attr("nfDecimalMinLength");
        let decimalMaxLength = $(el).attr("nfDecimalMaxLength");
        let isAllowNegative = $(el).attr("nfIsAllowNegative");
        let isAllowZero = $(el).attr("nfIsAllowZero");
        let isDefaultZero = $(el).attr("nfIsDefaultZero");

        numberConfig["currVal"] = (currVal ? currVal : "");
        numberConfig["inputSign"] = (inputSign ? inputSign.toString().trim() : "");
        numberConfig["minNumber"] = (minNumber ? minNumber.toString().trim() : "");
        numberConfig["maxNumber"] = (maxNumber ? maxNumber.toString().trim() : "");
        numberConfig["stepValue"] = (stepValue ? stepValue.toString().trim() : "");
        numberConfig["maxLength"] = (maxNumber ? maxNumber.length : "");
        numberConfig["isAllowDecimal"] = (isAllowDecimal ? $.parseJSON(isAllowDecimal.toString().trim().toLowerCase()) : (((decimalMinLength && decimalMinLength.toString().trim()) || (decimalMaxLength && decimalMaxLength.toString().trim())) ? true : false));
        numberConfig["decimalMinLength"] = (decimalMinLength ? decimalMinLength.toString().trim() : "");
        numberConfig["decimalMaxLength"] = (decimalMaxLength ? decimalMaxLength.toString().trim() : "20");
        numberConfig["isAllowNegative"] = (isAllowNegative ? $.parseJSON(isAllowNegative.toString().trim().toLowerCase()) : false);
        numberConfig["isAllowZero"] = (isAllowZero ? $.parseJSON(isAllowZero.toString().trim().toLowerCase()) : false);
        numberConfig["isDefaultZero"] = (isDefaultZero ? $.parseJSON(isDefaultZero.toString().trim().toLowerCase()) : false);
    };

    $("body").off("focus blur keydown keypress keyup reinitiate", "input.nf_number_input_field").on({
        "focus": function (evt) {
            getNumbInputFieldObj(this);
            let $currEl = $(this);
            let parentDivClsName = (numberConfig["inputSign"] == "$" ? "nf_dollar_input_parent_div" : (numberConfig["inputSign"] == "%" ? "nf_percentage_input_parent_div" : ""));
            let doAppendInputArrow = $currEl.hasClass("nf_number_input_arrow");
            parentDivClsName = (doAppendInputArrow ? "nf_number_input_arrow_parent_div" : parentDivClsName);
            $currEl.parent().addClass(parentDivClsName);            
            $currEl.parent().css("width", $currEl.css("width"));

            if (numberConfig["currVal"].trim()) {
                let maxNumber = "";
                let decimalMinLength = (numberConfig["decimalMinLength"] ? numberConfig["decimalMinLength"] : "0");
                let numberInFormat = getNumberInFormat(evt, numberConfig["currVal"], numberConfig["inputSign"], numberConfig["minNumber"], maxNumber, numberConfig["maxLength"], decimalMinLength, numberConfig["decimalMaxLength"], numberConfig["isAllowNegative"], numberConfig["isAllowZero"], numberConfig["isDefaultZero"]);
                $(this).val(numberInFormat);
            }

            if (doAppendInputArrow) {
                if (!($currEl.parent().find(".nf_number_input_arrow_btn").length)) {
                    let arrowBtnHtml = "";
                    arrowBtnHtml += '<div class="nf_number_input_arrow_btn_div">';
                    arrowBtnHtml += '<i class="nf_number_input_arrow_btn" step="up">&#x25B2;</i>';
                    arrowBtnHtml += '<i class="nf_number_input_arrow_btn" step="down">&#x25BC;</i>';
                    arrowBtnHtml += '</div>';

                    $currEl.parent().append(arrowBtnHtml);
                }
            }
        },
        "blur": function () {
            let $currEl = $(this);
            $currEl.trigger("unfocus");
        },
        "keydown": function (evt) {
            getNumbInputFieldObj(this);
            let asciiCode = getAsciiCode(evt);
            let stepType = (asciiCode == "38" ? "up" : (asciiCode == "40" ? "down" : ""));

            if (numberConfig["stepValue"] && stepType) {
                doUpdateNumberValueByStep($(this), stepType, numberConfig);
            }
        },
        "keypress": function (evt) {
            getNumbInputFieldObj(this);
            return doAcceptOnlyNumbers(evt, this, numberConfig["maxLength"], numberConfig["isAllowDecimal"], numberConfig["decimalMaxLength"], numberConfig["isAllowNegative"]);
        },
        "keyup": function (evt) {
            getNumbInputFieldObj(this);
            let caretIdx = $(this).caret();
            let maxNumber = "";
            let decimalMinLength = (numberConfig["decimalMinLength"] ? numberConfig["decimalMinLength"] : "0");
            let numberInFormat = getNumberInFormat(evt, numberConfig["currVal"], numberConfig["inputSign"], numberConfig["minNumber"], maxNumber, numberConfig["maxLength"], decimalMinLength, numberConfig["decimalMaxLength"], numberConfig["isAllowNegative"], numberConfig["isAllowZero"]);
            $(this).val(numberInFormat);

            if (!getSelText()) {
                let asciiCode = getAsciiCode(evt);
                let commaLen = numberConfig["currVal"].split(",").length;
                $(this).caret(caretIdx + ((numberInFormat.split(",").length - commaLen)) + (numberInFormat.startsWith("0") ? ((numberConfig["stepValue"] && (asciiCode == "38" || asciiCode == "40")) ? 0 : 1) : 0));
            }
        },
        "unfocus": function (evt) {
            getNumbInputFieldObj(this);
            let currVal = (numberConfig["currVal"] ? numberConfig["currVal"] : (numberConfig["isDefaultZero"] ? "0" : ""));
            let decimalMinLength = (numberConfig["decimalMinLength"] ? numberConfig["decimalMinLength"] : "0");
            $(this).val(getNumberInFormat(evt, currVal, numberConfig["inputSign"], numberConfig["minNumber"], numberConfig["maxNumber"], numberConfig["maxLength"], decimalMinLength, numberConfig["decimalMaxLength"], numberConfig["isAllowNegative"], numberConfig["isAllowZero"], numberConfig["isDefaultZero"]));

            if (!currVal) {
                $(this).parent().removeClass("nf_dollar_input_parent_div nf_percentage_input_parent_div");
            }
        },
        "reinitiate": function (evt, initOnly) {
            getNumbInputFieldObj(this);
            let $currEl = $(this);
            let parentDivClsName = (numberConfig["inputSign"] == "$" ? "nf_dollar_input_parent_div" : (numberConfig["inputSign"] == "%" ? "nf_percentage_input_parent_div" : ""));
            $currEl.parent().addClass(parentDivClsName);

            if (!initOnly) {
                $currEl.trigger("unfocus");
            }
        }
    }, "input.nf_number_input_field");

    $("body").off("click", ".nf_number_input_arrow_btn").on({
        "click": function () {
            let $parentEl = $(this).parents(".nf_number_input_arrow_parent_div");
            let $inputEl = $parentEl.find(".nf_number_input_arrow");
            let stepType = $(this).attr("step");
            doUpdateNumberValueByStep($inputEl, stepType, numberConfig);
        }
    }, ".nf_number_input_arrow_btn");

    $(document).off("click", "body").on({
        "click": function (e) {
            if (!($(e.target).is(".nf_number_input_field") || $(e.target).is(".nf_number_input_arrow_btn") || $(e.target).is(".nf_number_input_arrow_parent_div"))) {
                $(".nf_number_input_arrow_parent_div").removeClass("nf_number_input_arrow_parent_div nf_number_input_arrow_current_div");
            }
            else {
                let parentEl = $(e.target).closest(".nf_number_input_arrow_parent_div");
                $(".nf_number_input_arrow_parent_div").not(parentEl).removeClass("nf_number_input_arrow_parent_div");
            }
        }
    }, "body");
}

function doRenderPcrmNumberFormattingAttribute(config, el) {
    let configNumberFormat = {
        init: function (configObj) {
            $.each($(el), function (i, e) {
                if (!$(e).hasClass("nf_number_input_field")) {
                    $(e).addClass("nf_number_input_field");
                    if (configObj["nfInputArrowBtn"] == "true") {
                        $(e).addClass("nf_number_input_arrow");
                    }
                    $.each(configObj, function (k, v) {
                        $(e).attr(k, v);
                    });
                }
            });
        },
        destroy: function () {
            $(el).removeClass("nf_number_input_field");
        },
        reinitiate: function () {
            $(el).trigger("reinitiate");
        },
        mask: function () {
            $(el).trigger("reinitiate", ["true"]);
        }
    };

    return configNumberFormat[config] ? configNumberFormat[config].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof config && config ? ($.error("Method " + config + " does not exist on nf js"), void 0) : configNumberFormat["init"].apply(this, arguments)
}

function doAcceptOnlyNumbers(evt, el, maxLength, isAllowDecimal, decimalMaxLength, isAllowNegative) {
    let event = (evt ? evt : window.event);
    let charCode = (event.which ? event.which : event.keyCode);
    let currVal = $(el).val().toString();
    let currValLen = currVal.length;
    let decimalIdx = currVal.indexOf(".");
    let negativeIdx = currVal.indexOf("-");
    let currDecimalLen = ((isAllowDecimal && decimalIdx > 0) ? ((currValLen - decimalIdx) - 1) : 0);
    let currNumberLen = (currValLen - currDecimalLen);
    let caretIdx = $(el).caret();

    if ((charCode > 31) && ((charCode < 48) || (charCode > 57)) && !((charCode == 8) || (isAllowDecimal && (charCode == 46)) || (isAllowNegative && (charCode == 45)))) {
        return false;
    }
    else {
        if (getSelText() && (((charCode > 47) && (charCode < 58)) || (isAllowNegative && (charCode == 45)))) {
            return true;
        }

        if ((isAllowDecimal && (charCode == 46) && (decimalIdx > -1)) || (isAllowNegative && (charCode == 45) && (negativeIdx > -1))) {
            return false;
        }
        else if (maxLength && (currNumberLen >= maxLength) && ((decimalIdx > -1) ? (caretIdx <= decimalIdx) : (caretIdx >= maxLength))) {
            return false;
        }
        else if (decimalMaxLength && (currDecimalLen >= decimalMaxLength) && (caretIdx > decimalIdx)) {
            return false;
        }
    }

    return true;
}

function getNumberInFormat(evt, numb, numberFormatSign, minNumber, maxNumber, maxLength, decimalMinLength, decimalMaxLength, isAllowNegative, isAllowZero, isDefaultZero, isAppendSign, trimSignSpace) {    
    if (isDebugMode) {
        console.log(`------ \n getNumberInFormat \n evt: ${evt} \n numb: ${numb} \n numberFormatSign: ${numberFormatSign} \n minNumber: ${minNumber} \n maxNumber: ${maxNumber} \n maxLength: ${maxLength} \n decimalMinLength: ${decimalMinLength} \n decimalMaxLength: ${decimalMaxLength} \n isAllowNegative: ${isAllowNegative} \n isAllowZero: ${isAllowZero} \n isDefaultZero: ${isDefaultZero} \n isAppendSign: ${isAppendSign} \n trimSignSpace: ${trimSignSpace}`);        
    }
    maxLength = parseInt(maxLength), decimalMinLength = parseInt(decimalMinLength), decimalMaxLength = parseInt(decimalMaxLength);
    let numbVal = (numb ? numb.toString().trim() : "");
    let isNegativeNumb = (numbVal.indexOf("-") > -1);
    let decimalIdx = numbVal.indexOf(".");
    numbVal = (numbVal ? numbVal.replace(/[,]/g, "") : "");
    numbVal = numbVal.slice(0, ((decimalIdx > -1) ? ((maxLength && (decimalIdx > maxLength)) ? maxLength : decimalIdx) : (maxLength ? maxLength : numbVal.length))) + ((decimalIdx > -1) ? (numbVal.slice(decimalIdx)) : "");    
    numbVal = (($.isNumeric(numbVal) || (decimalIdx == 0)) ? numbVal : "");
    let currDecimalLen = ((decimalMaxLength && decimalIdx > 0) ? (((numbVal.replace(/[-]/g, "").length) - decimalIdx) - 1) : 0);
    let currDecimalVal = decimalVal = numbVal.split('.')[1];
    if (currDecimalVal && decimalMaxLength) {
        decimalVal = parseFloat("." + currDecimalVal).toFixed((currDecimalVal.length > decimalMaxLength ? decimalMaxLength : currDecimalVal.length));
    }
    if (decimalMinLength && evt.type != "keyup") {
        decimalVal = parseFloat((decimalVal && decimalVal.indexOf(".") > -1 ? "" : ".") + (decimalVal ? decimalVal : 0)).toFixed(((currDecimalVal && currDecimalVal.length) > decimalMinLength ? currDecimalVal.length : decimalMinLength));
    }
    numbVal = (((decimalIdx > -1) && decimalMaxLength && (currDecimalLen > 0)) ? (parseFloat(numbVal)) : numbVal).toString();
    if (minNumber && numbVal && evt.type != "keyup") {
        numbVal = ((minNumber && (parseFloat(numbVal) > parseFloat(minNumber))) ? numbVal : minNumber.toString());
    }
    numbVal = ((maxNumber && (parseFloat(numbVal) > parseFloat(maxNumber))) ? maxNumber.toString() : numbVal);
    numbVal = (numbVal ? (isAllowNegative ? numbVal.replace(/[-]/g, "") : numbVal) : "");    
    decimalIdx = numbVal.indexOf(".");
    let priceFormatNumb = (numbVal ? (new Intl.NumberFormat("en-US").format(parseFloat((numbVal == ".") ? "0" : numbVal))) : numbVal);
    priceFormatNumb = (isAllowZero ? priceFormatNumb : (priceFormatNumb == "0" ? "" : priceFormatNumb));
    priceFormatNumb = ((isDefaultZero && (evt && evt.type != "focusin")) ? (priceFormatNumb ? priceFormatNumb : "0") : ((priceFormatNumb == "0" && (evt && evt.type == "focusin") && isDefaultZero) ? "" : priceFormatNumb));
    priceFormatNumb = (isAllowNegative && isNegativeNumb ? "-" : "") + priceFormatNumb;       
    let numbValEndsWith = (numbVal.endsWith(".") ? "." : (numbVal.endsWith(".0") ? ".0" : (numbVal.endsWith(".00") ? ".00" : "")));
    priceFormatNumb = (((decimalIdx > -1) && numbValEndsWith && (evt && evt.type == "keyup")) ? (priceFormatNumb.replace(/\.00|\.0|\./g, "") + numbValEndsWith) : priceFormatNumb);
    let regExForEndsWithZero = /\.[1-9]+[0]/;
    numbValEndsWith = regExForEndsWithZero.test(numbVal);
    priceFormatNumb = (((decimalIdx > -1) && numbValEndsWith && (evt && evt.type == "keyup")) ? (priceFormatNumb + "0") : priceFormatNumb);
    priceFormatNumb = ((isAppendSign && numberFormatSign == "$") ? ("$" + (trimSignSpace ? "" : " ")) : "") + priceFormatNumb;
    priceFormatNumb += ((isAppendSign && numberFormatSign == "%") ? ((trimSignSpace ? "" : " ") + "%") : "");    
    if (decimalVal) {
        priceFormatNumb = priceFormatNumb.split(".")[0] + decimalVal.toString().slice(1);
    }
    return priceFormatNumb;
}

function doUpdateNumberValueByStep($inputEl, stepType, numberConfig) {
    let minNumber = parseFloat(numberConfig["minNumber"] ? numberConfig["minNumber"] : 0);
    let maxNumber = parseFloat(numberConfig["maxNumber"] ? numberConfig["maxNumber"] : 0);
    let stepValue = (numberConfig["stepValue"] ? numberConfig["stepValue"] : "0.1");
    let currVal = $inputEl.val();
    let currValDecLen = (currVal && currVal.split(".")[1] ? currVal.split(".")[1].length : 0);
    let stepValDecLen = (stepValue && stepValue.split(".")[1] ? stepValue.split(".")[1].length : 0);
    let newVal = (currVal ? parseFloat(currVal) : 0) + parseFloat((stepType == "up" ? "+1" : "-1") * stepValue);
    newVal = (newVal >= minNumber ? newVal : minNumber);
    newVal = ((maxNumber && maxNumber < newVal) ? maxNumber : newVal);
    newVal = parseFloat(newVal);
    if (currValDecLen || stepValDecLen) {
        newVal = parseFloat(newVal).toFixed(currValDecLen > stepValDecLen ? currValDecLen : stepValDecLen);    
    }
    $inputEl.val(parseFloat(newVal));
}

function getSelText() {
    let txt = '';

    if (window.getSelection) {
        txt = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        txt = document.selection.createRange().text;
    }

    return txt;
}

function getAsciiCode(evt) {
    let event = (evt ? evt : window.event);
    let asciiCode = (event.which ? event.which : event.keyCode);
    return asciiCode;
}

const urlParams = new URLSearchParams(window.location.search);
let isDebugMode = false;

function doDebugModeToggle(opt) {
    isDebugMode = false;
    if (opt) {
        isDebugMode = true;
    }

    console.log(`isDebugMode : ${isDebugMode}`);
}

(function ($) {
    $.fn.extend({
        configNumberFormatting: function (config) {            
            doRenderPcrmNumberFormattingAttribute((config ? config : {}), this);
        }
    });

    var scriptEl = document.createElement('script');
    scriptEl.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/caret/1.3.7/jquery.caret.min.js");
    document.head.appendChild(scriptEl);

    if (window.location.search.indexOf("debugMode=") > -1) {
        doDebugModeToggle(urlParams.get("debugMode"));
    }
}(jQuery));