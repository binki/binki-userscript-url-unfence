const binkiUserscriptUrlUnfenceAsync = (() => {
  const knownServicesByHost = new Map([
    ['www.google.com', url => {
      if (url.startsWith('https://www.google.com/url')) {
        return new URL(url).searchParams.get('url');
      }
    }],
    ['l.messenger.com', url => {
      if (url.startsWith('https://l.messenger.com/l.php')) {
        return new URL(url).searchParams.get('u');
      }
    }],
    ['nam10.safelinks.protection.outlook.com', url => {
      if (url.startsWith('https://nam10.safelinks.protection.outlook.com/')) {
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
  ]);
  return async url => {
    if (typeof url !== 'string') throw new Error('url must be string');
    // Avoid full URL parsing if we can. Support scheme-relative but require “//” because otherwise it is a relative URL.
    const hostMatch = /^(?:[a-zA-Z0-9]+:)?\/\/(\[[^]]+]|[^:/]+)/.exec(url);
    // We have a relative URL or something which is malformed. Pass it through. We do not require well-formed until we match a provider.
    if (hostMatch) {
      const hostInfo = knownServicesByHost.get(hostMatch[1]);
      if (hostInfo) {
        const maybeTransformedUrl = await hostInfo(url);
        if (maybeTransformedUrl !== undefined) return await binkiUserscriptUrlUnfenceAsync(maybeTransformedUrl);
      }
    }
    return url;
  };
})();
