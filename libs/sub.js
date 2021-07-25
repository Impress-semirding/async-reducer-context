var Subs = /** @class */ (function () {
    function Subs(state) {
        this.state = state;
        this.observers = [];
    }
    Subs.prototype.add = function (observer) {
        this.observers.push(observer);
    };
    Subs.prototype.notify = function () {
        this.observers.forEach(function (observer) { return observer(); });
    };
    Subs.prototype.delete = function (observer) {
        var index = this.observers.findIndex(function (item) { return item === observer; });
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    };
    return Subs;
}());
export default Subs;
