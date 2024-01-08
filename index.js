const anime = require('animejs');

let locked = false;
let selectedOptionFinal = {
    target: undefined,
    position: 0,
    parent: undefined
};
let animationCount = 0;

////////////////////////////////////////////////////////////////


// HELPERS


////////////////////////////////////////////////////////////////

function getRandomRotation() {
    return Math.random() <= 0.5 ? "180" : "-180";
}

// Function to add class and hide elements
function hideElements(selector) {
    jQuery(selector).each(function (i, v) {
        jQuery(v).addClass("hide");
    });
}

const removeTransformsFromSecondMenu = function (menuNumber) {
    return new Promise((resolve) => {
        anime({
            targets: menuNumber + ' .option2',
            opacity: 0,
            easing: 'easeOutExpo',
            complete: () => {
                // Resolve the promise when the animation is complete
                resolve();
            }
        });
    });
};


function getClassNameFromObj(el) {
    if (!el || el.length === 0) return false;
    var className = el[0].className;
    var selector = "." + className.replace(/ /g, ".");
    return selector;
}

function moveOptionToView(targetEl) {
    var rightDist = '75px';

    jQuery(targetEl)
        .appendTo('.activeMenu')
        .insertAfter('.activeMenu .option2.grey')
        .css({
            'align-self': 'flex-start',
            'position': 'relative',
            'transform': 'none',
            'right': rightDist
        });
}

var closeMenuAfterSelection = function (singleMenu, listMenu) {
    var singleMenuClass = getClassNameFromObj(singleMenu);
    var option2Selector = singleMenuClass + ' .option2:not(".selected")';
    var extendedOptionSelector = singleMenuClass + ' .extend_option';
    var optionSelector = singleMenuClass + ' .option';

    jQuery(option2Selector).css({
        'opacity': 0,
        'transform': 'none'
    }).removeClass("sticky");

    jQuery(optionSelector).removeClass('fullopen').css('width', '600px');
    jQuery(extendedOptionSelector).css({
        'width': '250px',
        'opacity': 0
    });

    removeTransformsFromSecondMenu(singleMenuClass);
}


////////////////////////////////////////////////////////////////


// START


////////////////////////////////////////////////////////////////


var rollOutMenu = function (color, menu) {
    var tl = anime.timeline({
        easing: "easeOutExpo",
        duration: 1000,
        complete: function () {
            //after it all completes allow other controls
            jQuery(menu + " .rollout").each(function (i, v) {
                if (!jQuery(v).hasClass("hide")) {
                    jQuery(v).addClass("hide");
                }
            });

            animationCount++;

            if(animationCount == 6 && locked == true){
                locked = false;
                startingAnimationDone = true;
            }
        }
    });

    const openingRotation1 = getRandomRotation();
    const openingRotation2 = getRandomRotation();
    const openingRotation3 = getRandomRotation();
    const openingRotation4 = getRandomRotation();

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
    locked = true;
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

////////////////////////////////////////////////////////////////


// ANIMATIONS


////////////////////////////////////////////////////////////////

function openMenu(menuNumber, closedItself) {

    if (!closedItself) {
        // var menuNumber = "." + $(closeMenu).parent().parent()[0].className.split(" ")[0]
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
            },"-=500");
    }
};

function openWarningMenu(menuNumber){

    var tl = anime.timeline({
        easing: "easeOutExpo",
        duration: 600,
        complete: function () {
            jQuery(menuNumber + " .option").addClass("fullopen")
            flipUpSecondary(menuNumber);
        }
    });
    var translateY = (jQuery('.activeMenu').offset().top - jQuery(".warning").offset().top - ((1 * 24) + 10) + (1 * 5) + 100);

    tl.add({
            targets: menuNumber + " .option",
            width: "800px",
            easing: "easeInElastic(1, .6)"
        }).add({
            targets: menuNumber + " .extend_option",
            opacity: 1,
        }).add({
            targets: menuNumber + " .extend_option",
            width: "500px",
            easing: 'easeOutCubic'
        }).add({
            targets: menuNumber + " .extend_option",
            keyframes: [
                { rotateZ: 0 },
                { rotateZ: -3 },
                { rotateZ: 0 },
                { rotateZ: 3 }, // Add additional keyframes as needed
                { rotateZ: 0 }
            ],
            duration: 700 // Adjust the duration as needed
        }).add({
            targets: menuNumber + " .extend_option",
            translateX: "15%",
            easing:  "easeOutExpo"
        }).add({
            targets: menuNumber + " .extend_option",
            translateY: translateY,
            easing: "easeOutCubic"
        }).add({
            targets: ".view",
            opacity: 1,
            easing: "easeOutCubic", 
            begin: function(anim) {
                moveOptionToView(menuNumber + " .extend_option");
            }
        }).add({
            targets: "body, html", // Animate the scrollTop property of the body or html
            scrollTop: jQuery('.view').offset().top,
        }, "-=500")
}

function flipUpSecondary(menu) {
    var tl = anime.timeline({
        duration: 400,
        complete: function () {
            console.log("Animation complete");
        }
    });

    var subOptions = menu + " .secondary_list .option2";
    // Select all .option2 elements within .secondary_list
    var allOptions = document.querySelectorAll(subOptions);

    // Loop through each .option2 element and create animations
    allOptions.forEach(function (option, index) {
        // Define the target selector for the current option
        var targetSelector = subOptions + "." + option.classList[1];

        // Get the actual height of the current .option2 element
        var optionHeight = option.offsetHeight + 3;

        // Add animations to the timeline
        tl.add({
            targets: targetSelector,
            opacity: 0,
        }).add({
            targets: targetSelector,
            opacity: 1,
            translateX: 125, // Adjust this value based on your preference
            easing: 'easeOutQuad' // Use linear easing
        }, "-=300").add({
            targets: targetSelector,
            translateY: [-optionHeight * (index + 1), 0],
            easing: 'linear'
        }).add({
            targets: targetSelector,
            translateX: -50, // Adjust this value based on your preference
            easing: 'easeOutQuad' // Use linear easing
        }, "-=350");
    });
}


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
                        jQuery(i).css('transform', 'none')
                        jQuery(i).removeClass("sticky");
                    })

                    locked = false;
                    jQuery(`${menuNumber} .option`).removeClass('fullopen');

                    removeTransformsFromSecondMenu(menuNumber);

                }
            });

            t2.add({
                    targets: menuNumber + " .option",
                    width: "550px",
                    easing: 'easeOutElastic(1, .6)'
                }, "-=200")
                .add({
                    targets: [subOptions + ".green", subOptions + ".orange", subOptions + ".red", subOptions + ".purple", subOptions + ".teal"],
                    translateY: "750px",
                    easing: 'easeOutElastic(1, .6)',
                }).add({
                    targets: menuNumber + " .option",
                    width: "600px",
                    easing: "easeOutCubic"
                })
        }
    });

    tl.add({
        targets: menuNumber + " .extend_option",
        width: "100px"
    }).add({
        targets: menuNumber + " .extend_option",
        opacity: 0
    }, "-=400")

};


////////////////////////////////////////////////////////////////


// EVENTS


////////////////////////////////////////////////////////////////


$(document).on('mouseenter', '.hoverFix', function (event) {
    var selector = getClassNameFromObj($(this).find(".option"));
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
        }).finished;
    }
})


//hide any maxed option
//if not current max
//open clicked
jQuery(document).on("click", ".hoverFix .option", function () {
    console.log("are we locked");
    console.log(locked);

    //if open already. close itself
    //if another open, close the opened
    var closeMenu = $(this);
    if (!locked) {
        locked = true;
        var menuNumber = "." + $(closeMenu).parent().parent()[0].className.split(" ")[0]
        
        if(jQuery(menuNumber).find('.extend_option.warning').length > 0){
            openWarningMenu(menuNumber);
        } else {
            openMenu(menuNumber, false);
        }
    } else if (locked && $(this).hasClass("fullopen")) {
        removeFlipUp(closeMenu, true);
    }

});



jQuery(document).on('click', '.secondary_list .option2:not(.grey)', function (el) {
    //move selected to bottom
    locked = false;
    const currentTarget = jQuery(el.currentTarget);
    const parentParent = currentTarget.parent().parent();

    const clickTarget = getClassNameFromObj(currentTarget);
    const parentClickTarget = getClassNameFromObj(parentParent);
    const optionIndex = currentTarget.index() + 1;
    const fullOptionIndex = parentParent.index() + 2;
    const optionParent = parentClickTarget + " " + clickTarget;

    selectedOptionFinal.target = currentTarget;
    selectedOptionFinal.position = currentTarget.closest('.secondary_list').find('.option2:not(.extend_option)').index(currentTarget);
    selectedOptionFinal.parent = currentTarget.closest('.secondary_list')

    var translateY = (jQuery('.activeMenu').offset().top - jQuery(optionParent).offset().top - ((optionIndex * 24) + 10) + (fullOptionIndex * 5) + 100);

    var tl = anime.timeline({
        duration: 1000,
        complete: function () {
            // moveOptionToView(optionParent);
            //reset menu
            closeMenuAfterSelection(parentParent, clickTarget);
        }
    });

    tl.add({
        targets: optionParent,
        translateX: "15%",
        easing: "easeOutCubic"
    }).add({
        targets: optionParent,
        translateY: translateY,
        easing: "easeOutCubic"
    }).add({
        targets: ".view",
        opacity: 1,
        easing: "easeOutCubic", 
        begin: function(anim) {
            moveOptionToView(optionParent);
        }
    }).add({
        targets: "body, html", // Animate the scrollTop property of the body or html
        scrollTop: jQuery('.view').offset().top,
    }, "-=500")



    jQuery(this).addClass("selected");
    //move entire menu up
})

jQuery(document).on('click', '.option2.grey', function () {

    var selectedOption = selectedOptionFinal.target || false;
    var optinSelector = getClassNameFromObj(selectedOption);

    var t1 = anime.timeline({
        duration: 500,
        complete: function () {
            jQuery('.option2.grey').css('transform', 'translateX(-25px)');

            selectedOptionFinal.target.appendTo(jQuery(selectedOptionFinal.parent)).insertAfter(jQuery(selectedOptionFinal.parent.find('.option2')).eq(selectedOptionFinal.position))
            selectedOptionFinal.target.removeClass('selected');
            selectedOptionFinal.target.removeAttr("style");
            selectedOptionFinal.target.css({
                'opacity': 0,
                'backface-visibility': 'hidden'
            })

            locked = false;
        }
    });


    t1.add({
        targets: ['.option2.grey', optinSelector],
        translateX: "-400px",
        easing: "easeOutExpo"
    }).add({
        targets: "body, html", // Animate the scrollTop property of the body or html
        scrollTop: jQuery('.background').offset().top,
        easing: "easeInElastic(1, .6)"
    })
})

start();