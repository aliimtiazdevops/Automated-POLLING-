# Office Problem Polls (Static Site)

A single-page static website to collect quick votes about common office issues. It stores data in the browser (localStorage) and lets you export a CSV—no backend required.

## Files
- `index.html` — page markup
- `styles.css` — modern, responsive styling
- `script.js` — logic for form, stats, table, CSV export
- (Optional) Add your own logo or favicon later

## Quick Preview (locally)
Double-click `index.html` to open in your browser.

## Host on AWS S3 (Static Website)
1. Create an S3 bucket (name must be globally unique). Uncheck **Block all public access** if you want public website, or use CloudFront for safer public access.
2. Enable **Static website hosting** in bucket properties. Set `index.html` as both **Index** and **Error** documents.
3. Upload `index.html`, `styles.css`, and `script.js` to the bucket.
4. If using public bucket website endpoint, add a bucket policy that allows `s3:GetObject` for `*` on `arn:aws:s3:::YOUR_BUCKET/*`.
5. Open the **Bucket website endpoint** URL to view the site.

## (Recommended) CloudFront + S3
- Keep S3 private and serve through CloudFront.
- Create a CloudFront distribution with your bucket as origin and set the default root object to `index.html`.

## Customize
- Edit the problem list in `index.html` (the `<select>` options).
- Styling can be tweaked in `styles.css`.
- For real submissions to a Google Sheet or email, connect a service like Formspree, Basin, or an API gateway (optional).

## Notes
- Data is per-browser. Use the **Export CSV** button to collect responses across users.
- You can clear all local entries with **Clear All**.
