# dns4 - Node.js module to force IPv4 only lookup

Ubuntu 14.04(Trusty) uses glibc-2.19, which can't reliably resolve IP
address [under some circumstances](https://github.com/coredns/coredns/issues/2802).

Unluckily Node.js doesn't have an option like Java system property `java.net.preferIPv4Stack=true`,
it resolves both IPv4 and IPv6 addresses by default, so here is this tiny magical module.

WARNING: you'd better upgrade your host OS or Docker base image, usage of this hack is not recommended.

## Usage

Just include it in your package.json:

```bash
npm install --save dns4
```

And import it at the **very beginning** of your program:

```javascript
require('dns4')   // hijack functions of module dns

// require() other modules
```

