import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getProducts, invalidateCatalogCache } from '../services/catalogService'
import { AdminAuthError, clearStoredAdminKey, createProduct, deleteProduct, getStoredAdminKey, setStoredAdminKey, updateProduct } from '../services/adminService'
import { shoppingCategories } from '../utils/searchIntent'

const genders = ['Women', 'Men', 'Children']
const priceTiers = [['budget', 'On a Budget'], ['treat', 'Mid Range'], ['splurge', "Let's Splurge"]]
const storeTiers = ['Everyday & Designer', 'Luxury', 'Asian Market']
const bodyTypesByGender = {
  Women: ['Straight', 'Curvy', 'Athletic', 'Petite', 'Tall', 'Plus'],
  Men: ['Slim', 'Balanced', 'Athletic', 'Broad', 'Big & Tall', 'Short'],
  Children: ['Slim', 'Regular', 'Tall', 'Short'],
}
const dressCodes = ['Casual', 'Business Casual', 'Professional/Formal Business', 'Formal Attire', 'Black Tie', 'Bohemian', 'Cocktail Dress', 'Semi-Formal']

const blankForm = {
  name: '', gender: 'Women', category: 'Tops', price: '', priceTier: 'budget', imageUrl: '',
  vendor: '', brand: '', color: '', storeTier: 'Everyday & Designer',
  bodyType: [], dressCode: [], shirtSizes: '', pantsSizes: '',
  productUrl: '', verifiedAt: '', fitNote: '',
}

// "Balanced" is what the UI shows for men; the database stores "Regular" for
// that same body type (see Shop.jsx's own bodyType/catalogBodyType mapping).
const toDisplayBodyType = (value) => (value === 'Regular' ? 'Balanced' : value)
const toStoredBodyType = (value) => (value === 'Balanced' ? 'Regular' : value)

export default function Admin() {
  const [adminKey, setAdminKey] = useState(getStoredAdminKey())
  const [keyInput, setKeyInput] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadProducts = () => {
    setLoading(true)
    invalidateCatalogCache()
    getProducts().then(setProducts).finally(() => setLoading(false))
  }

  useEffect(() => { loadProducts() }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) =>
      product.name.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term) ||
      product.vendor?.toLowerCase().includes(term) ||
      String(product.id) === term,
    )
  }, [products, search])

  const unlock = (event) => {
    event.preventDefault()
    setStoredAdminKey(keyInput)
    setAdminKey(keyInput)
    setKeyInput('')
  }

  const signOut = () => {
    clearStoredAdminKey()
    setAdminKey('')
  }

  const openNew = () => { setEditingId(null); setForm(blankForm); setError('') }
  const openEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name, gender: product.gender, category: product.category, price: String(product.price),
      priceTier: product.priceTier, imageUrl: product.imageUrl, vendor: product.vendor, brand: product.brand,
      color: product.color, storeTier: product.storeTier,
      bodyType: (product.bodyType || []).map(toDisplayBodyType), dressCode: product.dressCode || [],
      shirtSizes: (product.availableShirtSizes || []).join(', '), pantsSizes: (product.availablePantsSizes || []).join(', '),
      productUrl: product.productUrl || '', verifiedAt: product.verifiedAt || '', fitNote: product.fitNote || '',
    })
    setError('')
  }
  const closeForm = () => { setForm(null); setEditingId(null); setError('') }

  const toggleListValue = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value],
    }))
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return
    try {
      await deleteProduct(adminKey, product.id)
      loadProducts()
    } catch (deleteError) {
      if (deleteError instanceof AdminAuthError) { signOut(); return }
      setError(deleteError.message)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name, gender: form.gender, category: form.category, price: Number(form.price),
      priceTier: form.priceTier, imageUrl: form.imageUrl, vendor: form.vendor, brand: form.brand,
      color: form.color, storeTier: form.storeTier,
      bodyType: form.bodyType.map(toStoredBodyType), dressCode: form.dressCode,
      availableShirtSizes: form.shirtSizes.split(',').map((size) => size.trim()).filter(Boolean),
      availablePantsSizes: form.pantsSizes.split(',').map((size) => size.trim()).filter(Boolean),
      productUrl: form.productUrl || null, verifiedAt: form.verifiedAt || null, fitNote: form.fitNote || null,
    }

    try {
      if (editingId) await updateProduct(adminKey, editingId, payload)
      else await createProduct(adminKey, payload)
      closeForm()
      loadProducts()
    } catch (submitError) {
      if (submitError instanceof AdminAuthError) { signOut(); return }
      setError(submitError.message)
    } finally {
      setSaving(false)
    }
  }

  if (!adminKey) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-700">Admin</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Catalog manager</h1>
        <p className="mt-3 text-sm text-neutral-600">Enter the admin key to add, edit, or remove products.</p>
        <form onSubmit={unlock} className="mt-6 flex gap-2">
          <input
            type="password"
            value={keyInput}
            onChange={(event) => setKeyInput(event.target.value)}
            placeholder="Admin key"
            className="min-h-12 flex-1 rounded-xl border border-neutral-300 px-4 outline-none focus:border-black"
            autoFocus
          />
          <button className="rounded-xl bg-black px-5 text-sm font-bold text-white">UNLOCK</button>
        </form>
      </section>
    )
  }

  return (
    <section className="mx-auto min-h-[70vh] max-w-[1200px] px-4 py-14 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Catalog manager</h1>
          <p className="mt-1 text-sm text-neutral-600">{products.length} products live in the database.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openNew} className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-bold text-white"><Plus size={15} /> ADD PRODUCT</button>
          <button onClick={signOut} className="rounded-full border border-neutral-300 px-5 py-3 text-xs font-bold">SIGN OUT</button>
        </div>
      </div>

      {form && (
        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-neutral-200 bg-[#F5F3EE] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{editingId ? `Edit product #${editingId}` : 'New product'}</h2>
            <button type="button" onClick={closeForm}><X size={18} /></button>
          </div>
          {error && <p className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-sm font-bold text-red-700">{error}</p>}

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" /></Field>
            <Field label="Brand"><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="admin-input" /></Field>
            <Field label="Vendor / store"><input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className="admin-input" /></Field>
            <Field label="Price ($)"><input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="admin-input" /></Field>
            <Field label="Color"><input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="admin-input" /></Field>
            <Field label="Image URL"><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/assets/catalog/example.webp" className="admin-input" /></Field>

            <Field label="Collection"><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value, bodyType: [] })} className="admin-input">{genders.map((g) => <option key={g}>{g}</option>)}</select></Field>
            <Field label="Category"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input">{shoppingCategories.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Price point"><select value={form.priceTier} onChange={(e) => setForm({ ...form, priceTier: e.target.value })} className="admin-input">{priceTiers.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
            <Field label="Market"><select value={form.storeTier} onChange={(e) => setForm({ ...form, storeTier: e.target.value })} className="admin-input">{storeTiers.map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Shirt sizes (comma separated)"><input value={form.shirtSizes} onChange={(e) => setForm({ ...form, shirtSizes: e.target.value })} placeholder="XS, S, M, L, XL" className="admin-input" /></Field>
            <Field label="Pants sizes (comma separated)"><input value={form.pantsSizes} onChange={(e) => setForm({ ...form, pantsSizes: e.target.value })} placeholder="28, 30, 32, 34" className="admin-input" /></Field>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">Body types</p>
            <div className="flex flex-wrap gap-2">
              {bodyTypesByGender[form.gender].map((type) => (
                <Chip key={type} active={form.bodyType.includes(type)} onClick={() => toggleListValue('bodyType', type)}>{type}</Chip>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-neutral-500">Dress codes</p>
            <div className="flex flex-wrap gap-2">
              {dressCodes.map((code) => (
                <Chip key={code} active={form.dressCode.includes(code)} onClick={() => toggleListValue('dressCode', code)}>{code}</Chip>
              ))}
            </div>
          </div>

          <details className="mt-5">
            <summary className="cursor-pointer text-xs font-bold text-neutral-600">Optional — verified retailer link</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Product URL"><input value={form.productUrl} onChange={(e) => setForm({ ...form, productUrl: e.target.value })} className="admin-input" /></Field>
              <Field label="Verified at"><input value={form.verifiedAt} onChange={(e) => setForm({ ...form, verifiedAt: e.target.value })} className="admin-input" /></Field>
              <Field label="Fit note"><input value={form.fitNote} onChange={(e) => setForm({ ...form, fitNote: e.target.value })} className="admin-input" /></Field>
            </div>
          </details>

          <div className="mt-6 flex gap-3">
            <button disabled={saving} className="rounded-full bg-black px-6 py-3 text-xs font-black text-white disabled:opacity-50">{saving ? 'SAVING…' : editingId ? 'SAVE CHANGES' : 'CREATE PRODUCT'}</button>
            <button type="button" onClick={closeForm} className="rounded-full border border-neutral-300 px-6 py-3 text-xs font-black">CANCEL</button>
          </div>
        </form>
      )}

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name, brand, vendor, or id…"
        className="admin-input mt-8 max-w-md"
      />

      <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-neutral-100 text-[10px] font-black uppercase tracking-[.14em] text-neutral-500">
            <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Vendor</th><th className="px-4 py-3" /></tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-500">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-500">No products match.</td></tr>
            ) : filtered.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-bold">{product.name}<span className="ml-2 font-normal text-neutral-400">#{product.id}</span></td>
                <td className="px-4 py-3 text-neutral-600">{product.category}</td>
                <td className="px-4 py-3 text-neutral-600">${product.price}</td>
                <td className="px-4 py-3 text-neutral-600">{product.vendor}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(product)} className="rounded-full border border-neutral-300 p-2"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(product)} className="rounded-full border border-neutral-300 p-2 text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`.admin-input { min-height: 3rem; width: 100%; border-radius: 0.75rem; border: 1px solid #d4d4d4; padding: 0 1rem; outline: none; } .admin-input:focus { border-color: black; }`}</style>
    </section>
  )
}

function Field({ label, children }) {
  return <label className="text-xs font-bold"><span className="mb-2 block text-[10px] uppercase tracking-[.18em] text-neutral-500">{label}</span>{children}</label>
}

function Chip({ active, onClick, children }) {
  return <button type="button" onClick={onClick} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${active ? 'bg-black text-white' : 'border border-neutral-300 bg-white'}`}>{children}</button>
}
