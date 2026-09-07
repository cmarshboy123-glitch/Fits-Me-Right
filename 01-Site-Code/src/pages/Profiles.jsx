import { ArrowRight, Trash2, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStyle } from '../context/StyleContext'
import { summarizeSelections } from '../utils/summarizeSelections'

export default function Profiles() {
  const { profiles, loadProfile, deleteProfile } = useStyle()
  const navigate = useNavigate()

  const useSavedProfile = (id) => { loadProfile(id); navigate('/style/results') }

  return (
    <section className="mx-auto min-h-[70vh] max-w-4xl px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-widest text-[#D3A11E]">Your account</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Style profiles.</h1>
      <p className="mt-4 max-w-xl leading-7 text-neutral-600">Fits Me Right doesn’t need a password — profiles you save during a style edit live here, on this device, ready to reuse.</p>

      {profiles.length > 0 ? (
        <div className="mt-10 grid gap-3">
          {profiles.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
              <button onClick={() => useSavedProfile(profile.id)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F5F1E9]"><UserRound size={19} /></span>
                <span className="min-w-0">
                  <span className="block truncate font-black">{profile.name}</span>
                  <span className="mt-1 block truncate text-xs text-neutral-500">{summarizeSelections(profile.selections, ['gender', 'bodyType', 'dressCode'])}</span>
                </span>
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => useSavedProfile(profile.id)} aria-label={`Shop with ${profile.name}`} className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2.5 text-[11px] font-bold text-white">SHOP <ArrowRight size={13} /></button>
                <button onClick={() => deleteProfile(profile.id)} aria-label={`Delete ${profile.name} profile`} className="p-2.5 text-neutral-400 hover:text-black"><Trash2 size={17} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid place-items-center rounded-3xl bg-neutral-100 px-6 py-24 text-center">
          <div>
            <UserRound size={40} className="mx-auto text-neutral-300" strokeWidth={1.3} />
            <h2 className="mt-5 text-2xl font-black">No profiles saved yet.</h2>
            <p className="mx-auto mt-3 max-w-md text-neutral-600">Complete a style edit and choose to save it — you can keep separate profiles for work, weekends, or anyone else you shop for.</p>
            <button onClick={() => navigate('/style/gender')} className="mt-7 rounded-full bg-black px-7 py-4 text-sm font-bold text-white">START A STYLE EDIT</button>
          </div>
        </div>
      )}
    </section>
  )
}
