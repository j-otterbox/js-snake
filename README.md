# JS Snake

<br>

_Classic Snake game written in JavaScript, HTML and CSS_

<br>

Try it [here](https://j-otterbox.github.io/js-snake/)

<br>

![Snake Game Demo](https://github.com/j-otterbox/js-snake/blob/main/snake-game-demo.gif "Snake game in use")

## Summary

This is a clone of the classic arcade game, Snake, that I built for SDMM. This was a fun project because it was an opportunity to use even more functionality built into the Window interface, specifically setting and clearing intervals to update the game as time passes. Beyond that, this was a great way to get more practice with writing clean code. 

The biggest hurdle I had was figuring out how to move the snake during each cycle while leaving room for adding a new segment if a fruit was consumed by the snake. It took a little trial and error but once it clicked it made perfect sense. 

After completing the first iteration of the project, I went over it some time later with the intent of applying some intermediate concepts, specifically refactoring code where possible to reduce coupling. My code seemed cohesive enough, meaning code that logically belonged together was already grouped, either in a class or simply the way the code was structured. However, I did have many functions that relied on global variables. While this is slightly nicer to read, it can make testing difficult, so I refactored code where I needed to so that it behaves more like a small testable unit.

## Author

* **Jason Otter** - *Full-Stack Software Developer* - [Website](https://jason-otter.netlify.app/) | [LinkedIn](https://www.linkedin.com/in/jason-otter/)
