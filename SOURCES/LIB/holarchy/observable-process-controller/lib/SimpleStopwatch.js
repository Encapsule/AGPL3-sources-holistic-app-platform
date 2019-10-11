

class SimpleStopwatch {

    constructor(name_) {
        this.name = name_;
        this.startTime = (new Date()).getTime();
        const startMark = { label: `START: ${name_}`, delta: 0, ellapsed: 0 };
        this.lastMark = startMark;
        this.marks = [ startMark ];

        this.mark = this.mark.bind(this);
        this.finish = this.finish.bind(this);
    }

    mark(label_) {
        let ellapsed = ((new Date()).getTime)() - this.startTime;
        const mark = { label: label_, delta: (ellapsed - this.lastMark.ellapsed), ellapsed: ellapsed };
        this.marks.push(mark);
        this.lastMark = mark;
        return mark;
    }

    finish() {
        const finishMark = this.mark(`FINISH: ${this.name}`);

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

