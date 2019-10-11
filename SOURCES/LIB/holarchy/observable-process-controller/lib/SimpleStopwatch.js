

class SimpleStopwatch {

    constructor(name_) {
        this.name = name_;
        this.startTime = (new Date()).getTime();
        this.marks = [ { label: "START", ellapsed: 0 } ];

        this.mark = this.mark.bind(this);
        this.finish = this.finish.bind(this);
    }

    mark(label_) {
        let ellapsed = ((new Date()).getTime)() - this.startTime;
        const mark = { label: label_, ellapsed: ellapsed };
        this.marks.push(mark);
        return mark;
    }

    finish() {
        const finishMark = this.mark("FINISH");

        return {
            name: this.name,
            startTime: this.startTime,
            finishTime: (this.startTime + finishMark.ellapsed),
            totalMicroseconds: finishMark.ellapsed,
            marks: this.marks
        };
    }

}

module.exports = SimpleStopwatch;

