

class SimpleStopwatch {

    // Instance construction starts the timer.
    constructor(name_) {
        this.name = name_;
        this.startTime = (new Date()).getTime();
        this.marks = [];
        // API methods
        this.mark = this.mark.bind(this);
        this.stop = this.stop.bind(this);
        this.getMarks = this.getMarks.bind(this);
        this.mark(`START: ${this.name}`);
    }

    // Call the mark method to record the time of event(s) between construction (start) and a call to the stop method.
    mark(label_) {
        const now = (new Date()).getTime();
        const ellapsedTotal = now - this.startTime;
        let ellapsedDelta = 0;
        if (this.marks.length >0) {
            const lastMark = this.marks[this.marks.length - 1];
            ellapsedDelta = ellapsedTotal - lastMark.ellapsedTotal;
        }
        const mark = { label: label_, ellapsedDelta: ellapsedDelta, ellapsedTotal: ellapsedTotal };
        this.marks.push(mark);
        console.log(`**** ${JSON.stringify(mark)}`);
        return mark;
    }

    // Call stop to stop the stopwatch timer and freeze the marks log.
    stop() {
        const finishMark = this.mark(`STOP: ${this.name}`);

        return {
            marks: this.marks,
            name: this.name,
            timeStart: this.startTime,
            timeStop: (this.startTime + finishMark.ellapsedTotal),
            totalMicroseconds: finishMark.ellapsedTotal
        };
    }

    getMarks() {
        return this.marks;
    }

}

module.exports = SimpleStopwatch;

