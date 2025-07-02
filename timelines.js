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
