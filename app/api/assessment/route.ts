import { NextResponse } from 'next/server'
import { assessmentFormSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the form data
    const validatedData = assessmentFormSchema.parse(body)

    // If ZOHO_WEBHOOK_URL is configured, send to Zoho
    if (process.env.ZOHO_WEBHOOK_URL) {
      const zohoResponse = await fetch(process.env.ZOHO_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validatedData,
          platforms: validatedData.platforms.join(', '),
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!zohoResponse.ok) {
        console.error('Zoho webhook failed:', await zohoResponse.text())
      }
    }

    // TODO: You can also send an email notification here
    // For now, just log the submission
    console.log('Assessment form submission:', validatedData)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Assessment form error:', error)
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 400 }
    )
  }
}
