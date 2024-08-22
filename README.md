Unfence/unprotect/unguard URLs from various providers.

Many services will convert all external URIs in their system into links that first bring you to their own servers and then redirect you directly to the target. These services (generally?) leave the target URI visible so that links can be guarded without needing to access a database and for performance reasons. The use case of these services is to allow the services to do one of the following:

* Check the URL against a blacklist of known phishing websites. (This is the claimed reason by most).
* Show the user a landing page indicating that they are about to navigate to an external, possibly-untrusted or uncondoned website. (Uncommon, but sometimes conditionally shown when a link is copied and pasted into a browser instead of directly opened from within the website which added the fence (e.g., Messenger does this)).

However, these links have some downsides:

* When hovered, the actual target is not shown to the user.
* In Android, this subverts Android’s Intent system in some situations, possibly preventing an app designed to handle the URL from being activated correctly.
* This adds a dependency on a third-party and good internet connection, increasing latency when visiting the link and potentially making links which might work unusable during an outage.

Note, that this is **not** meant to clean trackers from URIs. Unfencing a URI may result in reduced tracking of user activity, but removing affiliate codes, etc., is not the goal of this library.

# Recognized Fences

I made this script a library because I wrote multiple scripts which do unfencing. But they only supports one fencing system. I know there are many fencing systems out there, so I wanted to be able to expand my script to support “everything”. Of course, time and exposure are limited resources. I am intentionally starting this out with just a small list with the hope that I can grow it as I encounter use cases which apply to me. Please file any issues for unsupported fencing systems you come across (but note that tracker removal/URI cleaning is **not** the goal)!

* Facebook Messenger `https://l.messenger.com/l.php?u=`
* Google `https://www.google.com/url?url=`
* Proofpoint URL Defense
   * v1 `https://urldefense.proofpoint.com/v1/?url=`
   * v2 `https://urldefense.proofpoint.com/v2/?u=http-3A__`
   * v3 `https://urldefense.com/v3/__«url»__;!!…!…$`
* Microsoft Outlook protection links `https://nam[0-9][0-9].safelinks.protection.outlook.com/?url=`

# Usage

Include this in your userscript using [`@require`](https://wiki.greasespot.net/Metadata_Block#.40require). It is recommended to [use a permalink](https://docs.github.com/repositories/working-with-files/using-files/getting-permanent-links-to-files) instead of referring to `master`.

```js
// ==UserScript==
// @name example
// @version 1.0
// @require https://github.com/binki/binki-userscript-url-unfence/raw/master/binki-userscript-url-unfence.js
// ==UserScript==

(async () => {
  const fencedUri = 'https://nam10.safelinks.protection.outlook.com/?url=https%3A%2F%2Fgithub.com%2Fbinki%2Fbinki-userscript-url-unfence&data=invalid&sdata=invalid&reserved=0';
  const uri = await binkiUserscriptUrlUnfenceAsync(fencedUri);
})();
```

# API

```js
binkiUserscriptUrlUnfence(url);
```

Parameters:

* `url` is the URI to unfence. It may be any URI. Any fencing iteratively removed until no known fencing is applied.

Note: The API is async in case if there is ever support for unmangling links in a way which requires network access. I am unsure about whether or not that would be an acceptable use-case, but it’t be required for any amount of Twitter support, for example.
