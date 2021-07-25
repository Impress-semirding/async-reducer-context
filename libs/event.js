var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.take = [];
    }
    EventEmitter.prototype.on = function (callback) {
        this.take.push(callback);
    };
    EventEmitter.prototype.run = function () {
        this.take.forEach(function (callback) {
            callback();
        });
    };
    return EventEmitter;
}());
export default EventEmitter;
