// Turns a product name into the lowercase, dash-separated form most stores use in their
// product web addresses. Shared by the catalog builder (work/build-extra-catalog.mjs) and the
// site, so an address can be left out of the catalog file when this reproduces it exactly.
export const slugify = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
