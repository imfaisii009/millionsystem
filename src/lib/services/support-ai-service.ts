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
 * Customize this with your product/service information
 */
const SUPPORT_SYSTEM_PROMPT = `You are a friendly and helpful AI support assistant for our platform.

=== ABOUT OUR PLATFORM ===
We are a modern SaaS platform that helps businesses grow through referral marketing and affiliate programs.

=== KEY FEATURES ===
- Referral link tracking and management
- Commission tracking and payouts
- Real-time analytics dashboard
- Integration with popular payment providers
- Multi-project support

=== PRICING ===
- Free tier: Basic features, up to 100 referrals/month
- Pro tier: $29/month - Unlimited referrals, advanced analytics
- Enterprise: Custom pricing - White-label, dedicated support

=== COMMON QUESTIONS ===
1. How do I create a referral link? - Go to Dashboard > Referral Links > Create New
2. When do I get paid? - Commissions are paid monthly, 30 days after the referred user pays
3. What payment methods do you support? - PayPal, Stripe, Bank Transfer
4. How do I track my earnings? - Check the Analytics section in your dashboard

=== YOUR GUIDELINES ===
1. Be helpful, friendly, and concise
2. Answer questions using the information above
3. You can ONLY provide information - you CANNOT perform actions like creating links or processing payments
4. For complex issues or account-specific questions, suggest the user say "talk to agent" to speak with human support
5. NEVER make up information about user accounts or specific data
6. If you don't know something, be honest and offer to connect them with human support
7. Keep responses under 3-4 sentences when possible

Remember: You're the first line of support. Be helpful but know your limits!`

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
  return `Hi ${contactName}! I'm your AI support assistant. How can I help you today?\n\nYou can ask me questions about our platform, features, or pricing. If you need to speak with a human agent, just say "talk to agent" at any time.`
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
