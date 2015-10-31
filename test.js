import {expect} from 'chai'
import SlideTutorial from './slide-tutorial.js'
import {jsdom} from 'node-jsdom';

if (typeof document === 'undefined') {
    global.document = jsdom("<html><head></head><body></body></html>");
    global.window = document.parentWindow;
    global.navigator = {userAgent: 'node.js'};
}

describe('SlideTutorial', () => {
    let tutorial, elemIndex;

    it('exists', () => {
        expect(SlideTutorial).to.be.ok
    })

    beforeEach(() => {
        tutorial = new SlideTutorial({slides: [
            {image: 'http://placehold.it/400X200', title: 'Welcome', content: 'Lorem ipsum'},
            {image: 'http://placehold.it/400X200', title: 'Second Slide', content: 'Lorem ipsum'},
            {image: 'http://placehold.it/400X200', title: 'Third Slide', content: 'Lorem ipsum'}
        ], nextButtonText: 'Continue', finishButtonText: 'Get Started'});
        tutorial.start()
        elemIndex = tutorial.elemIndex;
    })

    afterEach(() => {
        const tutorials = document.body.querySelectorAll('.slide-tutorial')
        for (let i = 0; i < tutorials.length; i++) {
            document.body.removeChild(tutorials[i])
        }
        tutorial = null;
    })

    it('is creatable', () => {
        expect(tutorial).to.be.ok
    })

    describe('start', () => {
        it('adds an active class to the el', () => {
            tutorial.start()
            expect(tutorial.el.classList.contains('active')).to.be.truthy
        })

        it('starts at the first slide', () => {
            const activeSlide = tutorial.elemIndex(tutorial.slides.activeSlide())
            expect(activeSlide).to.equal(0)
        })
    })

    describe('finish', () => {
        it('removes the active class from the el', () => {
            tutorial.start().finish()
            expect(tutorial.el.classList.contains('active')).to.be.falsy
        })
    })

    describe('destroy', () => {
        it('removes tutorial from the dom', () => {
            expect(document.body.querySelectorAll('.slide-tutorial').length).to.equal(1)
            tutorial.destroy()
            expect(document.body.querySelectorAll('.slide-tutorial').length).to.equal(0)
        })
    })

    describe('setSlide', () => {
        it('adds an active class to the slide of the specified index', () => {
            tutorial.setSlide(2)
            const activeSlide = document.querySelectorAll('.slide-tutorial-slide.active')[0]
            expect(elemIndex(activeSlide)).to.equal(2)
        })
    })

    describe('elemIndex', () => {
        it('returns the index of a dom element in it\'s parent', () => {
            const aDiv = document.createElement('div')
            aDiv.innerHTML = `<span></span><span id='test-me'><p></p></span><span></span>`
            document.body.appendChild(aDiv)

            expect(tutorial.elemIndex(document.getElementById('test-me'))).to.equal(1)
            document.body.removeChild(aDiv)
        })
    })

    describe('next button text', () => {
        it('changes it\'s content to finishButtonText when on the last slide', () => {
            let nextButtonText = () => tutorial.el.querySelector('.slide-tutorial-next-button').innerHTML
            expect(nextButtonText()).to.equal(tutorial.nextButtonText)

            tutorial.setSlide(+tutorial.slidesData.length - 1)
            expect(nextButtonText()).to.equal(tutorial.finishButtonText)

            tutorial.setSlide(0)
            expect(nextButtonText()).to.equal(tutorial.nextButtonText)
        })
    })

    describe('Slides', () => {
        it('exists', () => {
            expect(tutorial.slides).to.be.ok
        })

        describe('activeSlide', () => {
            it('returns the index of the currently active slide', () => {
                tutorial.setSlide(2)
                expect(elemIndex(tutorial.slides.activeSlide())).to.equal(2)
            })
        })

        describe('setConstantHeight (default = true)', () => {
            it('sets the content area heights to be the same, equal to the largest', () => {
                const bottoms = [].slice.call(
                    tutorial.el.querySelectorAll('.slide-tutorial-slide-bottom')
                )
                const heights = bottoms.map(elem => elem.getBoundingClientRect().height)
                const isEqualToLargest = h => Math.floor(h) === 61 // largest height in test data
                expect(heights.every(isEqualToLargest)).to.equal(true)
            })
        })

        describe('activate', () => {
            it('activates a slide according the the bool argument', () => {
                let activeIndex = () => elemIndex(tutorial.slides.activeSlide())
                expect(activeIndex()).to.equal(0)

                tutorial.slides.activate(0, false)
                tutorial.slides.activate(2, true)

                expect(activeIndex()).to.equal(2)
            })
        })
    })

    describe('Dots', () => {
        it('exists', () => {
            expect(tutorial.dots).to.be.ok
        })

        describe('activate', () => {
            it('activates a dot according the the bool argument', () => {
                let activeDot = () => tutorial.dots.el.querySelectorAll('.slide-tutorial-dot.active')[0]
                expect(elemIndex(activeDot())).to.equal(0)

                tutorial.dots.activate(0, false)
                tutorial.dots.activate(1, true)

                expect(elemIndex(activeDot())).to.equal(1)
            })
        })

    })
})
