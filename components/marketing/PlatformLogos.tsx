'use client'

import { useEffect, useRef } from 'react'
import Section from '@/components/ui/Section'

const platforms = [
  'ISNetworld',
  'Avetta',
  'Veriforce',
  'ComplyWorks',
  'PEC Safety',
  'BROWZ',
  'Veriforce',
  'ISN',
]

export default function PlatformLogos() {
  return (
    <Section spacing="md" background="gray">
      <div className="text-center mb-8">
        <p className="text-gray-600 font-medium">
          Trusted by companies managing accounts on
        </p>
      </div>

      {/* Logo Slider - Using text placeholders for now */}
      <div className="overflow-hidden">
        <div className="flex items-center justify-center flex-wrap gap-8 lg:gap-12">
          {platforms.map((platform, index) => (
            <div
              key={`${platform}-${index}`}
              className="flex items-center justify-center bg-white rounded-lg shadow-sm px-6 py-4 min-w-[140px] hover:shadow-md transition-shadow"
            >
              <span className="text-gray-700 font-semibold text-sm lg:text-base">
                {platform}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          ...and many more contractor prequalification platforms
        </p>
      </div>
    </Section>
  )
}
