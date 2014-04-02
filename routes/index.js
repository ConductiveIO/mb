var index = (function () {
    function index() {
        this.init();
    }
    index.prototype.init = function () {
        console.log('init');
    };
    index.prototype.me = function (req, res) {
        this.init();
        res.json([
            'robby was here'
        ]);
    };
    return index;
})();


module.exports = index;

