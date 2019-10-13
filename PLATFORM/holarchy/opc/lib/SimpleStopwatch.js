"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SimpleStopwatch =
/*#__PURE__*/
function () {
  function SimpleStopwatch(name_) {
    _classCallCheck(this, SimpleStopwatch);

    this.name = name_;
    this.startTime = new Date().getTime();
    var startMark = {
      label: "START: ".concat(name_),
      delta: 0,
      ellapsed: 0
    };
    this.lastMark = startMark;
    this.marks = [startMark];
    this.mark = this.mark.bind(this);
    this.finish = this.finish.bind(this);
  }

  _createClass(SimpleStopwatch, [{
    key: "mark",
    value: function mark(label_) {
      var ellapsed = new Date().getTime() - this.startTime;
      var mark = {
        label: label_,
        delta: ellapsed - this.lastMark.ellapsed,
        ellapsed: ellapsed
      };
      this.marks.push(mark);
      this.lastMark = mark;
      return mark;
    }
  }, {
    key: "finish",
    value: function finish() {
      var finishMark = this.mark("FINISH: ".concat(this.name));
      return {
        name: this.name,
        startTime: this.startTime,
        finishTime: this.startTime + finishMark.ellapsed,
        totalMicroseconds: finishMark.ellapsed,
        marks: this.marks
      };
    }
  }]);

  return SimpleStopwatch;
}();

module.exports = SimpleStopwatch;