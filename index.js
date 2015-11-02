;(function() {
    class Dots {
        constructor({slides, container, onClick}) {
            this.el = container
            container.innerHTML = this.html(slides)
            const dots = [].slice.call(container.querySelectorAll('.slide-tutorial-dot'))
            dots.forEach(dot => dot.addEventListener('click', onClick, false))
        }

        activate(index, bool) {
            const dot = this.el.querySelector(`.slide-tutorial-dot-${index}`)
            return (bool) ? dot.classList.add('active') : dot.classList.remove('active')
        }

        html(slides) {
            return slides.map((slide, i) => {
                return `<div class='slide-tutorial-dot slide-tutorial-dot-${i}'></div>`
            }).join('')
        }
    }

    class Slides {
        constructor({slides, container, constantHeight}) {
            this.el = container
            container.innerHTML = this.html(slides)
            if (constantHeight !== false) this.setConstantHeight(container);
        }

        activate(index, bool) {
            const slide = this.el.querySelector(`.slide-tutorial-slide-${index}`)
            return (bool) ? slide.classList.add('active') : slide.classList.remove('active')
        }

        activeSlide() {
            return this.el.querySelectorAll('.slide-tutorial-slide.active')[0]
        }

        setConstantHeight(container) {
            ;[].slice.call(container.querySelectorAll('.slide-tutorial-slide'))
                  .forEach((_, index) => this.activate(index, true)) // activate slides to read height

            const slideBottoms =
                  [].slice.call(container.querySelectorAll('.slide-tutorial-slide-bottom'))

            const largestBottomHeight = Math.max.apply(
                Math, slideBottoms.map(elem => elem.getBoundingClientRect().height)
            )

            slideBottoms.forEach(slide => slide.style.height = `${largestBottomHeight}px`)
        }

        html(slides) {
            return slides.map((slide, i) => {
                return [`<div class='slide-tutorial-slide slide-tutorial-slide-${i}'>`,
                            `<div class='slide-tutorial-slide-top'>`,
                                `<img src='${slide.image}'/>`,
                            `</div>`,
                            `<div class='slide-tutorial-slide-bottom'>`,
                                `<h1>${slide.title}</h1>`,
                                `<p>${slide.content}</p>`,
                            `</div>`,
                        `</div>`].join('')
            }).join('')
        }
    }

    class SlideTutorial {
        constructor({slides, finishButtonText, nextButtonText, closeButtonText,  constantHeight}) {
            this.finishButtonText = finishButtonText ? finishButtonText : "Finish"
            this.nextButtonText = nextButtonText ? nextButtonText : "Next"
            this.closeButtonText = closeButtonText ? closeButtonText : "&times"
            this.slidesData = slides

            // Create the container and add slides as html to it
            const container = document.createElement('div')
            container.innerHTML = this.html(this.nextButtonText, this.closeButtonText)
            container.className = 'slide-tutorial'
            document.body.appendChild(container)
            this.el = container

            // Create Slides: Images and text content to display
            this.slides = new Slides({
                container: container.querySelector('.slide-tutorial-slides'),
                slides: slides,
                constantHeight: constantHeight
            })

            // Create Dots: Row of circles for navigating between slides
            this.dots = new Dots({
                container: container.querySelector('.slide-tutorial-dots'),
                onClick: e => this.setSlide(this.elemIndex(e.target)),
                slides: slides
            })

            // Event Listener - Underlay: finish tutorial if user clicks outside slides area
            container.addEventListener('click', e => {
                if (e.target === container) this.finish();
            }, false)

            // Event Listener  - Close button: finish tutorial if clicked
            container.querySelector('.slide-tutorial-close-button')
                .addEventListener('click', e => {this.finish()}, false)

            // Event Listener  - Next button: advance slide when clicked, close if last slide active
            container.querySelector('.slide-tutorial-next-button').addEventListener('click', e => {
                const activeSlideIndex = this.elemIndex(this.slides.activeSlide())
                if (activeSlideIndex < slides.length - 1) {
                    this.setSlide(activeSlideIndex + 1)
                } else {
                    this.finish()
                }
            }, false)
        }

        start() {
            this.setSlide(0) // start on first slide
            this.el.classList.add('active')
            return this
        }

        finish() {
            this.el.classList.remove('active')
            return this
        }

        destroy() {
            this.el.parentNode.removeChild(this.el)
            return this
        }

        setSlide(index) {
            // Clear old active class
            this.slidesData.forEach((_, i) => {
                this.dots.activate(i, false)
                this.slides.activate(i, false)
            })

            // Set new active class
            this.slides.activate(index, true)
            this.dots.activate(index, true)

            // Set finish button text according to slide index
            this.el.querySelector('.slide-tutorial-next-button').innerHTML =
                (index === this.slidesData.length - 1) ? this.finishButtonText : this.nextButtonText
            return this
        }

        elemIndex(element) {
            let i = 0, elem = element;
            while (elem = elem.previousSibling) i++;
            return i
        }

        html(nextButtonText, closeButtonText) {
            return [`<div class='slide-tutorial-container'>`,
                        `<button type='button' class='slide-tutorial-close-button'>`,
                            closeButtonText,
                        `</button>`,
                        `<div class='slide-tutorial-slides'></div>`,
                        `<div class='slide-tutorial-button-container'>`,
                             `<button type='button' class='slide-tutorial-next-button'>`,
                                nextButtonText,
                            `</button>`,
                        `</div>`,
                        `<div class='slide-tutorial-dots'></div>`,
                    `</div>`].join('')
        }
    }

    if (typeof module !== 'undefined') {
        module.exports = SlideTutorial;
    } else if (typeof window !== 'undefined') {
        window.SlideTutorial = SlideTutorial;
    }
}());
