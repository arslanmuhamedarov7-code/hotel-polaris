# Hotel Polaris — bilingual website (RU / EN)

A static, deploy-ready mirror of [hotelpolaris.ru](https://hotelpolaris.ru/) with a complete English version and a language switch.

## Live site

The site is published on GitHub Pages and opens from any device:

- **Russian:** <https://arslanmuhamedarov7-code.github.io/hotel-polaris/>
- **English:** <https://arslanmuhamedarov7-code.github.io/hotel-polaris/en/>

The link is public — no account, login or local server is needed. Both language versions work on phones; the RU/EN switch keeps the current page.

## What is included

- **28 Russian pages** at the original paths (`/`, `/rooms.html`, `/offers/...`, `/privacy.html`, etc.).
- **28 English pages** at the same paths under `/en/` (`/en/`, `/en/rooms.html`, `/en/offers/...`, `/en/privacy.html`, etc.).
- All styles, scripts, images, PDF menus and other assets, served from the site root and shared by both languages.
- A clearly visible **RU / EN switch** in the desktop header, in the mobile header and in the mobile menu. The switch keeps the current query string (for example a pre-selected room on the booking page).
- `canonical` and `hreflang` (`ru`, `en`, `x-default`) tags on every page.
- An English translation of the privacy policy with a notice that the Russian original prevails.

## English-only details

The English pages do not simply reuse Russian artwork and widgets:

- **English logo** — `images/logo-en.svg` is used in the header and footer on `/en/` pages. The header logo is drawn through a CSS mask, so it is switched with a CSS rule as well. The letter **O** in the main wordmark is the artwork from the Russian logo (ring, four-point star and north/south needles), copied at its original size rather than redrawn.
- **English offer images** — the three promotional images that contain Russian text were recreated in English and are stored separately in `base/cache/en/`:
  - complimentary cinema tickets;
  - the “Your Circle” loyalty programme;
  - the 15% room discount.
  Russian pages continue to use the original images in `base/cache/`.
- **English date picker** — the check-in/check-out fields on `/en/` use the bundled [flatpickr](https://flatpickr.js.org/) calendar (`assets/vendor/flatpickr/`). Month names, weekday names and the selected date are displayed in English; for example `20 November 2026`.
- **English booking form** — the TravelLine booking form on `/en/reservation.html` is initialised with `language=en` and displays English labels and dates.
- **No Russian-only widgets on English pages** — the 101hotels review widget and the LeadBack callback widget are removed from English pages. The TravelLine promotional slider (which is server-managed and was showing Russian slides) is disabled on English marketing pages; the TravelLine booking form is kept on the reservation page.

## Preview locally

Run a static web server from this folder — do not open the files directly with `file://`, because the site uses iframes and external booking services.

```powershell
python -m http.server 8000
```

Then open:

- Russian: <http://localhost:8000/>
- English: <http://localhost:8000/en/>

On this computer you can also double-click **`Start Hotel Polaris.vbs`** (or the desktop shortcut **Hotel Polaris (RU-EN)**). It starts the server if needed and opens the Russian homepage. To open the English homepage directly, run:

```powershell
wscript.exe "Start Hotel Polaris.vbs" "/en/"
```

The VBS launcher uses the Python installation at:

```text
C:\Users\Chamomile\AppData\Local\Programs\Python\Python312\python.exe
```

If the folder is moved to another computer, either edit that path in the VBS file or start the server manually with the command above.

## Deployment

The site is already published with **GitHub Pages** from the public repository `arslanmuhamedarov7-code/hotel-polaris` (branch `main`, folder `/`). Every file in this folder except `.nojekyll`, `README.md` and the local launcher is part of the published site.

To publish the same folder elsewhere, upload the **contents of this folder** to the web root of your hosting (the folder itself does not need to be uploaded as a subdirectory). No PHP, database, build step or server-side configuration is required.

`canonical` and `hreflang` links point to `https://arslanmuhamedarov7-code.github.io/hotel-polaris`. If the site is moved to another domain, replace that base URL in all `.html` files; navigation inside the site is relative and keeps working on any domain or subdirectory.

## Sharing and submission

Send this public link — it works from any phone, tablet or computer:

**<https://arslanmuhamedarov7-code.github.io/hotel-polaris/>**

The ready-to-send archive is **`Hotel Polaris (RU-EN).zip`** on the Desktop. It contains the whole folder, including the launcher, the English pages and all assets, so the site can also be uploaded to another static host.

The `http://127.0.0.1:8000/` address is local: it works only on this computer while the server is running. Use the public link above when the site has to be opened by someone else.

## Translation notes

- All 28 pages are translated, including room pages, special offers, booking pages, contacts, restaurant, banquet/conference halls, gym, SPA and the privacy policy.
- The English copy was reviewed and polished for hotel terminology; prices and measurements use the same figures as the Russian site.
- The English privacy policy is provided for convenience only. The Russian version is the legally binding original and prevails in case of any discrepancy. A notice with a link to the Russian original is shown at the top of `/en/privacy.html`.
- The “Свой круг” loyalty programme is rendered as **“Your Circle”** in English.

## Known limitations

These parts are supplied by third parties or by the original site and cannot be fully translated in a static mirror:

- **PDF restaurant menus** — the original PDF files are in Russian.
- **TravelLine booking engine** — the form itself is requested in English, but individual room descriptions or rate names may still contain provider-managed Russian text. The promotional TravelLine slider is intentionally not shown on English marketing pages.
- **Map image** — the static map is a picture of Surgut; street names on the map image may be in Russian.
- **External links** — VK, MAX, 2GIS, Yandex Maps and the cinema site lead to external Russian-language resources.
- **Online reviews** — the 101hotels widget was removed from English pages to avoid a Russian interface; the review rating shown in the header is part of the translated page copy.

## Layout note

The original site uses a fixed **1240 px** layout. On browser windows narrower than about 1300 px the page can scroll horizontally and the right-hand part of the header may be clipped. To keep the language switch accessible at those widths, it floats in the top-right corner; at 768 px and below the normal mobile layout and mobile menu are used.

## Verification

The build was checked automatically:

- 56 HTML pages (28 RU + 28 EN)
- 4,381 internal links and asset references checked — 0 missing
- 2,818 local assets checked
- no `<base>` tags and no root-absolute internal URLs
- no untranslated Russian text nodes or text attributes on English pages
- all pages contain the language switch, canonical link and three `hreflang` alternates
- TravelLine context is `ru` on Russian pages and `en` on the English booking page; the promotional slider is removed from other English pages
- the English date picker opens with English month and weekday names and stores the selected date in `YYYY-MM-DD` form

The site was also checked in a browser: the English homepage, the English offers page and the English reservation page show English navigation, logo, headings, date fields and booking form.

### Mobile check

All 27 English pages were opened at a **390 px** phone viewport (iPhone 12/13/14 class):

- no horizontal scrolling and no visible element overflowing the viewport;
- the header logo, the RU/EN switch and the hamburger button fit side by side;
- the mobile menu opens, shows the navigation and contains the RU/EN switch;
- headings, room cards, offer cards, the booking form and the footer stack correctly.

The Russian pages share the same stylesheet and layout, so the same mobile rules apply to them. The original fixed 1240 px desktop layout is unchanged above 768 px.
