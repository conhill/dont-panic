
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
    updateDisplayInfo(sectionId){
        $('#'+ sectionId).css('background-image', 'url("path/to/new-image.png")');
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

};
