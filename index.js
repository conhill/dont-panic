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

    $(option2Selector).css({
        'opacity': 0,
        'transform': 'none'
    }).removeClass("sticky");

    $(optionSelector).removeClass('fullopen').css('width', '600px');
    $(extendedOptionSelector).css({
        'width': '250px',
        'opacity': 0
    });

    utils.removeTransformsFromSecondMenu(singleMenuClass);
};

function setSelectedOption(currentTarget) {
    selectedOptionFinal.target = currentTarget;
    selectedOptionFinal.position = currentTarget.closest('.secondary_list').find('.option2:not(.extend_option)').index(currentTarget);
    selectedOptionFinal.parent = currentTarget.closest('.secondary_list');
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

function flipUpSecondary(menu) {
    timelines.flipUpSecondary(menu);
}

function removeFlipUp(closeMenu) {
    timelines.removeFlipUp(closeMenu, state);
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

$(document).on("click", ".hoverFix .option", function () {
    if (state.locked && !$(this).hasClass("fullopen")) return;
    const closeMenu = $(this);
    const menuNumber = closeMenu.parent().parent();
    if (!menuNumber.length) return;

    if (!state.locked) {
        state.locked = true;
        const menuSelector = "." + menuNumber[0].className.split(" ")[0];

        if ($(menuSelector).find('.extend_option.warning').length > 0) {
            openWarningMenu(menuSelector);
        } else {
            openMenu(menuSelector, false);
        }
    } else if ($(this).hasClass("fullopen")) {
        removeFlipUp(closeMenu, true);
    }
});

$(document).on('click', '.secondary_list .option2:not(.grey)', function (el) {
    state.locked = false;
    const currentTarget = $(el.currentTarget);
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
    const sectionId = utils.getSectionIdFromOptionText(optionText);
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

    timelines.animateGreyOptions(selectedOptionFinal, state, optinSelector);
});

$(document).ready(function () {
    start();
});
