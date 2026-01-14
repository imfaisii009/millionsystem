import type { SupportConversation, SupportMessage } from '@/types/support'
import { AGENT_REQUEST_PHRASES } from '@/types/support'

/**
 * Support AI Service - AI response generation using xAI Grok
 */

const XAI_API_BASE = 'https://api.x.ai/v1'
const SUPPORT_MODEL = 'grok-3-mini' // Fast and cost-effective for support
const MAX_TOKENS = 500
const TEMPERATURE = 0.7

/**
 * System prompt for the support AI
 * Customized for MillionSystems - IT Services & Software Development Company
 */
const SUPPORT_SYSTEM_PROMPT = `You are a friendly and helpful AI support assistant for MillionSystems.

=== ABOUT MILLIONSYSTEMS ===
MillionSystems is a full-service IT company and software development agency. We turn ideas into successful digital products. From initial concept to deployment and beyond, we handle everything - design, development, SEO, and marketing to make your project successful.

=== OUR SERVICES ===
1. **Web Development** - Custom websites, web applications, e-commerce platforms
2. **Mobile App Development** - iOS and Android apps, cross-platform solutions
3. **UI/UX Design** - User interface design, user experience optimization, prototyping
4. **Backend Development** - APIs, databases, server infrastructure
5. **SEO & Digital Marketing** - Search engine optimization, content marketing, growth strategies
6. **Enterprise Solutions** - Custom software for businesses, integrations, automation
7. **Idea Refinement** - We help you refine and validate your idea before building

=== OUR TECHNOLOGY STACK ===
We work with multiple technologies and choose the best stack for each project:
- Frontend: React, Next.js, Vue.js, TypeScript
- Backend: Node.js, Python, PHP, Go
- Mobile: React Native, Flutter, Swift, Kotlin
- Databases: PostgreSQL, MongoDB, MySQL, Supabase
- Cloud: AWS, Google Cloud, Vercel, DigitalOcean

=== HOW WE WORK ===
1. **Free Consultation** - Book a free call to discuss your idea
2. **Idea Refinement** - We help shape and validate your concept
3. **Proposal & Quote** - Custom quote based on your project scope
4. **Design & Development** - We build your product with regular updates
5. **Testing & Launch** - Thorough testing before deployment
6. **SEO & Marketing** - Help your product reach the right audience
7. **Ongoing Support** - Continued maintenance and improvements

=== PRICING ===
- All projects are custom quoted based on scope and requirements
- We provide detailed proposals after understanding your needs
- Book a free consultation to get a quote for your project

=== TIMELINE ===
- Project timelines vary based on scope and complexity
- Simple websites: 2-4 weeks
- Web applications: 1-3 months
- Complex platforms: 3-6+ months
- We'll provide accurate estimates after consultation

=== WHY CHOOSE MILLIONSYSTEMS ===
- End-to-end service: From idea to success, we handle everything
- Quality focused: We prioritize quality over quantity
- Competitive pricing: Affordable rates without compromising quality
- Ongoing partnership: We're with you beyond launch

=== COMMON QUESTIONS ===
1. How do I start? - Book a free consultation call to discuss your idea
2. How much does a project cost? - Every project is custom quoted based on requirements
3. How long will my project take? - Timeline depends on scope, we'll estimate after consultation
4. What technologies do you use? - We choose the best tech stack for each project
5. Do you help with marketing? - Yes! We offer SEO and digital marketing services
6. Can you help refine my idea? - Absolutely! We help shape ideas into viable products

=== YOUR GUIDELINES ===
1. Be helpful, friendly, and professional
2. Answer questions using the information above
3. For project inquiries, encourage booking a free consultation
4. You CANNOT provide specific quotes - always recommend a consultation call
5. If someone has a project idea, show enthusiasm and suggest discussing it in a consultation
6. For technical questions beyond general info, suggest talking to our team
7. Keep responses concise but warm and welcoming
8. If you don't know something, offer to connect them with our team

Remember: You're helping potential clients learn about our services. Be welcoming and encourage them to book a free consultation!`

/**
 * Check if the user is requesting a human agent
 */
export function isAgentRequest(content: string): boolean {
  const normalizedContent = content.toLowerCase().trim()
  return AGENT_REQUEST_PHRASES.some((phrase) =>
    normalizedContent.includes(phrase)
  )
}

/**
 * Build message history for context (last N messages)
 */
function buildMessageHistory(
  messages: SupportMessage[],
  maxMessages: number = 10
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const recentMessages = messages.slice(-maxMessages)

  return recentMessages
    .filter((msg) => msg.content) // Skip image-only messages
    .map((msg) => ({
      role: (msg.sender_type === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.content!,
    }))
}

/**
 * Generate an AI response using xAI Grok
 */
export async function generateResponse(
  conversation: SupportConversation,
  messages: SupportMessage[],
  userMessage: string
): Promise<string> {
  const apiKey = process.env.XAI_API_KEY

  if (!apiKey) {
    console.warn('[SupportAIService] XAI_API_KEY not configured, using fallback response')
    return getFallbackResponse()
  }

  try {
    const messageHistory = buildMessageHistory(messages)

    const response = await fetch(`${XAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: SUPPORT_MODEL,
        messages: [
          { role: 'system', content: SUPPORT_SYSTEM_PROMPT },
          ...messageHistory,
          { role: 'user', content: userMessage },
        ],
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[SupportAIService] API error:', response.status, errorData)
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    return aiResponse.trim()
  } catch (error) {
    console.error('[SupportAIService] Error generating response:', error)
    return getFallbackResponse()
  }
}

/**
 * Fallback response when AI is unavailable
 */
function getFallbackResponse(): string {
  return "I'm having trouble processing your request right now. You can say 'talk to agent' to speak with our support team directly, or try again in a moment."
}

/**
 * Get welcome message for new conversations
 */
export function getWelcomeMessage(contactName: string): string {
  return `Hi ${contactName}! Welcome to MillionSystems. I'm your AI assistant.\n\nI can help you with:\n• Our services (web, mobile, design, SEO)\n• How we work & our process\n• Getting started with your project\n\nHave a project idea? I'd love to hear about it! Or say "talk to agent" to speak directly with our team.`
}

/**
 * Get handoff message when escalating to human agent
 */
export function getHandoffMessage(): string {
  return "I'm connecting you with our support team now. A team member will respond shortly. In the meantime, feel free to provide any additional details about your issue."
}

/**
 * Get status update message
 */
export function getStatusUpdateMessage(status: string, byUser: boolean = true): string {
  switch (status) {
    case 'resolved':
      return byUser
        ? 'You marked this ticket as resolved. Thank you for using our support! If you have any other questions, feel free to start a new conversation.'
        : 'This ticket has been marked as resolved by our support team. If you have any other questions, feel free to start a new conversation.'
    case 'closed':
      return byUser
        ? 'You closed this ticket. Thank you for contacting us! If you need help again, start a new conversation anytime.'
        : 'This ticket has been closed. Thank you for contacting us! If you need help again, start a new conversation anytime.'
    case 'open':
      return 'This ticket has been reopened. We\'re here to help!'
    case 'pending':
      return 'We\'re waiting for your response. Take your time!'
    default:
      return `Ticket status updated to: ${status}`
  }
}

/**
 * Export the service object
 */
export const SupportAIService = {
  isAgentRequest,
  generateResponse,
  getWelcomeMessage,
  getHandoffMessage,
  getStatusUpdateMessage,
}
