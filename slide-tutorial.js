;(function(){
    /*
     Constructor
     - Pass in an object with a
         - mandatory 'slides' array of objects
             [{image: 'string (url or path)', title: 'string', content: 'string'}]
         - optional 'nextButtonText' string
         - optional 'finishButtonText' string
         - optional 'closeButtonText' string
     - Example: new SlideTutorial({slides: ..., nextButtonText: ...})
     */
    function SlideTutorial (options) {
        this._setConfig(options);
        this._create();

        this.slides = options.slides;

        this.el = document.querySelector('.slide-tutorial');
        this.nextButton = this.el.querySelector('.slide-tutorial-next-button');
        this.closeButton = this.el.querySelector('.slide-tutorial-close-button');
        this.slidesContainer = this.el.querySelector('.slide-tutorial-slides');
        this.dotsContainer = this.el.querySelector('.slide-tutorial-dots');

        this.el.addEventListener('click', this.exitIfClickOutside.bind(this), false);
        this.nextButton.addEventListener('click', this.onClickNextButton.bind(this), false);
        this.closeButton.addEventListener('click', this.onClickCloseButton.bind(this), false);

        this._createSlides();
        this._createDots();

        return;
    };

    /* Public */

    // .start : start the tutorial, probably the only instance method you'll need

    SlideTutorial.prototype.start = function() {
        this.setSlide(0); // start on first slide
        this.addClass('active', this.el);
        return this;
    };

    // .finish : close the tutoral

    SlideTutorial.prototype.finish = function() {
        this.removeClass('active', this.el);
        return this;
    };

    // .setSlide : go to a specific slide index

    SlideTutorial.prototype.setSlide = function(i) {
        this.activeSlide = i;
        this._displaySlide(this.activeSlide);
        return this;
    };

    // .destroy : remove from DOM

    SlideTutorial.prototype.destroy = function(){
        this.el.parentNode.removeChild(this.el)
    };

    /* DOM Manipulation Helpers */
    SlideTutorial.prototype.addMultipleEventListeners = function(eventType, nodeList, handler) {
        var nodes, i;
        nodes = nodeList;
        for (i = 0; i < nodeList.length; i++) {
            nodeList[i].addEventListener(eventType, handler.bind(this), false);
        }
        return;
    };

    SlideTutorial.prototype.elemIndex = function(elem) {
        var i = 0, elem = elem;
        while (elem = elem.previousSibling) i++;
        return i;
    };

    SlideTutorial.prototype.setDimension = function(elem, dimension, size) {
        elem.style[dimension] = size + 'px';
        return;
    }

    SlideTutorial.prototype.addClass = function(className, elem) {
        if (!!~elem.className.indexOf(className)) return;
        elem.className += (' ' + className);
        return;
    };

    SlideTutorial.prototype.removeClass = function(className, elem) {
        var elem = elem;
        elem.className = elem.className.replace(className, '');
        return;
    };

    SlideTutorial.prototype.activateChildren = function(elem) {
        var i, childs;
        childs = elem.childNodes;
        for (i = 0; i < childs.length; i++) {
            this.addClass('active', childs[i]);
        }
        return;
    }

    SlideTutorial.prototype.clearActiveChildren = function(elem) {
        var i, childs;
        childs = elem.childNodes;
        for (i = 0; i < childs.length; i++) {
            this.removeClass('active', childs[i]);
        }
        return;
    };

    /* Event Handlers */
    SlideTutorial.prototype.onClickNextButton = function(e) {
        if (this.activeSlide < this.slides.length - 1) {
            this.setSlide(this.activeSlide + 1);
        } else {
         this.finish();
        }
        return;
    };

    SlideTutorial.prototype.onClickDot = function(e) {
        var clickedDotIndex;
        clickedDotIndex = this.elemIndex(e.target);
        this.setSlide(clickedDotIndex);
        return;
    };

    SlideTutorial.prototype.onClickCloseButton = function(e) {
        this.finish();
        return;
    };

    SlideTutorial.prototype.exitIfClickOutside = function(e) {
        if (e.target === this.el) this.finish();
        return;
    };

    /* Private : display */
    SlideTutorial.prototype._displaySlide = function(i) {
        var slideToActivate, dotToActivate;

        slideToActivate = this.slidesContainer.querySelector('.slide-tutorial-slide-' + i);
        dotToActivate = this.dotsContainer.querySelector('.slide-tutorial-dot-' + i);


        this.clearActiveChildren(this.slidesContainer);
        this.clearActiveChildren(this.dotsContainer);

        this.addClass('active', slideToActivate);
        this.addClass('active', dotToActivate);

        this.nextButton.innerHTML =
            (i === this.slides.length - 1) ? this.finishButtonText : this.nextButtonText;

        return;
    };

    /* Private : initialization / element creation */
    SlideTutorial.prototype._valOrDefault = function(val, def) {
        var valIsDefined = (val !== null && (typeof val) !== "undefined")
        return(valIsDefined ? val : def);
    };

    SlideTutorial.prototype._setConfig = function(opts) {
        var config = [
            {prop: 'nextButtonText', defaultVal: 'Next'},
            {prop: 'finishButtonText', defaultVal: 'Finish'},
            {prop: 'closeButtonText', defaultVal:  '&times;'},
            {prop: 'constantHeight', defaultVal: true}
        ];

        config.forEach(function(opt) {
            this[opt.prop] = this._valOrDefault(opts[opt.prop], opt.defaultVal);
        }.bind(this));

        return;
    };

    SlideTutorial.prototype._slidesContainerContent = function() {
        return(this.slides.map(function(slide, i) {
             return(
                 "<div class='slide-tutorial-slide slide-tutorial-slide-" + i +"'>" +
                     "<div class='slide-tutorial-slide-top'>" +
                       "<img src='" + slide.image + "'/>" +
                     "</div>" +
                     "<div class='slide-tutorial-slide-bottom'>" +
                       "<h1>" + slide.title + "</h1>" +
                       "<p>" + slide.content + "</p>" +
                     "</div>" +
                 "</div>"
             );
        }).join(""));
    };

    SlideTutorial.prototype._createSlides = function() {
        var slidesElem = this.el.querySelector('.slide-tutorial-slides'),
            slideContentElems,
            largestHeight = 0,
            contentHeight, childs, i;
        
        slidesElem.innerHTML = this._slidesContainerContent();

        if (this.constantHeight) {
            this.activateChildren(slidesElem);
            slideContentElems = Array.prototype.slice.call(this.el.querySelectorAll('.slide-tutorial-slide-bottom'));

            slideContentElems.forEach(function(slideContentElem, i) {
                contentHeight = slideContentElem.getBoundingClientRect().height;
                if (contentHeight > largestHeight) {
                    largestHeight = contentHeight;
                }
            }.bind(this));

            slideContentElems.forEach(function(slideContentElem, i) {
                this.setDimension(slideContentElem, 'height', largestHeight);
            }.bind(this));

            this.clearActiveChildren(slidesElem);
        }

        return;
    };

    SlideTutorial.prototype._createDots = function() {
        var dots, dotsContent;

        dotsContent = this.slides.map(function(slide, i){
            return ("<div class='slide-tutorial-dot slide-tutorial-dot-" + i + "'></div>");
        }).join("");

        this.el.querySelector('.slide-tutorial-dots')
            .innerHTML = dotsContent;

        dots = this.el.querySelectorAll('.slide-tutorial-dot');
        this.addMultipleEventListeners('click', dots, this.onClickDot);
        return;
    };

    SlideTutorial.prototype._create = function() {
        var html, container;
        html =
            "<div class='slide-tutorial-container'>" +
                "<button class='slide-tutorial-close-button'>" +
                  this.closeButtonText +
                "</button>" +
                "<div class='slide-tutorial-slides'></div>" +
                "<div class='slide-tutorial-button-container'>" +
                    "<button class='slide-tutorial-next-button'>" +
                       this.nextButtonText +
                    "</button>" +
                "</div>" +
                "<div class='slide-tutorial-dots'></div>" +
            "</div>";

        container = document.createElement('div');
        container.innerHTML = html;
        container.className = 'slide-tutorial';
        document.body.appendChild(container);
        return;
    };

    window.SlideTutorial = SlideTutorial;
    if (typeof module !== 'undefined') module.exports = SlideTutorial;
    if (typeof define !== 'undefined') define(function() {return SlideTutorial;});
}).call(this);
