import { useEffect, useState } from 'react'

export function Splash({ status }: { status?: string }) {
  const [logoVisible, setLogoVisible] = useState(false)
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLogoVisible(true), 100)
    const t2 = setTimeout(() => setTextVisible(true), 500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className="fixed inset-0 gradient-primary flex items-center justify-center safe-top safe-bottom">
      <div className="flex flex-col items-center px-6">
        <div
          className={`transition-all duration-500 ease-out ${
            logoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          <div className="w-24 h-24 xs:w-[7.5rem] xs:h-[7.5rem] rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.2)] overflow-hidden flex items-center justify-center bg-white/10">
            <img src="/splash.png" alt="Mario Business" className="w-full h-full object-cover" />
          </div>
        </div>
        <div
          className={`mt-7 flex flex-col items-center transition-all duration-350 ease-out ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <h1 className="text-white text-2xl xs:text-[28px] font-extrabold tracking-tight text-center">
            Mario Business
          </h1>
          <p className="text-white/60 text-sm font-normal mt-2">
            Business Dashboard & Analytics
          </p>
          <div className="mt-8">
            {status ? (
              <p className="text-white/50 text-[13px]">{status}</p>
            ) : (
              <div className="w-7 h-7 border-2 border-white/30 border-t-primary-light rounded-full animate-spin" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
