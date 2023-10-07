const anime = require('animejs');

let locked = false;
let startingAnimationDone = false;
let clickedMenu = false;
let greenTimeout;
let tealTimeout;
let blueTimeout;
let orangeTimeout;
let darkpurpleTimeout;
let redTimeout;

//roll out start animation

var rollOutMenu = function (color, menu) {
    var tl = anime.timeline({
        easing: "easeOutExpo",
        duration: 1000,
        complete: function () {
            //after it all completes allow other controls
            startingAnimationDone = true;
            jQuery(menu + " .rollout").each(function (i, v) {
                jQuery(v).addClass("hide");
            });
        }
    });

    let openingRotation1 = Math.random() <= 0.5 ? "180" : "-180"
    let openingRotation2 = Math.random() <= 0.5 ? "180" : "-180"
    let openingRotation3 = Math.random() <= 0.5 ? "180" : "-180"
    let openingRotation4 = Math.random() <= 0.5 ? "180" : "-180"

    console.log(color + ".option");

    tl.add({
            targets: menu + " .r1",
            rotateZ: openingRotation1,
            easing: "spring(1, 100, 40, 0)"
        })
        .add({
                targets: menu + " .r2",
                opacity: 1
            },
            "-=200"
        )
        .add({
                targets: menu + " .r2",
                rotateZ: openingRotation2, //was neg
                easing: "spring(1, 100, 50, 0)"
            },
            "-=800"
        )
        .add({
                targets: menu + " .r3",
                opacity: 1
            },
            "-=200"
        )
        .add({
                targets: menu + " .r3",
                rotateZ: openingRotation3,
                easing: "spring(1, 80, 70, 0)"
            },
            "-=800"
        )
        .add({
                targets: menu + " .r4",
                opacity: 1
            },
            "-=200"
        )
        .add({
                targets: menu + " .r4",
                rotateZ: openingRotation4, //was neg
                easing: "spring(1, 100, 70, 0)"
            },
            "-=850"
        ).add({
            targets: color + ".option",
            opacity: 0,
            easing: "easeOutExpo"
        }, "-=400")
        .add({
            targets: color + ".option",
            opacity: 1,
            easing: "easeOutExpo"
        }, "-=400");
};

var start = function () {
    const menuData = [{
            color: ".purple",
            menu: ".firstMenu",
            delay: 500
        },
        {
            color: ".teal",
            menu: ".secondMenu",
            delay: 750
        },
        {
            color: ".green",
            menu: ".thirdMenu",
            delay: 1000
        },
        {
            color: ".orange",
            menu: ".fourthMenu",
            delay: 1250
        },
        {
            color: ".red",
            menu: ".fifthMenu",
            delay: 1500
        },
        {
            color: ".darkpurple",
            menu: ".sixthMenu",
            delay: 1750
        }
    ];

    menuData.forEach(({
        color,
        menu,
        delay
    }) => {
        setTimeout(() => {
            rollOutMenu(color, menu);
        }, delay);
    });
};

//hide any maxed option
//if not current max
//open clicked
jQuery(document).on("click", ".hoverFix .option", function () {
    locked = !locked;

    console.log("are we locked");
    console.log(locked);

    clickedMenu = $(this);

    //if open already. close itself
    //if another open, close the opened
    var closedItself = false;
    var closeMenu = $(this);

    if ($(this).hasClass("fullopen")) {
        closedItself = true;
        locked = false;
        removeFlipUp(closeMenu, closedItself);
    } else {
        locked = true;
        openMenu(closeMenu, false);
    }

});


var removeTransformsFromSecondMenu = function (menuNumber) {
    jQuery(menuNumber + ' .option2').each(function (_, i) {
        jQuery(i).css('backface-visibility', 'hidden');
        jQuery(i).css('transform', '')
    })
    console.log('here');
}

$(document).on('mouseenter', '.hoverFix', function (event) {
    var selector = getClassNameFromObj($(this).find(".option"));
    // console.log(selector)
    if (!locked) {
        anime({
            targets: selector,
            width: "550px",
            easing: 'easeOutElastic(1, .3)',
            direction: "backwards",
            loop: false,
            duration: 100
        }).finsished;
    }
}).on('mouseleave', '.hoverFix', function (event) {
    if (!locked) {
        var selector = getClassNameFromObj($(this).find(".option"));
        anime({
            targets: selector,
            width: "600px", // -> from '28px' to '100%',
            easing: "easeInOutQuad",
            direction: "backwards",
            loop: false,
            duration: 100
        }).finsished;
    }
})

function getClassNameFromObj(el) {
    if (el.length == 0) return false;
    var className = el[0].className;
    var selector = "." + className.replace(" ", ".");
    return selector;
};

function openMenu(closeMenu, closedItself) {
    console.log("open menu");
    console.log("Did I close myself: " + !closedItself);
    if (!closedItself) {

        var menuNumber = "." + $(closeMenu).parent().parent()[0].className.split(" ")[0]
        var tl = anime.timeline({
            easing: "easeOutExpo",
            duration: 600,
            complete: function () {
                jQuery(menuNumber + " .option").addClass("fullopen")
                flipUpSecondary(menuNumber);
            }
        });

        tl.add({
                targets: menuNumber + " .option",
                width: "800px"
            })
            .add({
                targets: menuNumber + " .extend_option",
                opacity: 1,
            })
            .add({
                    targets: menuNumber + " .extend_option",
                    width: "500px",
                    easing: 'easeOutElastic(1, .6)'
                },
                "-=500"
            );
    }
};

var closeMenuAfterSelection = function (singleMenu, listMenu) {
    debugger;
}

jQuery(document).on('click', '.option2', function (el) {
    //move selected to bottom

    const currentTarget = jQuery(el.currentTarget);
    const parentParent = currentTarget.parent().parent();
    const activeMenu = jQuery('.activeMenu');

    const clickTarget = getClassNameFromObj(currentTarget);
    const parentClickTarget = getClassNameFromObj(parentParent);
    const secondMenu = getClassNameFromObj(currentTarget.parent());
    const optionIndex = currentTarget.index() + 1;
    const fullOptionIndex = parentParent.index() + 2;


    var translateY = (jQuery('.activeMenu').offset().top - jQuery(parentClickTarget + " " + clickTarget).offset().top - ((optionIndex * 24) + 10) + (fullOptionIndex * 5) + 100);
    var test2 = (jQuery('.activeMenu').offset().top - jQuery(parentClickTarget + " " + clickTarget).offset().top - ((optionIndex * 24) + 10) + (fullOptionIndex * 7) + 100);

    var tl = anime.timeline({
        duration: 1000,
        complete: function () {
            //reset menu
            closeMenuAfterSelection(secondMenu, clickTarget);
        }
    });

    tl.add({
            targets: parentClickTarget + " " + clickTarget,
            translateX: "15%",
            easing: "easeOutCubic"
        }).add({
            targets: parentClickTarget + " " + clickTarget,
            translateY: translateY,
            easing: "easeOutCubic"
        })
        .add({
            targets: parentClickTarget + " " + clickTarget,
            translateY: test2,
            easing: "easeOutCubic"
        })
        .add({
            targets: parentClickTarget + " " + clickTarget,
            translateX: "-70vw",
            easing: "easeOutCubic"
        })
        .add({
            targets: ".view",
            opacity: "1"
        })
    // .add({
    //     targets: ".background",
    //     translateY: "-85vh",
    //     easing: "easeInOutCubic"
    // }).add({
    //     targets: ".view",
    //     height: "85vh",
    //     easing: "easeInOutCubic"
    // })
    //move entire menu up
})

function flipUpSecondary(menu) {
    console.log("FLIPPIGN OUT")

    var subOptions = menu + " .secondary_list .option2"

    var tl = anime.timeline({
        duration: 500,
        complete: function () {

        }
    });


    tl.add({
            targets: subOptions + ".orange",
            opacity: 0,
        }).add({
            targets: subOptions + ".orange",
            translateX: "125px",
            easing: 'easeInOutSine',
            opacity: 1,
        })
        .add({
            targets: subOptions + ".orange",
            translateY: "-25px"
        }, "-=300")
        .add({
            targets: subOptions + ".orange",
            translateX: "-50px"
        }, "-=200")
        .add({
            targets: subOptions + ".red",
            translateX: "125px",
            opacity: 1
        })
        .add({
            targets: subOptions + ".red",
            translateY: "-50px"
        }, "-=300")
        .add({
            targets: subOptions + ".red",
            translateX: "-50px"
        }, "-=200")
        .add({
            targets: subOptions + ".purple",
            translateX: "130px",
            opacity: 1,
        }, "-=200")
        .add({
            targets: subOptions + ".purple",
            translateY: "-75px"
        }, "-=200")
        .add({
            targets: subOptions + ".purple",
            translateX: "-50px"
        }, "-=200")
        .add({
            targets: subOptions + ".teal",
            translateX: "130px",
            opacity: 1
        }, "-=200")
        .add({
            targets: subOptions + ".teal",
            translateY: "-100px"
        }, "-=200")
        .add({
            targets: subOptions + ".teal",
            translateX: "-50px"
        }, "-=200")

};

function removeFlipUp(closeMenu, closedItself) {
    var menuNumber = "." + $(closeMenu).parent().parent()[0].className.split(" ")[0]
    var subOptions = menuNumber + " .secondary_list .option2"

    var tl = anime.timeline({
        easing: "easeInQuad",
        duration: 500,
        complete: function () {

            jQuery(subOptions).each(function (i, v) {
                jQuery(v).addClass("sticky");
            });

            jQuery(menuNumber + " .secondary_list").addClass("sticky")

            var t2 = anime.timeline({
                duration: 500,
                complete: function () {
                    console.log("removed flip up complete 2")

                    //hide after collapse
                    jQuery(menuNumber + ' .option2').each(function (_, i) {
                        jQuery(i).css('opacity', 0);
                        jQuery(i).removeClass("sticky");
                        jQuery(i).css('visibility', 'hidden');
                    })

                    locked = false;
                    jQuery(`${menuNumber} .option`).removeClass('fullopen');

                    removeTransformsFromSecondMenu(menuNumber);

                }
            });

            t2.add({
                    targets: menuNumber + " .option",
                    width: "550px",
                    easing: "spring(1, 100, 70, 0)"
                }, "-=200")
                .add({
                    targets: [subOptions + ".orange", subOptions + ".red", subOptions + ".purple", subOptions + ".teal"],
                    translateY: "800px",
                    easing: "easeOutExpo"
                }).add({
                    targets: [subOptions + ".orange", subOptions + ".red", subOptions + ".purple", subOptions + ".teal"],
                    translateY: "750px",
                    easing: "easeInExpo",
                    duration: 500
                }).add({
                    targets: menuNumber + " .option",
                    width: "600px",
                    easing: "easeOutCubic"
                })
        }
    });

    // var menuNumber = "." + $(closeMenu).parent().parent()[0].className.split(" ")[0]

    tl.add({
        targets: menuNumber + " .extend_option",
        width: "100px"
    }).add({
        targets: menuNumber + " .extend_option",
        opacity: 0
    }, "-=400")

};

start();