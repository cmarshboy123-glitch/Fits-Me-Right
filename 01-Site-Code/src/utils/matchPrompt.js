// A ready-to-paste prompt for any AI shopping assistant, filled in from the "Find my match" form.
// It is only text: nothing is sent anywhere by building or copying it.
const field = (value) => (String(value || '').trim() ? String(value).trim() : '[not specified]')

export function buildPrompt(form) {
  const store = String(form.store || '').trim() || '[STORE WEBSITE]'
  const min = String(form.minPrice || '').trim()
  const max = String(form.maxPrice || '').trim()
  const price = min || max ? `${min ? `$${min}` : 'no minimum'} to ${max ? `$${max}` : 'no maximum'}` : '[not specified]'
  const item = [form.description, form.category, form.gender ? `for ${String(form.gender).toLowerCase()}` : ''].filter((value) => String(value || '').trim()).join(' / ')

  return `Find a fashion item on ${store} that closely matches the following product description:
• Item: ${field(item)}
• Brand: ${field(form.brand)}
• Color: ${field(form.color)}
• Material: ${field(form.material)}
• Fit: ${field(form.fit)}
• Style: ${field(form.style)}
• Design details: ${field(form.details)}
• Price range: ${price}
• Size: ${field(form.size)}

Search the actual retailer website and identify the closest matching products.
Prioritize visual and design accuracy over general similarity.
Only recommend products that are currently listed on the retailer's website.
Provide the direct product page link, product name, price, available sizes, and a matching score.
Do not invent products or links. If no exact match exists, clearly identify the closest alternatives and explain the differences.

How to search:
• Search the retailer's own website, not just Google Images or general shopping websites.
• Use the website's internal search function where possible.
• Search using alternative fashion terminology and synonyms.
• Check product images, descriptions, specifications, and size availability.
• Compare the actual product images against the requested item.
• Verify that the product page exists and is accessible.
• Do not return discontinued, unavailable, or fabricated products.
• Distinguish exact matches from visually similar alternatives.

Prioritize:
• Same garment category.
• Same overall silhouette and proportions.
• Same design and construction details.
• Closest possible color and material.
• Similar fit and length.
Do not recommend products simply because they have a similar overall aesthetic.

Results:
Return the five closest matching products in ranked order. For each product provide:
• Product name.
• Product image.
• Direct retailer product URL.
• Current listed price.
• Available sizes, if verifiable.
• Match score from 0–100%.
• Explanation of matching characteristics.
• Differences from the requested item.

Accuracy rules:
• Use actual products listed on the specified retailer website.
• Never fabricate product names, prices, links, or stock information.
• Clearly distinguish exact matches from alternatives.
• If no suitable match exists, say so.
• Do not claim to have verified availability unless the retailer listing confirms it.`
}
