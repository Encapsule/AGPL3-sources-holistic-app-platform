# Notes on React 16

## Problem

The current viewpath5 app primarily uses d2r2 to wrap React components. This has been okay until now: it's important for everyone on the team to understand fundamentally how to write React components. And d2r2 provides some useful structure for re-use and specification.

It's a subtle point perhaps but the purpose of d2r2 is to solve dynanmic layout, component extension, and fundamental data type fidelity problems that complicate and slow the creation of re-usable view "widgets".

d2r2 is not however designed for 95% React use case of sending new render data to previously mounted React components.

This is both inefficient and potentially confusing to developers making the jump from the a non-animated, largely non-dynamic view over largely static data to a system in which the data is NOT intrinsically coupled to the view. And, in which both the selected view and the underlying data projected through the view change at runtime according to complex rules.

To illustrate:

Consider writing a simple client JS app that makes a network request on startup, waits for the response (a serialized Digraph), and then in its response handler passes the serialized digraph data to arccore.graph.directed.create to get a DirectedGraph class instance.

So, let's say that after we initialize our DirectedGraph instance we do something like this:

```
window.dataLayer = { digraph };
```

Now imagine that we leverage React to display a list of vertices and edges in the graph along with its name and description plus a button that shows the same information via D3js.

CLicking the button requires that we update the layout and re-render the same data in some different way. But, this operation is orthongonal to the actual data insofar as we do not need to reload the graph attached to `window.dataLayer.digraph` or actually do anything to it at all in order to just simply access the information and project it out to the display.

Now consider that we add another button "Add Task" to both of the views.

This is a bit different. "Add Task" implies that we're going to modify information that's managed somehow (we don't care how for this example) by the data layer. We know that this probably means that we'll add a vertex to graph but it doesn't matter here particularly.

So we have a "Add Task" button. The event handler needs to communicate the user's intention (create a task) to the data layer. The click handler SHOULD NOT contain any information about actually how this accomplished or what this even means. It's job is simply to communicate the user's request appropriately to the data layer where the request can be further processed.

We can accomplish this, for example, by implementing the details of how the task is added inside the body of a ControllerAction, and stipulate that the React component's click handler needs to call that specific ControllerAction providing a code (or a handle or a path - something) will inform the ControllerAction precisely where in memory it should affect this change to the graph (it doesn't know - no  OCD paths should generally be hard-coded).

So the user clicks the "Add Task" button and this calls a ControllerAction that encapsulates a little code that uses the DirectedGraph API to add a vertex to a digraph managed by the data layer.

What should happen then?

Well the definition of truth in the data layer has changed. This means that depending on a whole lot of stuff we do not and cannot know that some/all of the view may need to be updated (maybe re-layout, maybe update data, maybe both). 
















## Some Interesting URLS's

- https://www.google.com/search?q=react+streaming
- https://blog.bitsrc.io/how-to-render-streams-with-react-8986ad32fffa
- https://hackernoon.com/whats-new-with-server-side-rendering-in-react-16-9b0d78585d67
- https://github.com/aickin/react-dom-stream
- https://github.com/GetStream/stream-react-example
- https://egghead.io/courses/build-react-components-from-streams-with-rxjs-and-recompose
- https://quantizd.com/building-live-streaming-app-with-node-js-and-react/


