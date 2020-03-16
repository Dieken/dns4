var dns = require('dns');

var originalLookup = dns.lookup;

dns.lookup = function (hostname, options, callback) {
    var type = typeof options;

    if (type === 'function') {
        callback = options;
    }

    if (type === 'object') {
        var opts = Object.assign({}, options);
        opts.family = 4;
        return originalLookup(hostname, opts, callback);
    }

    return originalLookup(hostname, 4, callback);
};

if (dns.promises) {
    var originalPromiseLookup = dns.promises.lookup;

    dns.promises.lookup = function (hostname, options) {
        if (typeof options === 'object') {
            var opts = Object.assign({}, options);
            opts.family = 4;
            return originalPromiseLookup(hostname, opts);
        }

        return originalPromiseLookup(hostname, 4);
    };
}
