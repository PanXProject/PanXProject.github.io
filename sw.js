/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-33eaf75cffd4b634d934.js"
  },
  {
    "url": "styles.c61ac265b787f422ff96.css"
  },
  {
    "url": "styles-31f023f48facb69035d3.js"
  },
  {
    "url": "framework-6c3ead24af170cdcb87c.js"
  },
  {
    "url": "app-c1ecc40bd7d3eefb1d4a.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "d61a7beedadf254f7ee984cf82bcab2b"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-16703ee5599528db9f93.js"
  },
  {
    "url": "page-data/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "f6081b83111aea4128c98944b7fafccc"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "527eaaae9f9893731458982b9ccd9c7e"
  },
  {
    "url": "polyfill-6ed41a637bbcdd69b96c.js"
  },
  {
    "url": "a0b137515e3b2e869b55c29d2d2e4ed85134c9ec-ae6a996c9eb69a073f30.js"
  },
  {
    "url": "component---src-pages-index-js-84976ede5d4b51f669b1.js"
  },
  {
    "url": "page-data/index/page-data.json",
    "revision": "62bf3b8eb3d2c470f9e50182b4c8c313"
  },
  {
    "url": "page-data/sq/d/3128451518.json",
    "revision": "25e8cace8740e139cf1e4782ad2a9037"
  },
  {
    "url": "page-data/sq/d/3649515864.json",
    "revision": "b8266ed98419d19023833020ca66f34c"
  },
  {
    "url": "component---src-pages-about-js-461b7d7e9d9ab441185a.js"
  },
  {
    "url": "page-data/about/page-data.json",
    "revision": "412f320bd64bb8d7e64c6c893c2d25d0"
  },
  {
    "url": "component---src-pages-start-js-b6bc3ae90c641a88de29.js"
  },
  {
    "url": "page-data/start/page-data.json",
    "revision": "c00be0d10d731210e69bd1c781d96ff3"
  },
  {
    "url": "component---src-pages-signup-js-cca49a559a709f36e408.js"
  },
  {
    "url": "page-data/signup/page-data.json",
    "revision": "f05febc05411597e3c24e441d4a17658"
  },
  {
    "url": "component---src-pages-services-js-9c13d277275ea5b74bf0.js"
  },
  {
    "url": "page-data/services/page-data.json",
    "revision": "401bd0984a2e5903e4af61d1577772d4"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "f2ad903a154dc3ae604d9fe133874fc3"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\/page-data\/.*\.json/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-c1ecc40bd7d3eefb1d4a.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
