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
        $(menu + " .secondary_list .option2").css({
            opacity: 0,
            transform: 'none'
        });
        const tl = anime.createTimeline({
            defaults: {
                duration: 400
            },
            onComplete: function () {
                console.log("Animation complete");
            }
        });

        const subOptions = menu + " .secondary_list .option2";
        const allOptions = document.querySelectorAll(subOptions);

        let stackY = 33;
        allOptions.forEach(function (option, index) {
            tl.add(option, {
                translateX: 0,
            }).add(option, {
                opacity: 1,
                translateX: '100px',
                easing: 'easeOutQuad',
            }).add(option, {
                translateY: -stackY,
                easing: 'easeOutQuad',
                delay: index * 100
            });
            tl.add(option, {
                translateX: "-50px",
                easing: 'easeOutQuad'
            });
            stackY += option.offsetHeight + 3;
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
                jQuery(menuNumber + " .option").addClass("fullopen");
                if (flipUpSecondary) flipUpSecondary(menuNumber);
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

    animateOptionSelection(optionParent, translateY, sectionId, callback) {
        const tl = anime.createTimeline({
            defaults: { duration: 1000 },
            onComplete: function () {
                
                callback();
            }
        });
        // debugger;
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
                utils.updateDisplayInfo(sectionId);
            },
        })
        .add(".view", {
            opacity: 1,
            easing: "easeOutCubic"
        })
        .add("body, html", {
            scrollTop: jQuery('.view').offset().top,
        }, "-=500")
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
        // debugger;
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
        const menuNumber = "." + $(closeMenu).parent().parent()[0].className.split(" ")[0];
        const subOptions = menuNumber + " .secondary_list .option2";

        const tl = anime.createTimeline({
            defaults: {
                easing: "easeInQuad",
                duration: 500
            },
            onComplete: function () {
                jQuery(subOptions).each(function (i, v) {
                    jQuery(v).addClass("sticky");
                });

                jQuery(menuNumber + " .secondary_list").addClass("sticky");

                const t2 = anime.createTimeline({
                    defaults: {
                        duration: 500
                    },
                    onComplete: function () {
                        console.log("removed flip up complete 2");
                        jQuery(menuNumber + ' .option2').each(function (_, i) {
                            jQuery(i).css('opacity', 0);
                            jQuery(i).css('transform', 'none');
                            jQuery(i).removeClass("sticky");
                        });

                        state.locked = false;
                        jQuery(`${menuNumber} .option`).removeClass('fullopen');

                        utils.removeTransformsFromSecondMenu(menuNumber);
                    }
                });

                t2.add(menuNumber + " .option", {
                    width: "550px",
                    easing: 'easeOutElastic(1, .6)'
                }, "-=200")
                .add([
                    subOptions + ".green",
                    subOptions + ".orange",
                    subOptions + ".red",
                    subOptions + ".purple",
                    subOptions + ".teal"
                ], {
                    translateY: "750px",
                    easing: 'easeOutElastic(1, .6)'
                })
                .add(menuNumber + " .option", {
                    width: "600px",
                    easing: "easeOutCubic"
                });
            }
        });

        tl.finished.then(() => {
            jQuery(subOptions).each(function (i, v) {
                jQuery(v).addClass("sticky");
            });

            jQuery(menuNumber + " .secondary_list").addClass("sticky");

            const t2 = anime.createTimeline({
                defaults: {
                    duration: 500
                },
            });
            t2.finished.then(() => {
                console.log("removed flip up complete 2");
                jQuery(menuNumber + ' .option2').each(function (_, i) {
                    jQuery(i).css('opacity', 0);
                    jQuery(i).css('transform', 'none');
                    jQuery(i).removeClass("sticky");
                });

                state.locked = false;
                jQuery(`${menuNumber} .option`).removeClass('fullopen');

                utils.removeTransformsFromSecondMenu(menuNumber);
            });

            t2.add(menuNumber + " .option", {
                width: "550px",
                easing: 'easeOutElastic(1, .6)'
            }, "-=200")
            .add([
                subOptions + ".green",
                subOptions + ".orange",
                subOptions + ".red",
                subOptions + ".purple",
                subOptions + ".teal"
            ], {
                translateY: "750px",
                easing: 'easeOutElastic(1, .6)'
            })
            .add(menuNumber + " .option", {
                width: "600px",
                easing: "easeOutCubic"
            });
        });
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
