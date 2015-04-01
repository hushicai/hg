(function (root) {
    function factory() {
        return {};
    }

    if (typeof === 'define' && define.amd) {
        define(factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    }
    else {
        root.factory = factory;
    }
})(this);