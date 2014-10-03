;(function(){
    var html;
    html = 
        "<div class='slide-tutorial-container'>" +
            "<button class='slide-tutorial-close'>&times;</button>" +
            "<div class='slide-tutorial-slides'>" +
                "<div class='slide-tutorial-slide'>" + 
                    "<div>hello!</div>" +
                "</div>" +
            "</div>" +
            "<button class='slide-tutorial-next-button'>Next</button>"+
            "<div class='slide-tutorial-dots'></div>" +
        "</div>";

    function SlideTutorial (slides) {
        this.slides = slides;
        this.numberOfSlides = this.slides.length;
        this.el = document.querySelector('.slide-tutorial');
        this.nextButton = document.querySelector('.slide-tutorial-next-button');
        
        this.nextButton.addEventListener('click', this.onClickNextButton)
        this.createSlides()
        this.createDots()
    };
    
    SlideTutorial.container = document.createElement('div');
    SlideTutorial.container.innerHTML = html;
    SlideTutorial.container.className = 'slide-tutorial';
    document.body.appendChild(SlideTutorial.container);

    SlideTutorial.prototype.onClickNextButton = function(e) {
        console.log(e);
    };

    SlideTutorial.prototype.slidesContainerContent = function() {
        return this.slides.map(function(slide) {
             return(
                 "<div class='slide-tutorial-slide'>" +
                     "<div class='slide-tutorial-slide-top'></div>" +
                       "<img src='" + slide.image + "'/>" +
                     "<div class='slide-tutorial-slide-bottom'>" +
                       "<h1>" + slide.title + "</h1>" +
                       "<p>" + slide.content + "</p>" +
                     "</div>" +
                 "</div>"
             );
        }).join("");
    };

    SlideTutorial.prototype.createSlides = function() {
        this.el.querySelector('.slide-tutorial-slides')
            .innerHTML = this.slidesContainerContent();
    };

    SlideTutorial.prototype.createDots = function() {
        var dotsContent
        dotsContent = this.slides.map(function(slide){return ("<div class='dot'></div>")}).join("");

        this.el.querySelector('.slide-tutorial-dots')
            .innerHTML = dotsContent;
    };

    window.SlideTutorial = SlideTutorial;
    if (typeof module !== 'undefined') module.exports = SlideTutorial;
    if (typeof define !== 'undefined') define(function() {return SlideTutorial;});
})(this);
