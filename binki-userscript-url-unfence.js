const binkiUserscriptUrlUnfenceAsync = (() => {
  const knownServicesByHost = new Map([
    ['www.google.com', url => {
      if (url.startsWith('https://www.google.com/url')) {
        const searchParams = new URL(url).searchParams;
        return searchParams.has('url') ? searchParams.get('url') : searchParams.get('q');
      }
    }],
    ['l.messenger.com', url => {
      if (url.startsWith('https://l.messenger.com/l.php')) {
        return new URL(url).searchParams.get('u');
      }
    }],
    ['safelinks.protection.outlook.com', url => {
      if (/https:\/\/nam[0-9]+.safelinks.protection.outlook.com\//.test(url)) {
        return new URL(url).searchParams.get('url');
      }
    }],
    ['urldefense.proofpoint.com', url => {
      if (url.startsWith('https://urldefense.proofpoint.com/v1/')) {
        return new URL(url).searchParams.get('url');
      }
      if (url.startsWith('https://urldefense.proofpoint.com/v2/')) {
        const u = new URL(url).searchParams.get('u');
        // See NOTES.md. _ means forward-slash, -XX means hexadecimal escape of character including dash or underscore.
        return u.replace(/-..|_/gv, match => {
          if (match === '_') return '/';
          return decodeURIComponent(match.replace('-', '%'));
        });
      }
    }],
    ['urldefense.com', url => {
      if (url.startsWith('https://urldefense.com/v3/')) {
        // Skip the prefix and trim the trailer looking for the marker. See NOTES.md.
        return url.substring(28).replace(/__;!![^!]+![^!]+\$$/gv, '');
      }
    }],
  ]);
  return async url => {
    if (typeof url !== 'string') throw new Error('url must be string');
    // Avoid full URL parsing if we can. Support scheme-relative but require “//” because otherwise it is a relative URL.
    const hostMatch = /^(?:[a-zA-Z0-9]+:)?\/\/(\[[^]]+]|[^:/]+)/.exec(url);
    // We have a relative URL or something which is malformed. Pass it through. We do not require well-formed until we match a provider.
    if (hostMatch) {
      const fullHost = hostMatch[1];
      // Try all domain components. This is forced by nam??.safelinks.protection.outlook.com since the most specific subdomain is a load-balancing/region-specifying identifier.
      for (let i = 0; i < fullHost.length; i++) {
        if (i == 0 || fullHost[i - 1] === '.') {
          const hostInfo = knownServicesByHost.get(fullHost.substring(i));
          if (hostInfo) {
            const maybeTransformedUrl = await hostInfo(url);
            if (maybeTransformedUrl !== undefined) return await binkiUserscriptUrlUnfenceAsync(maybeTransformedUrl);
          }
        }
      }
    }
    return url;
  };
})();
