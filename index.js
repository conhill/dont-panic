const timelines = require('./timelines');
const utils = require('./utils');

let selectedOptionFinal = {
    target: undefined,
    position: 0,
    parent: undefined
};
const state = {
    locked: false,
    startingAnimationDone: false,
    animationCount: 0
};
const animationCountObj = { value: 0 };

////////////////////////////////////////////////////////////////
// HELPERS
////////////////////////////////////////////////////////////////

// Function to add class and hide elements
function hideElements(selector) {
    $(selector).each(function (i, v) {
        $(v).addClass("hide");
    });
}

var closeMenuAfterSelection = function (singleMenu, listMenu) {
    var singleMenuClass = utils.getClassNameFromObj(singleMenu);
    var option2Selector = singleMenuClass + ' .option2:not(".selected")';
    var extendedOptionSelector = singleMenuClass + ' .extend_option';
    var optionSelector = singleMenuClass + ' .option';

    // Only set opacity, do not reset transform (let anime.js handle it)
    $(option2Selector).css({
        'opacity': 0
    }).removeClass("sticky");

    $(optionSelector).removeClass('fullopen').css('width', '600px');
    $(extendedOptionSelector).css({
        'width': '250px',
        'opacity': 0
    });

    utils.removeTransformsFromSecondMenu(singleMenuClass);
};

function setSelectedOption(currentTarget) {
    if (currentTarget.attr('class').indexOf('extend_option') > -1){
        selectedOptionFinal.target = currentTarget.parent().find('.option2');
        selectedOptionFinal.parent = currentTarget;
    } else {
        selectedOptionFinal.target = currentTarget;
        selectedOptionFinal.parent = currentTarget.closest('.secondary_list');
    }
    selectedOptionFinal.position = currentTarget.closest('.secondary_list').find('.option2:not(.extend_option)').index(currentTarget);
    debugger;
}

////////////////////////////////////////////////////////////////
// START
////////////////////////////////////////////////////////////////

var start = function () {
    state.locked = true;
    const menuData = [
        { color: ".purple", menu: ".firstMenu", delay: 500 },
        { color: ".teal", menu: ".secondMenu", delay: 750 },
        { color: ".green", menu: ".thirdMenu", delay: 1000 },
        { color: ".orange", menu: ".fourthMenu", delay: 1250 },
        { color: ".red", menu: ".fifthMenu", delay: 1500 },
        { color: ".darkpurple", menu: ".sixthMenu", delay: 1750 }
    ];

    menuData.forEach(({ color, menu, delay }) => {
        setTimeout(() => {
            timelines.rollOutMenu(
                color,
                menu,
                animationCountObj,
                state
            );
        }, delay);
    });
};

////////////////////////////////////////////////////////////////
// ANIMATIONS
////////////////////////////////////////////////////////////////


//opens secondary menu after hover
function openMenu(menuNumber, closedItself) {
    timelines.openMenu(menuNumber, closedItself, timelines.flipUpSecondary);
}

function openWarningMenu(menuNumber) {
    var translateY = (
        $('.activeMenu').offset().top -
        $(".warning").offset().top -
        ((1 * 24) + 10) +
        (1 * 5) +
        100
    );
    timelines.openWarningMenu(menuNumber, translateY, timelines.flipUpSecondary);

    setSelectedOption($(menuNumber).find('.extend_option.warning'));
}

function openMapsMenu(menuNumber) {
        var translateY = (
        $('.activeMenu').offset().top -
        $(".location").offset().top -
        ((1 * 24) + 10) +
        (1 * 5) +
        100
    );
    // debugger;
    timelines.openMapsMenu(menuNumber, translateY, timelines.flipUpSecondary);

    // setSelectedOption($(menuNumber).find('.extend_option.location'));
}

////////////////////////////////////////////////////////////////
// EVENTS
////////////////////////////////////////////////////////////////

$(document)
    .on('mouseenter', '.hoverFix', function () {
        if (state.locked) return;
        const selector = utils.getClassNameFromObj($(this).find(".option"));
        if (!selector) return;
        timelines.hoverOption(selector);
    })
    .on('mouseleave', '.hoverFix', function () {
        if (state.locked) return;
        const selector = utils.getClassNameFromObj($(this).find(".option"));
        if (!selector) return;
        timelines.unhoverOption(selector);
    });

$(document).on("click", ".hoverFix .option", async function () {
    // debugger;
    if (state.locked && !$(this).hasClass("fullopen")) return;
    const closeMenu = $(this);
    var menuNumber = closeMenu.parent().parent();
    // debugger;
    if (!menuNumber.length) return;

    if (!state.locked) {
        state.locked = true;
        const menuSelector = "." + menuNumber[0].className.split(" ")[0];

        if ($(menuSelector).find('.extend_option.warning').length > 0) {
            openWarningMenu(menuSelector);
        } else if ($(menuSelector).find('.extend_option.location').length > 0) {
            setSelectedOption($(menuNumber).find('.extend_option.location'));
            openMapsMenu(menuSelector);
        } else {
            openMenu(menuSelector, false);
        }
    } else if ($(this).hasClass("fullopen")) {

        var currItem = $(this);
        var container = currItem.closest('.fullWidth').find('.secondary_list');
        var extItem = container.find('.extend_option');
        var options = container.find('.option2');
        var menu =  currItem.parent().parent();
        // var menuNumber = currItem.parent().parent();

        utils.freezeOptionsInPlace(options);
        await new Promise(requestAnimationFrame);

        // debugger;
        const tl = anime.createTimeline({
            defaults: {
                easing: "easeOutExpo",
                duration: 2000
            },
            onComplete: function () {
                // debugger;`
                options.attr('style', 'opacity: 0;');
                menu.find('.option').removeClass("fullopen");
                menu.find('.option').attr('style', null);
                // options.attr('style', 'opacity: 0;');
                container.css({
                    width: null,
                });
                state.locked = false;
            }
        });

        tl.add(extItem.get(), {
            width: "100px",
            scaleX: 1,
            easing: "easeOutElastic(1, .5)",
            duration: 600
        })
        .add(extItem.get(), {
            opacity: 0,
            duration: 120
        });

        // Pause before drop
        tl.add({}, {duration: 220});

        tl.add(options.get(), {
        top: (el, i, l) => {
            const $el = $(el);
            const currentTop = parseInt($el.css('top'), 10) || 0;
            return currentTop + 1200; // Drop distance
        },
        easing: "cubicBezier(0.23, 1, 0.32, 1.2)",
        duration: 1200
    });
    }
});

$(document).on('click', '.secondary_list .option2:not(.grey):visible', function (el) {
    state.locked = false;
    const currentTarget = $(el.currentTarget);
    const sectionId = $(el.currentTarget).text().trim().toLowerCase();
    const parentParent = currentTarget.parent().parent();
    if (!currentTarget.length || !parentParent.length) return;

    const clickTarget = utils.getClassNameFromObj(currentTarget);
    const parentClickTarget = utils.getClassNameFromObj(parentParent);
    if (!clickTarget || !parentClickTarget) return;

    const optionIndex = currentTarget.index() + 1;
    const fullOptionIndex = parentParent.index() + 2;
    const optionParent = parentClickTarget + " " + clickTarget;

    setSelectedOption(currentTarget);
    // debugger;
    const $activeMenu = $('.activeMenu');
    const $optionParent = $(optionParent);
    if (!$activeMenu.length || !$optionParent.length) return;

     const optionText = $(this).text().trim().toLowerCase();
    
    // if (sectionId) showInfoSection(sectionId);
    // debugger;
    const translateY = (
        $activeMenu.offset().top -
        $optionParent.offset().top -
        ((optionIndex * 24) + 10) +
        (fullOptionIndex * 5) +
        100
    );


    timelines.animateOptionSelection(optionParent, translateY, sectionId, () => {
        closeMenuAfterSelection(parentParent, clickTarget);
    });

    $(this).addClass("selected");
});
// debugger;
$(document).on('click', '.option2.grey', function () {

    var selectedOption = selectedOptionFinal.target || false;
    var optinSelector = utils.getClassNameFromObj(selectedOption);
    if (!optinSelector) return;
    debugger;
    timelines.animateGreyOptions(selectedOptionFinal, state, optinSelector);
});

$(document).ready(function () {
    window.scrollTo(0, 0);
    start();
});
