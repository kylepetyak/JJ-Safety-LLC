'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assessmentFormSchema, type AssessmentFormData } from '@/lib/validations'
import Button from '@/components/ui/Button'
import { CheckCircle2 } from 'lucide-react'

const platformOptions = [
  'ISNetworld',
  'Avetta',
  'Veriforce',
  'ComplyWorks',
  'PEC Safety',
  'BROWZ',
  'Other',
]

const sourceOptions = [
  'Google Search',
  'Referral',
  'LinkedIn',
  'Trade Show',
  'Other',
]

export default function AssessmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentFormSchema),
  })

  const onSubmit = async (data: AssessmentFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSuccess(true)
        reset()
        // Redirect to thank you page after a short delay
        setTimeout(() => {
          window.location.href = '/thank-you'
        }, 1500)
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      alert('Something went wrong. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
        <CheckCircle2 className="text-green-500 mx-auto mb-4" size={48} />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-700">
          We've received your assessment request. Our team will contact you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-semibold text-gray-900 mb-2">
          Company Name *
        </label>
        <input
          {...register('companyName')}
          type="text"
          id="companyName"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          placeholder="Your Company Name"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
        )}
      </div>

      {/* Contact Name */}
      <div>
        <label htmlFor="contactName" className="block text-sm font-semibold text-gray-900 mb-2">
          Contact Name *
        </label>
        <input
          {...register('contactName')}
          type="text"
          id="contactName"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          placeholder="Your Name"
        />
        {errors.contactName && (
          <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            placeholder="you@company.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
            Phone Number
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Platforms */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Current Platforms * (select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {platformOptions.map((platform) => (
            <label key={platform} className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('platforms')}
                type="checkbox"
                value={platform}
                className="w-4 h-4 text-navy-600 border-gray-300 rounded focus:ring-navy-500"
              />
              <span className="text-sm text-gray-700">{platform}</span>
            </label>
          ))}
        </div>
        {errors.platforms && (
          <p className="mt-1 text-sm text-red-600">{errors.platforms.message}</p>
        )}
      </div>

      {/* Challenge */}
      <div>
        <label htmlFor="challenge" className="block text-sm font-semibold text-gray-900 mb-2">
          Biggest Compliance Challenge *
        </label>
        <textarea
          {...register('challenge')}
          id="challenge"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          placeholder="Tell us about your current compliance challenges..."
        />
        {errors.challenge && (
          <p className="mt-1 text-sm text-red-600">{errors.challenge.message}</p>
        )}
      </div>

      {/* Source */}
      <div>
        <label htmlFor="source" className="block text-sm font-semibold text-gray-900 mb-2">
          How did you hear about us?
        </label>
        <select
          {...register('source')}
          id="source"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
        >
          <option value="">Select an option</option>
          {sourceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Get Free Assessment'}
        </Button>
        <p className="mt-3 text-xs text-gray-500 text-center">
          By submitting this form, you agree to our{' '}
          <a href="/privacy-policy" className="text-navy-600 hover:underline">
            Privacy Policy
          </a>
          . We'll respond within 24 hours.
        </p>
      </div>
    </form>
  )
}
