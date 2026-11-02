# Content Model

## News item
`id`, `title`, `slug`, `summary` (original wording), `publishedAt`, `sourceName`, `sourceUrl`, `status` (draft / needs-review / verified / published / rejected), `reviewedBy`, `reviewedAt`, `dedupeKey`.

## Video item
`id`, `title`, `creatorOrSource`, `sourceUrl`, `publishedAt` (only if verified), `embedUrl` (only if permitted), `status`, `rightsNotes`.

## Biography timeline item
`dateOrPeriod`, `event`, `summary`, `sourceUrl`, `verificationStatus`.

## Image asset
See `IMAGE_ASSET_MANIFEST.md`. Record source URL/publisher, intended placement, confirmation the person is TTF Vasan, bike evidence if relevant, permission/licensing or permitted-embed status, factual alt text, reviewer/date, and approval status.

An unverified submission, search thumbnail, or similar-looking person/bike is not proof.
