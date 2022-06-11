/*(

  TODO: Migrate these notes into documentation specific to the maintainence of derived
  holistic app sources git repositories initialized/maintained with @encapsule/holistic
  command line tool.

  It's fine to import/require untrused SOURCES/COMMON code into trusted SOURCES/SERVER code.
  [ SOURCES/SERVER ] <=== import/require <==== [ SOURCES/COMMON ]          TRUSTED

  ----- app service line of trust ------HTTPS----------PUBLIC INTERNET -----------

  It's fine to import/require untrused SOURCES/COMMON code into untrusted SOURCES/CLIENT code.
  [ SOURCES/CLIENT ] <=== import/require <==== [ SOURCES/COMMON ]        UNTRUSTED

  PLEASE DO NOT:

  [ SOURCES/CLIENT ] <==== import/require <==== [ SOURCES/SERVER ]    BAD PRACTICE: You should not need to ever import/require client code on the server. Shared behavior and/or data needs to live in SOURCES/COMMON.
  [ SOURCES/SERVER ] <==== import/require <==== [ SOURCES/CLIENT ]    POOR PRACTICE: Although there's really no trust issue here it's kind of lazy when you can keep everthing symetric w/pre-build steps in the few cases that you are likely to ever actually need.

  [ SOURCES/COMMON ] <==== import/require <==== [ SOURCES/SERVER ]    BAD PRACTICE: import/require going in the wrong direction - you're just asking for trouble here. take the time to keep your pre-build up-to-date and synthesize sources across trust zones at build-time.
  [ SOURCES/COMMON ] <==== import/require <==== [ SOURCES/CLIENT ]    BAD PRACTICE: import/require going in the wrong direction - code in COMMON is agnostic to Node.js vs Browser tab, and your client code is likely not. If it is, move it to common.

)*/


