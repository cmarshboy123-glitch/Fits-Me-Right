import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('Page failed to render:', error)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <section className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 py-20 text-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-700">Something slipped</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">This page didn’t load.</h1>
          <p className="mt-4 leading-7 text-neutral-600">It may have just been updated. Reloading usually fixes it.</p>
          <button onClick={() => window.location.reload()} className="mt-8 rounded-full bg-black px-7 py-4 text-sm font-bold text-white">RELOAD THE PAGE</button>
        </div>
      </section>
    )
  }
}
