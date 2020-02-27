^--- Notes about these timing numbers:
1. Because hashrouting, initial page load time is no longer primary concern.
1a. We should address client-app-bundle.js cache headers #1.
1b. We should then seek to reduce the runtime boot reported here.
================================================================
\nWe are now leaving client.js and exiting scope.
What is left is our OPC instance attached to the window.opc.
So, now what?
OPC models a reactive system in terms of stateful software models
that manage their runtime state inside the OPC's OCD store.
\nJavaScript is single threaded and uses asynchronous functions
pervasively. OPC can be thought of as an execution environment
for an arbitrary number of short and long-lived asynchronous
processes that store their state inside OCD namespaces.
\nTo keep things straight, OPC separates concerns between software
models called OPM, and the actors that interactive with the models
at runtime.
\nActors are often event handler functions that perform some task
by calling the OPC.act method to send the event details and some
command(s) to some software model executing inside the OPC.
\nHere's a brief overview of what all is going on here:
\nOPC does some init things and then waits for an actor
to call OPC.act.
\nAfter dispatching the action request which delivers a message
to a model(s) by writing data into their OCD namespace(s), OCD
re-evaluates the state of the modeled system by evaluating all
the software models repeatedly until they all agree there's no
no more work to be done.
\nBroadly, the combination of the initial action plus the
subsequent re-evaluation of the software models generically
orchestrates message passing between software models, side-effects
on external systems (e.g. sending network requests, updating the
display...), and conditional sequencing of the models through
their various process steps to prepare the system for the next
call to OPC.act method.
\nBetween calls to OPC.act, OPC is just data in the OCD store.
And, software model rules that in conjunction with the data in
the OPC's OCD are used to determine exactly what things will
will transpire when next OPC.act is called...
\n@encapsule/holarchy --- the pattern unification pattern

