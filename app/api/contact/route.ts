import { NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the form data
    const validatedData = contactFormSchema.parse(body)

    // If ZOHO_WEBHOOK_URL is configured, send to Zoho
    if (process.env.ZOHO_WEBHOOK_URL) {
      const zohoResponse = await fetch(process.env.ZOHO_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validatedData,
          submittedAt: new Date().toISOString(),
          formType: 'contact',
        }),
      })

      if (!zohoResponse.ok) {
        console.error('Zoho webhook failed:', await zohoResponse.text())
      }
    }

    // Log the submission
    console.log('Contact form submission:', validatedData)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 400 }
    )
  }
}
