// import module dns
var dns = require('dns');

// backup original lookup functions
var originalLookup = dns.lookup;
var originalPromiseLookup = undefined;
if (dns.promises) {
    originalPromiseLookup = dns.promises.lookup;
}

// hijack module dns
require('./index.js');

// constants
var DNS_SERVERS = ['8.8.8.8'];
var HOSTNAME = 'ipv6-test.com';

// use specified dns servers
lookup = dns.lookup;
dns.setServers(DNS_SERVERS);


// utility functions
function verifyLookup(options) {
    return function (done) {
        if (options === undefined) {
            dns.lookup(HOSTNAME, function (err, address, family) {
                if (err) {
                    done(err);
                } else {
                    originalLookup(HOSTNAME, 4, function (err2, address2, family2) {
                        if (err2) {
                            done(err2);
                        } else {
                            try {
                                expect(address2).toEqual(address);
                                expect(family2).toEqual(family);
                                done();
                            } catch (error) {
                                done(error);
                            }
                        }
                    });
                }
            });
        } else {
            dns.lookup(HOSTNAME, options, function (err, address, family) {
                if (err) {
                    done(err);
                } else {
                    var opts = 4;
                    if (typeof options === 'object') {
                        opts = Object.assign({}, options);
                        opts.family = 4;
                    }
                    originalLookup(HOSTNAME, opts, function (err2, address2, family2) {
                        if (err2) {
                            done(err2);
                        } else {
                            try {
                                expect(family2).toEqual(family);
                                expect(address2).toEqual(address);
                                done();
                            } catch (error) {
                                done(error);
                            }
                        }
                    });
                }
            });
        }
    };
}

function verifyPromiseLookup(options) {
    return function () {
        if (options === undefined) {
            return Promise.all([
                dns.promises.lookup(HOSTNAME),
                originalPromiseLookup(HOSTNAME, 4)
            ]).then(function (results) {
                expect(results[1]).toEqual(results[0]);
            });
        } else {
            var opts = 4;
            if (typeof options === 'object') {
                opts = Object.assign({}, options);
                opts.family = 4;
            }

            return Promise.all([
                dns.promises.lookup(HOSTNAME, options),
                originalPromiseLookup(HOSTNAME, opts)
            ]).then(function (results) {
                expect(results[1]).toEqual(results[0]);
            });
        }
    };
}


test('dns.setServers() never changes dns.lookup()', function () { expect(dns.lookup).toBe(lookup) });
test('dns.lookup(hostname)', verifyLookup());
test('dns.lookup(hostname, 4)', verifyLookup(4));
test('dns.lookup(hostname, 6)', verifyLookup(6));
test('dns.lookup(hostname, 0)', verifyLookup(0));
test('dns.lookup(hostname, {family: 4})', verifyLookup({ family: 4 }));
test('dns.lookup(hostname, {family: 6})', verifyLookup({ family: 6 }));
test('dns.lookup(hostname, {family: 0})', verifyLookup({ family: 0 }));
test('dns.lookup(hostname, {family: 4, all: true})', verifyLookup({ family: 4, all: true }));
test('dns.lookup(hostname, {family: 6, all: true})', verifyLookup({ family: 6, all: true }));
test('dns.lookup(hostname, {family: 0, all: true})', verifyLookup({ family: 0, all: true }));

if (dns.promises) {
    promiseLookup = dns.promises.lookup;
    dns.promises.setServers(DNS_SERVERS);

    test('dns.promises.setServers() never changes dns.promises.lookup()', function () { expect(dns.promises.lookup).toBe(promiseLookup) });
    test('dns.promises.lookup(hostname)', verifyPromiseLookup());
    test('dns.promises.lookup(hostname, 4)', verifyPromiseLookup(4));
    test('dns.promises.lookup(hostname, 6)', verifyPromiseLookup(6));
    test('dns.promises.lookup(hostname, 0)', verifyPromiseLookup(0));
    test('dns.promises.lookup(hostname, {family: 4})', verifyPromiseLookup({ family: 4 }));
    test('dns.promises.lookup(hostname, {family: 6})', verifyPromiseLookup({ family: 6 }));
    test('dns.promises.lookup(hostname, {family: 0})', verifyPromiseLookup({ family: 0 }));
    test('dns.promises.lookup(hostname, {family: 4, all: true})', verifyPromiseLookup({ family: 4, all: true }));
    test('dns.promises.lookup(hostname, {family: 6, all: true})', verifyPromiseLookup({ family: 6, all: true }));
    test('dns.promises.lookup(hostname, {family: 0, all: true})', verifyPromiseLookup({ family: 0, all: true }));
}
