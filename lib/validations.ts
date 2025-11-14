import { z } from 'zod'

export const assessmentFormSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  platforms: z.array(z.string()).min(1, 'Please select at least one platform'),
  challenge: z.string().min(10, 'Please describe your challenge (at least 10 characters)'),
  source: z.string().optional(),
})

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type AssessmentFormData = z.infer<typeof assessmentFormSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
