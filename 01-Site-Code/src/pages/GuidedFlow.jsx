import { ArrowLeft, ArrowRight, BookmarkPlus, Check, RotateCcw, Ruler, Shirt, SlidersHorizontal, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BodyShape from '../components/BodyShape'
import ProductGrid from '../components/ProductGrid'
import { useStyle } from '../context/StyleContext'
import { getRecommendedProducts } from '../services/catalogService'
import { summarizeSelections } from '../utils/summarizeSelections'

const steps = ['gender', 'body-type', 'price', 'shirt-size', 'pants-size', 'dress-code', 'save-profile', 'results']
const womenBodyTypes = ['Straight', 'Curvy', 'Athletic', 'Petite', 'Tall', 'Plus']
const menBodyTypes = ['Slim', 'Balanced', 'Athletic', 'Broad', 'Big & Tall', 'Short']
const bodyTypeDetails = {
  Straight: 'Even through shoulder, waist, and hip',
  Curvy: 'Defined waist with fuller curves',
  Athletic: 'Muscular, defined proportions',
  Petite: 'Smaller frame and shorter proportions',
  Tall: 'Longer torso and limbs',
  Plus: 'Fuller proportions throughout',
  Slim: 'Narrow shoulders and lean frame',
  Balanced: 'Even proportions through shoulders and torso',
  Broad: 'Wider shoulders and upper body',
  'Big & Tall': 'Larger frame with longer proportions',
  Short: 'Shorter torso and limbs',
}
const shirtSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', 'Not sure']
const womenPants = ['00', '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20W', '22W', '24W', 'Not sure']
const menPants = ['28 × 30', '30 × 30', '32 × 30', '32 × 32', '34 × 32', '36 × 32', '38 × 32', '40 × 32', '42 × 32', '44 × 32', '46 × 32', '48 × 32', 'Not sure']
const prices = [
  { value: 'budget', title: 'On a Budget', detail: 'Under $100', stores: ['H&M', 'Old Navy', 'Uniqlo', 'ASOS'] },
  { value: 'treat', title: 'Mid Range', detail: '$100–$300', stores: ['Macy’s', 'Nordstrom', 'COS', 'Reformation'] },
  { value: 'splurge', title: 'Let’s Splurge', detail: 'Above $300', stores: ['Saks Fifth Avenue', 'Net-a-Porter', 'Gucci', 'Prada'] },
]
const womenDressCodes = ['Casual', 'Business Casual', 'Professional/Formal Business', 'Formal Attire', 'Cocktail Dress', 'Bohemian', 'Active Wear', 'Semi-Formal']
const menDressCodes = [...womenDressCodes.slice(0, 6), 'Black Tie', ...womenDressCodes.slice(6)]

export default function GuidedFlow() {
  const { step } = useParams()
  const navigate = useNavigate()
  const { selections, profiles, updateSelection, resetSelections, saveProfile, loadProfile, deleteProfile } = useStyle()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(step === 'results')
  const [profileName, setProfileName] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)
  const index = steps.indexOf(step)
  const bodyTypes = selections.gender === 'Men' ? menBodyTypes : womenBodyTypes
  const pantsSizes = selections.gender === 'Men' ? menPants : womenPants
  const dressCodes = selections.gender === 'Men' ? menDressCodes : womenDressCodes
  const selectedPrice = prices.find((price) => price.value === selections.priceTier)
  const filterStepCount = steps.length - 1
  const latestVerifiedAt = results.map((product) => product.verifiedAt).filter(Boolean).sort().at(-1)
  const latestVerifiedLabel = latestVerifiedAt
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${latestVerifiedAt}T00:00:00Z`))
    : null

  useEffect(() => { if (index === -1) navigate('/style/gender', { replace: true }) }, [index, navigate])
  useEffect(() => {
    if (step === 'results') {
      setLoading(true)
      getRecommendedProducts(selections).then((items) => { setResults(items); setLoading(false) })
    }
  }, [step, selections])

  const choose = (key, value) => { updateSelection(key, value); navigate(`/style/${steps[index + 1]}`) }
  const choosePriceAndSearch = (value) => {
    updateSelection('priceTier', value)
    const params = new URLSearchParams({ gender: selections.gender, bodyType: selections.bodyType, priceTier: value })
    navigate(`/shop?${params.toString()}`)
  }
  const back = () => navigate(index > 0 ? `/style/${steps[index - 1]}` : '/')
  const restart = () => { resetSelections(); navigate('/style/gender') }
  const saveCurrentProfile = () => {
    const name = profileName.trim()
    if (!name) return
    saveProfile(name)
    setProfileName('')
    setProfileSaved(true)
  }
  const useSavedProfile = (id) => { loadProfile(id); navigate('/style/results') }

  if (step === 'results') {
    return (
      <section className="mx-auto min-h-[70vh] max-w-[1440px] px-4 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-black pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#D3A11E]">Your personal edit</p><h1 className="mt-2 text-4xl font-black tracking-tight">Made to fit your life.</h1><p className="mt-3 text-sm text-neutral-600">{summarizeSelections(selections, ['gender', 'bodyType', () => selectedPrice?.title, (s) => s.shirtSize && `Shirt ${s.shirtSize}`, (s) => s.pantsSize && `Pants ${s.pantsSize}`, 'dressCode'])}</p></div>
          <button onClick={restart} className="flex items-center gap-2 text-sm font-bold"><RotateCcw size={16} /> START AGAIN</button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 py-6"><p className="text-sm font-bold">{loading ? 'CURATING…' : `${results.length} MATCH${results.length === 1 ? '' : 'ES'}`}</p><div className="flex items-center gap-5"><button onClick={() => navigate('/style/save-profile')} className="flex items-center gap-2 text-sm font-bold"><BookmarkPlus size={17} /> SAVE PROFILE</button><button onClick={() => navigate('/style/dress-code')} className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={17} /> EDIT FILTERS</button></div></div>
        {!loading && results.length > 0 && <><div className="mb-7 border-y border-black py-5"><p className="text-[10px] font-black uppercase tracking-[.24em] text-amber-800">Verified direct matches</p><div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">{[...new Set(results.map((product) => product.vendor))].map((vendor) => <span key={vendor}>{vendor}</span>)}</div><p className="mt-3 max-w-2xl text-xs leading-5 text-neutral-500">Each button opens that exact retailer product page. Prices and size availability {latestVerifiedLabel ? `were checked ${latestVerifiedLabel}` : 'are a snapshot'} and can change at the store.</p></div><ProductGrid products={results} /></>}
        {!loading && results.length === 0 && <div className="grid place-items-center rounded-3xl bg-neutral-100 px-6 py-24 text-center"><div><p className="text-xs font-bold uppercase tracking-widest text-[#D3A11E]">The edit is still in progress</p><h2 className="mt-3 text-3xl font-black">No exact matches””yet.</h2><p className="mx-auto mt-3 max-w-md text-neutral-600">Try adjusting one detail and we’ll widen the rail.</p><button onClick={() => navigate('/style/dress-code')} className="mt-7 rounded-full bg-black px-7 py-4 text-sm font-bold text-white">CHANGE DRESS CODE</button></div></div>}
      </section>
    )
  }

  const titles = {
    gender: ['First, who are we styling?', 'Choose the collection you’d like to explore.'],
    'body-type': [selections.gender === 'Men' ? 'How would you describe your build?' : 'What feels most like you?', 'This gives us a better starting point for proportion and fit.'],
    'shirt-size': ['What shirt size fits best?', 'Choose your usual size. You can always check the retailer’s final size chart.'],
    'pants-size': [selections.gender === 'Men' ? 'What waist and inseam do you wear?' : 'What pants size fits best?', selections.gender === 'Men' ? 'Select your usual waist × inseam combination.' : 'Choose your usual numeric or plus size.'],
    price: ['What feels good to spend?', 'Choose a range to filter both products and the stores we bring into your edit.'],
    'dress-code': ['Where are you headed?', 'Choose the setting and we’ll bring the right level of polish.'],
    'save-profile': ['Would you like to save these preferences?', 'Give this edit a name so you can keep separate profiles for work, weekends, events, or anyone else you shop for.'],
  }

  return (
    <section className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 lg:px-8 lg:py-16">
      <div className="mb-12"><div className="mb-6 flex items-center justify-between text-xs font-bold"><span>YOUR STYLE EDIT</span><span>{index + 1} / {filterStepCount}</span></div><div className="h-1 overflow-hidden rounded-full bg-neutral-200"><div className="h-full bg-[#D3A11E] transition-all" style={{ width: `${((index + 1) / filterStepCount) * 100}%` }} /></div></div>
      <button onClick={back} className="mb-8 flex items-center gap-2 text-sm font-bold"><ArrowLeft size={17} /> BACK</button>
      <div className="mb-10 max-w-2xl"><h1 className="text-4xl font-black tracking-tight sm:text-5xl">{titles[step]?.[0]}</h1><p className="mt-4 leading-7 text-neutral-600">{titles[step]?.[1]}</p></div>

      <div key={step} className="guided-step-enter">
      {step === 'gender' && <div className="grid gap-4 sm:grid-cols-2">{['Women', 'Men'].map((value) => <button key={value} onClick={() => choose('gender', value)} className="group relative min-h-[440px] overflow-hidden rounded-[2rem] text-left text-white"><img src={value === 'Women' ? '/assets/fit-women-diverse-v4.webp' : '/assets/fit-men-diverse-v4.webp'} alt={`${value} from diverse backgrounds with varied builds`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent" /><div className="absolute bottom-0 flex w-full items-center justify-between p-7"><span className="text-3xl font-black">{value}</span><ArrowRight /></div></button>)}</div>}

      {step === 'body-type' && <div className="grid border-y border-black lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-black bg-[#F4EEE2] p-6 lg:border-b-0 lg:border-r lg:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[.22em] text-amber-800">A note on fit</p>
          <h2 className="mt-5 text-2xl font-black tracking-tight">Bodies are individual. These are simply starting points.</h2>
          <p className="mt-4 text-sm leading-6 text-neutral-700">Choose the proportion closest to yours. Next, set a spending range to see which stores belong in your edit.</p>
        </aside>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          {bodyTypes.map((value) => <button key={value} onClick={() => choose('bodyType', value)} className={`group flex min-h-64 flex-col items-center justify-between border-b border-r border-neutral-300 p-5 text-center transition-colors hover:bg-[#FBF3E4] ${selections.bodyType === value ? 'bg-[#E8C45D] text-black' : 'bg-white'}`}>
            <BodyShape type={value} gender={selections.gender} />
            <span><span className="block text-base font-black">{value}</span><span className="mt-1 block text-xs leading-5 text-neutral-600 group-hover:text-neutral-800">{bodyTypeDetails[value]}</span></span>
          </button>)}
        </div>
      </div>}

      {step === 'shirt-size' && <SizeGrid icon={<Shirt size={28} />} sizes={shirtSizes} selected={selections.shirtSize} onChoose={(value) => choose('shirtSize', value)} />}
      {step === 'pants-size' && <SizeGrid icon={<Ruler size={28} />} sizes={pantsSizes} selected={selections.pantsSize} onChoose={(value) => choose('pantsSize', value)} />}
      {step === 'price' && <div className="grid border-l border-t border-black md:grid-cols-3">{prices.map((price, index) => <button key={price.value} onClick={() => choosePriceAndSearch(price.value)} className="group flex min-h-80 flex-col items-start justify-between border-b border-r border-black p-7 text-left transition-colors hover:bg-[#E8C45D]"><span className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-[.22em]"><span>Price edit</span><span>0{index + 1}</span></span><span className="block"><span className="block text-3xl font-black tracking-tight">{price.title}</span><span className="mt-2 block text-neutral-600 group-hover:text-black">{price.detail}</span><span className="mt-7 block border-t border-black/25 pt-4 text-[10px] font-black uppercase tracking-[.18em]">Stores you may see</span><span className="mt-2 block text-xs leading-6 text-neutral-600 group-hover:text-black">{price.stores.join(' · ')}</span><span className="mt-5 block text-[10px] font-black uppercase tracking-[.18em]">Search this edit</span></span><ArrowRight /></button>)}</div>}
      {step === 'dress-code' && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{dressCodes.map((value, i) => <button key={value} onClick={() => choose('dressCode', value)} className="flex min-h-28 items-center justify-between rounded-2xl border border-neutral-300 p-5 text-left font-bold transition hover:border-black hover:bg-[#FFF1C7]"><span><span className="mr-4 text-xs text-neutral-400">{String(i + 1).padStart(2, '0')}</span>{value}</span><ArrowRight size={18} /></button>)}</div>}
      {step === 'save-profile' && <div className="grid border-y border-black lg:grid-cols-[1fr_1.15fr]">
        <div className="border-b border-black bg-[#F4EEE2] p-7 lg:border-b-0 lg:border-r lg:p-10">
          <p className="text-[10px] font-black uppercase tracking-[.24em] text-amber-800">Current preferences</p>
          <dl className="mt-7 grid grid-cols-[auto_1fr] gap-x-7 gap-y-4 text-sm"><dt className="text-neutral-500">Collection</dt><dd className="font-bold">{selections.gender}</dd><dt className="text-neutral-500">Proportion</dt><dd className="font-bold">{selections.bodyType}</dd><dt className="text-neutral-500">Budget</dt><dd className="font-bold">{selectedPrice?.title}</dd><dt className="text-neutral-500">Shirt</dt><dd className="font-bold">{selections.shirtSize}</dd><dt className="text-neutral-500">Pants</dt><dd className="font-bold">{selections.pantsSize}</dd><dt className="text-neutral-500">Occasion</dt><dd className="font-bold">{selections.dressCode}</dd></dl>
          <button onClick={() => navigate('/style/results')} className="mt-9 flex items-center gap-2 text-xs font-black">SKIP AND SEE RESULTS <ArrowRight size={16} /></button>
        </div>
        <div className="p-7 lg:p-10">
          <label htmlFor="profile-name" className="text-sm font-black">Name this profile</label>
          <p className="mt-2 text-sm leading-6 text-neutral-600">Try “Work,” “Weekend,” “Event looks,” or a person’s name.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row"><input id="profile-name" value={profileName} onChange={(event) => { setProfileName(event.target.value); setProfileSaved(false) }} placeholder="Weekend style" className="min-h-14 flex-1 border border-black px-4 outline-none" /><button onClick={saveCurrentProfile} disabled={!profileName.trim()} className="flex min-h-14 items-center justify-center gap-2 bg-black px-6 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-35"><BookmarkPlus size={17} /> SAVE PROFILE</button></div>
          {profileSaved && <p className="mt-4 flex items-center gap-2 text-sm font-bold text-amber-800"><Check size={17} /> Profile saved. You can create another or continue to results.</p>}
          {profiles.length > 0 && <div className="mt-9 border-t border-black pt-6"><div className="flex items-center justify-between"><h2 className="font-black">Your saved profiles</h2><span className="text-xs font-bold">{profiles.length}</span></div><div className="mt-4 grid gap-3">{profiles.map((profile) => <div key={profile.id} className="flex items-center justify-between gap-4 border border-neutral-300 p-4"><button onClick={() => useSavedProfile(profile.id)} className="min-w-0 flex-1 text-left"><span className="block truncate font-black">{profile.name}</span><span className="mt-1 block truncate text-xs text-neutral-500">{summarizeSelections(profile.selections, ['gender', 'bodyType', 'dressCode'])}</span></button><button onClick={() => deleteProfile(profile.id)} aria-label={`Delete ${profile.name} profile`} className="p-2 text-neutral-500 hover:text-black"><Trash2 size={17} /></button></div>)}</div></div>}
          <button onClick={() => navigate('/style/results')} className="mt-8 flex w-full items-center justify-center gap-3 bg-[#D3A11E] px-6 py-4 text-xs font-black">VIEW MY RESULTS <ArrowRight size={16} /></button>
        </div>
      </div>}
      </div>
    </section>
  )
}

function SizeGrid({ icon, sizes, selected, onChoose }) {
  return <div><div className="mb-5 flex items-center gap-3 rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white">{icon} Fit preferences are saved for this style edit</div><div className="grid grid-cols-3 gap-3 sm:grid-cols-5">{sizes.map((size) => <button key={size} onClick={() => onChoose(size)} className={`min-h-20 rounded-2xl border px-3 text-sm font-bold transition hover:border-black ${selected === size ? 'border-black bg-[#D3A11E] text-black' : 'border-neutral-300 bg-white'}`}>{size}</button>)}</div></div>
}
