(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./timelines":2,"./utils":3}],2:[function(require,module,exports){
const utils = require('./utils');

module.exports = {
    rollOutMenu(color, menu, animationCountObj, state) {
        $(menu + " .r1, " + menu + " .r2, " + menu + " .r3, " + menu + " .r4").css({
            opacity: 0,
            transform: "rotateZ(0deg)"
        });

        const tl = anime.createTimeline({
            defaults: {
                easing: "easeOutExpo",
                duration: 1000
            },
            onComplete: function () {
                jQuery(menu + " .rollout").each(function (i, v) {
                    if (!jQuery(v).hasClass("hide")) {
                        jQuery(v).addClass("hide");
                    }
                });

                animationCountObj.value++;
                if (animationCountObj.value === 6 && state.locked === true) {
                    state.locked = false;
                    state.startingAnimationDone = true;
                }
            }
        });

        const openingRotation1 = utils.getRandomRotation();
        const openingRotation2 = utils.getRandomRotation();
        const openingRotation3 = utils.getRandomRotation();
        const openingRotation4 = utils.getRandomRotation();

        if (!document.querySelector(menu + " .r1")) return;

        tl.add(menu + " .r1", {
            rotateZ: openingRotation1,
            easing: "easeOutElastic(1, .6)",
            opacity: 1
        })
        .add(menu + " .r2", {
            opacity: 1
        }, "-=200")
        .add(menu + " .r2", {
            rotateZ: openingRotation2,
            easing: "easeOutElastic(1, .6)"
        }, "-=800")
        .add(menu + " .r3", {
            opacity: 1
        }, "-=200")
        .add(menu + " .r3", {
            rotateZ: openingRotation3,
            easing: "easeOutElastic(1, .6)"
        }, "-=800")
        .add(menu + " .r4", {
            opacity: 1
        }, "-=200")
        .add(menu + " .r4", {
            rotateZ: openingRotation4,
            easing: "easeOutElastic(1, .6)"
        }, "-=850")
        .add(color + ".option", {
            opacity: 0,
            easing: "easeOutExpo"
        }, "-=400")
        .add(color + ".option", {
            opacity: 1,
            easing: "easeOutExpo"
        }, "-=400");
    },

    flipUpSecondary(menu) {
        // Only set opacity, do not reset transform (let anime.js handle it)
        $(menu + " .secondary_list .option2").css({
            opacity: 0
        });
        // $(menu + " .secondary_list .option2").attr('style', 'opacity: 0;'); // Reset styles
        // debugger;
        const subOptions = menu + " .secondary_list .option2";
        const allOptions = document.querySelectorAll(subOptions);

        const optionHeight = 32;
        let stackY = optionHeight;

        allOptions.forEach(function (option, index) {
            const tl = anime.createTimeline({
                defaults: {
                    duration: 800
                }
            });
            // 1. Fade in and slide right
            tl.add(option, {
                opacity: [0],
                easing: 'easeOutCubic',
                duration: 120,

            }).add(option, {
                opacity: [0, 1],
                translateX: [80, 80],
                easing: 'easeOutCubic',
                duration: 120,
                delay: index * 350
            }, "-=60").add(option, {
                translateY: -stackY,
                easing: 'easeOutCubic',
                duration: 120
            }).add(option, {
                translateX: -50,
                easing: 'easeOutCubic',
                duration: 120
            });
            stackY += optionHeight;
        });
    },

    openMenu(menuNumber, closedItself, flipUpSecondary) {

        if (!closedItself) {
            const tl = anime.createTimeline({
                defaults: {
                    easing: "easeOutExpo",
                    duration: 600
                },
                onComplete: function () {
                    jQuery(menuNumber + " .option").addClass("fullopen");
                    if (flipUpSecondary) flipUpSecondary(menuNumber);
                }
            });

            tl.add(menuNumber + " .option", {
                width: "800px",
                scaleX: 1
            })
            .add(menuNumber + " .extend_option", {
                opacity: 1
            })
            .add(menuNumber + " .extend_option", {
                width: "500px",
                easing: 'easeOutElastic(1, .6)'
            }, "-=500");
        }
    },

    openWarningMenu(menuNumber, translateY, flipUpSecondary) {
        // debugger;
        const tl = anime.createTimeline({
            defaults: {
                easing: "easeOutExpo",
                duration: 1000
            },
            onComplete: function () {
                // debugger;
                jQuery(menuNumber + " .option").addClass("fullopen");
                utils.showAndUpdateInfo("warning");
            }
        });

        tl.add(menuNumber + " .option", {
            width: "800px",
            scaleX: 1,
            easing: "easeInElastic(1, .6)"
        })
        .add(menuNumber + " .extend_option", {
            opacity: 1,
            onBegin: function () {
                // debugger;
            }
        })
        .add(menuNumber + " .extend_option", {
            width: "500px",
            easing: 'easeOutCubic',
            onBegin: function () {
                // debugger;
            }
        })
        .add(menuNumber + " .extend_option", {
            keyframes: [
                { rotateZ: 0, scaleX: 1 },
                { rotateZ: -10, scaleX: 1.04 }, // gentle pull left, slight stretch
                { rotateZ: 7, scaleX: 0.98 },   // gentle overshoot right, slight compress
                { rotateZ: -5, scaleX: 1.02 },  // dampen left, less stretch
                { rotateZ: 3, scaleX: 0.99 },   // dampen right, less compress
                { rotateZ: -1, scaleX: 1.01 },  // almost free
                { rotateZ: 0, scaleX: 1 }       // settle
            ],
            duration: 750,
            easing: 'easeOutElastic(1, .8)'
        })
        .add(menuNumber + " .extend_option", {
            keyframes: [
                { translateX: "0%" },     // still stuck
                { translateX: "-3%" },    // tiny pull back (resistance)
                { translateX: "18%" },    // snap forward, overshoot
                { translateX: "13%" },    // settle back a bit
                { translateX: "15%" }     // final position
            ],
            duration: 420,
            easing: "easeOutElastic(1, .7)"
        })
        .add(menuNumber + " .extend_option", {
            translateY: translateY,
            easing: "easeOutCubic"
        })
        .add(".view", {
            opacity: 1,
            easing: "easeOutCubic",
            translateY: 0,
            translateX: 0,
            onBegin: function () {
                utils.moveOptionToView(menuNumber + " .extend_option");
            }
        })
        .add("body, html", {
            scrollTop: jQuery('.view').offset().top,
        }, "-=500")
        .add(menuNumber + " .option", { //reset
            width: "600px",
            easing: "easeOutCubic"
        })
    },
    openMapsMenu(menuNumber, translateY, flipUpSecondary) {
        // debugger;
        const tl = anime.createTimeline({
            defaults: {
                easing: "easeOutExpo",
                duration: 1000
            },
            onComplete: function () {
                // debugger;
                // jQuery(menuNumber + " .option").addClass("fullopen");
                // utils.showAndUpdateInfo("maps");
            }
        });
        debugger;
        tl.add(menuNumber + " .option", {
            width: "800px",
            scaleX: 1,
            easing: "easeInElastic(1, .6)"
        })
        .add(menuNumber + " .extend_option", {
            opacity: 1
        })
        .add(menuNumber + " .extend_option", {
            width: "500px",
            easing: 'easeOutCubic'
        })
        .add(menuNumber + " .extend_option", { // Dedicated "flick up" animation
            keyframes: [
                { rotateZ: 0, translateY: 0, easing: 'easeOutSine', duration: 0 },
                { rotateZ: -8, translateY: -15, easing: 'easeOutSine', duration: 150 }, // Flick up and slightly rotated
                { rotateZ: 0, translateY: 0, easing: 'easeInSine', duration: 200 } // Snap back to original position
            ],
            transformOrigin: '0% 50%',
            duration: 350,
            easing: 'linear'
        }, "-=100")
        .add(menuNumber + " .option2", {
            opacity: 1,
            keyframes: [
                { translateX: 0, translateY: 0, rotateZ: 0, opacity: 1, duration: 0 },
                { translateX: 300, translateY: -150, rotateZ: 360, opacity: 1, duration: 500, easing: 'easeOutCubic' },
                { translateX: 300, translateY: 200, rotateZ: 720, opacity: 1, duration: 700, easing: 'easeInCubic' }
            ],
            duration: 1200,
            easing: "linear"
        }, "-=250")
        .add(menuNumber + " .option2", {
            translateY: translateY,
            easing: "easeOutCubic",
            onBegin: function () {
                jQuery(menuNumber + " .option").addClass("fullopen");
                utils.showAndUpdateInfo("maps");
            }
        })
        .add(".view", {
            opacity: 1,
            easing: "easeOutCubic",
            translateY: 0,
            translateX: 0,
            onBegin: function () {
                utils.moveOptionToView(menuNumber + " .option2");
            }
        })
        .add("body, html", {
            scrollTop: jQuery('.view').offset().top,
        }, "-=500")
        .add(menuNumber + " .option", { //reset
            width: "600px",
            easing: "easeOutCubic",
            onBegin: function () {  
                 $(".thirdMenu .extend_option").attr('style', 'opacity:0;')
            }
        })
    },
    animateOptionSelection(optionParent, translateY, sectionId, callback) {
        const tl = anime.createTimeline({
            defaults: { duration: 1000 },
            onComplete: function () {
                
                callback();
            }
        });
        // debugger;
        // const aniStyleRand = utils.getRandomRotation();
        // if(aniStyleRand === "180") {
            tl.add(optionParent, {
                opacity: 1,
                translateX: "180px", // or "300px" if you know the width
                easing: "easeOutCubic"
            })
            .add(optionParent, {
                translateY: translateY,
                easing: 'cubicBezier(0.22, 1, 0.36, 1)',
                duration: 600
            })
            .add(optionParent, {
                translateY: 0,
                translateX: 0,
                onBegin: function () {
                    utils.moveOptionToView(optionParent);
                    utils.showAndUpdateInfo(sectionId);
                },
            })
            .add(".view", {
                opacity: 1,
                easing: "easeOutCubic"
            })
            .add("body, html", {
                scrollTop: jQuery('.view').offset().top,
            }, "-=500")
        // } else {
            //jQuery(optionParent).siblings() shoot to the left and disapear
            // optionParent drops to the bottom of the page like gravity after a beat stuck in the air. cartoon style
            //run the rest 
            // tl.add(jQuery(optionParent).siblings().get(), {
            //     translateX: -400,
            //     opacity: 0,
            //     easing: "easeInExpo",
            //     duration: 320
            // });

            // // 2. Selected option pauses, then drops down with gravity (cartoon style)
            // tl.add(optionParent, {
            //     // Pause in place for a beat
            //     duration: 200
            // })
            // .add(optionParent, {
            //     translateY: 600, // Drop to bottom (adjust as needed)
            //     easing: "cubicBezier(0.23, 1, 0.32, 1.2)", // Gravity/bounce feel
            //     duration: 700
            // });

            // // 3. Run the rest (move to view, update info, etc.)
            // tl.add(optionParent, {
            //     translateY: 0,
            //     translateX: 0,
            //     opacity: 1,
            //     easing: "easeOutCubic",
            //     duration: 200,
            //     onBegin: function () {
            //         utils.moveOptionToView(optionParent);
            //         utils.showAndUpdateInfo(sectionId);
            //     }
            // })
            // .add(".view", {
            //     opacity: 1,
            //     easing: "easeOutCubic"
            // })
            // .add("body, html", {
            //     scrollTop: jQuery('.view').offset().top,
            // }, "-=500");
        // }
    },

    animateGreyOptions(selectedOptionFinal, state, optinSelector) {
        // debugger;
        const t1 = anime.createTimeline({
            defaults: { duration: 500 },
            onComplete: function () {
                // debugger;
                const $grey = $('.option2.grey');
                $grey.css({
                    'transform': '',
                    'right': '',
                    'opacity': '',
                    'position': '',
                    'top': '',
                    'left': ''
                });

                $('.activeOption').append($grey);
                debugger;
                selectedOptionFinal.target
                    .appendTo($(selectedOptionFinal.parent))
                    .insertAfter($(selectedOptionFinal.parent.find('.option2')).eq(selectedOptionFinal.position));
                selectedOptionFinal.target.removeClass('selected');
                selectedOptionFinal.target.removeAttr("style");
                selectedOptionFinal.target.css({
                    'opacity': 0,
                    'backface-visibility': 'hidden',
                });

                state.locked = false;
            }
        });
        debugger;
        t1.add(['.option2.grey', optinSelector], {
            translateX: "-400px",
            easing: "easeOutExpo"
        })
        .add("body, html", {
            scrollTop: $('.background').offset().top,
            easing: "easeInElastic(1, .6)"
        });
    },

    removeFlipUp(closeMenu, state) {
        // debugger;
        const menuNumber = "." + $(closeMenu).parent().parent()[0].className.split(" ")[0];
        const subOptions = menuNumber + " .secondary_list .option2";

        // Only set opacity, do not reset transform (let anime.js handle it)
        $(subOptions).css({
            opacity: 1
        });

        const tl = anime.createTimeline({
        defaults: {
            easing: "easeInQuad",
            duration: 500
        },
        onComplete: function () {
            // Reset styles and classes
            $(subOptions).each(function (_, el) {
                $(el).css('opacity', 0);
                // Do not reset transform here
                $(el).removeClass("sticky");
            });
            $(menuNumber + " .secondary_list").addClass("sticky");
            state.locked = false;
            $(menuNumber + " .option").removeClass('fullopen');
            utils.removeTransformsFromSecondMenu(menuNumber);
        }
    });

    // Animate .extend_option closing
    tl.add({
        targets: menuNumber + " .extend_option",
         width: "100px",
        easing: "easeInQuad"
    }).add({
        targets: menuNumber + " .extend_option",
        opacity:0
    }).add({
        targets: subOptions,
        translateY: "2000px",
        easing: 'easeOutElastic(1, .6)'
    }, "-=200");

    },

    hoverOption(selector) {
        if (!selector) return;
        const el = document.querySelector(selector);
        if (!el) return;
        el.style.transformOrigin = "left center";
        anime.animate(selector, {
            keyframes: [
                { scaleX: 1 },
                { scaleX: 0.92 }
            ],
            duration: 200,
            easing: 'out(2)'
        });
    },

    unhoverOption(selector) {
        if (!selector) return;
        const el = document.querySelector(selector);
        if (!el) return;
        el.style.transformOrigin = "left center";
        anime.animate(selector, {
            keyframes: [
                { scaleX: 0.92 },
                { scaleX: 1 }
            ],
            duration: 200,
            easing: 'out(2)'
        });
    }
};

},{"./utils":3}],3:[function(require,module,exports){
module.exports = {
    getClassNameFromObj(el) {
        if (!el || el.length === 0) return false;
        var className = el[0].className;
        var selector = "." + className.replace(/ /g, ".");
        return selector;
    },
    getRandomRotation() {
        return Math.random() <= 0.5 ? "180" : "-180";
    },
    moveOptionToView(targetEl) {
        var rightDist = '200px';
        // debugger;
        $(targetEl)
            .appendTo('.activeMenu')
            .insertAfter('.activeMenu .option2.grey')
            .css({
                'align-self': 'flex-start',
                'position': 'relative',
                'transform': 'none',
                'right': rightDist,
                'width': '200px',
                'height': '25px',
                'z-index': '99999',
            });
    },
    removeTransformsFromSecondMenu(menuNumber) {
        return new Promise((resolve) => {
            anime.animate(menuNumber + ' .option2', {
                opacity: 0,
                duration: 200,
                easing: 'easeOutExpo',
                complete: resolve
            });
        });
    },
showAndUpdateInfo(sectionId) {
    // Map option names to parent section IDs and background images
 const optionToSection = {
    // Foreword and directions
    "foreword": { section: "foreward", bg: 'images/about-me.png', bgColor: '#451f43' },
    "up": { section: "foreward", bg: 'images/about-me.png', bgColor: '#451f43' },
    "down": { section: "foreward", bg: 'images/about-me.png', bgColor: '#451f43' },
    "left": { section: "foreward", bg: 'images/about-me.png', bgColor: '#451f43' },
    "right": { section: "foreward", bg: 'images/about-me.png', bgColor: '#451f43' },

    // Who/What/When/Where/How -> work
    "who": { section: "work", bg: 'images/work.png', bgColor: '#077e7a' },
    "what": { section: "work", bg: 'images/work.png', bgColor: '#077e7a' },
    "when": { section: "work", bg: 'images/work.png', bgColor: '#077e7a' },
    "where": { section: "work", bg: 'images/work.png', bgColor: '#077e7a' },
    "how": { section: "work", bg: 'imageswork.png', bgColor: '#077e7a' },

    // Hitchhiking
    "dolphins": { section: "hitchhiking", bg: 'images/coding.png', bgColor: '#22223b' },
    "vogons": { section: "hitchhiking", bg: 'images/coding.png', bgColor: '#22223b' },
    "mattresses": { section: "hitchhiking", bg: 'images/coding.png', bgColor: '#22223b' },
    "humans": { section: "hitchhiking", bg: 'images/coding.png', bgColor: '#22223b' },

    // Maps (NYC and earth)
    "new york city": { section: "maps", bg: 'images/nyc.png', bgColor: '#1a69b1' },
    "earth": { section: "maps", bg: 'images/nyc.png', bgColor: '#1a69b1' },

    // Hobby
    "flying": { section: "hobby", bg: 'images/3dprint.png', bgColor: '#613655' },
    "grammar": { section: "hobby", bg: 'images/3dprint.png', bgColor: '#613655' },

    // Interests
    "space": { section: "interests", bg: 'images/3dprint.png', bgColor: '#613655' },
    "towels": { section: "interests", bg: 'images/3dprint.png', bgColor: '#613655' },

    // WARNING
    "space": { section: "warning", bg: 'images/3dprint.png', bgColor: '#613655' },

    // Parent-level section IDs for backward compatibility
    "foreward": { section: "foreward", bg: 'images/about-me.png', bgColor: '#451f43' },
    "work": { section: "work", bg: 'images/about-me.png', bgColor: '#451f43' },
    "hitchhiking": { section: "hitchhiking", bg: 'images/about-me.png', bgColor: '#22223b' },
    "maps": { section: "maps", bg: 'images/nyc.png', bgColor: '#1a69b1' },
    "hobby": { section: "hobby", bg: 'images/3dprint.png', bgColor: '#613655' },
    "interests": { section: "interests", bg: 'images/3dprint.png', bgColor: '#613655' }
};
    // Normalize input
    const key = (sectionId || "").trim().toLowerCase();
    const info = optionToSection[key] || optionToSection["foreword"];
    console.log('showing: ' + info.section + ' with bg: ' + info.bg);
    // Hide all, show only the selected section
    // debugger;
    const sections = ["foreward", "work", "hitchhiking", "maps", "hobby", "interests"];
    sections.forEach(id => {
        if (id !== info.section) {
            $('.' + id).hide();
            // $('.' + id).removeClass('hidden');
        } else {
            $('.' + id).show();
        }
    });

    // Update background for the selected section
    // if(info.section === "hitchhiking") {
    //     $('.' + info.section).css({
    //         'background-color': info.bgColor,
    //          'background-repeat': 'no-repeat',
    //         'background-position': 'right center',
    //         'background-size': 'auto 80%'
    //      });
    // }
    // $('.' + info.section).css('background-image', `url("${info.bg}")`);
},
   
    getSectionIdFromOptionText(optionText) {
        optionText = optionText.trim().toLowerCase();
        if (optionText === "up" || optionText === "foreword") return "foreward";
        if (optionText === "down" || optionText === "left" || optionText === "right") return "foreward";
        if (["dolphins", "vogons", "mattresses", "humans"].includes(optionText)) return "hitchhiking";
        if (optionText === "new york city") return "maps";
        if (["flying", "grammar", "space", "towels", "earth"].includes(optionText)) return "interests";
        if (["who", "what", "where", "why", "how"].includes(optionText)) return "foreward";
        return null;
    },
    freezeOptionsInPlace(options) {
        const positions = [];
        options.each(function(index) {
            const $el = $(this);
            const offset = $el.offset();
            positions.push({
                el: $el,
                left: 250, // fixed offset from left edge of .secondary_list
                top: index * 33,
                width: $el.width(),
                height: $el.height()
            });
        });

        options.each(function(index) {
            const pos = positions[index];
            pos.el.css({
                position: 'absolute',
                // top: pos.top - pos.el.parent().offset().top,
                // left: pos.left - pos.el.parent().offset().left,
                width: pos.width,
                height: pos.height,
                margin: 0,
                zIndex: 1000
            });
            // Only clear transform before animation, not after
            pos.el.css('transform', '');
        });

        jQuery('.secondary_list').css({
            width: '505px',
        });
    }

};

},{}]},{},[1]);
