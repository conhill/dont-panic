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
