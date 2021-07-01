# Conway's Game of Life

A simple implementation of Life, presented with React, using Typescript.

The controls are self-explanatory. Note that changes made while the simulation is playing or paused
are not persistent. Only changes made while the simulation is stopped persist!

Click a cell to toggle its state. Click and drag to draw.

----

You can view the app in your browser by simply opening the index.html file in the browser.

# Rebuilding the project

Currently the project has been built and packed, and does not need to be rebuilt in order to run.
However, if you want to set up this project for modifications and development, rebuilding is easy.

1. run `npm install` to generate the node_modules folder and the package-lock.json file. This will
   install all of the necessary development dependencies as well.
2. run `npm run start` to start the dev server or run `npm run build` to pack the project in to the
   public folder.

# Implementation Notes

I implemented everything from scratch rather than taking an existing implementation. In hindsight,
this cost a lot of time that I could have used to implement more advanced features. Typically I take
this approach to problem-solving in order to gain a full understanding of it. The time it takes to
implement features over the top of a good foundation takes exponentially less time than interpreting
and adapting code that comes from someone else.

Either way, I chose my usual approach of separating the user interface from the data in such a way
that the application can run off purely the data, without user intervention or even rendering the
application on screen. Events drive the updates from the data to the user interface. Any data access
performed in the user interface is strictly read-only.

Some features I thought about but did not have time to implement include:

* Selection-based clearing and transforming elements on the board -- as in creating a selection of
  cells that you can mirror, translate, clear, or fill
* Undo history for user edits
* A collection of basic units, like gliders, that you can stamp on to the board

# Tools and Resources

* React
* Typescript, Babel
* Webpack
* Neovim
* ESLint
* Wikipedia
* MDN Docs

Other than React, there are no 3rd party dependencies in this project.
