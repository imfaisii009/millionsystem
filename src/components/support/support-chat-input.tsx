'use client'

import { useState, useRef, type ChangeEvent, type KeyboardEvent } from 'react'
import { useSupportStore } from '@/stores/support-store'
import { Button } from '@/components/ui/button'
import { Send, ImagePlus, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SupportChatInput() {
  const { sendMessage, uploadImage, isSending, isUploading, currentConversation } = useSupportStore()
  const [input, setInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isDisabled = currentConversation?.status === 'closed' || currentConversation?.status === 'resolved'
  const isLoading = isSending || isUploading

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be less than 10MB')
      return
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setImageFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    const trimmedInput = input.trim()

    if (!trimmedInput && !imageFile) return
    if (isLoading || isDisabled) return

    let imageUrl: string | undefined

    // Upload image first if present
    if (imageFile) {
      imageUrl = (await uploadImage(imageFile)) || undefined
      if (!imageUrl && imageFile) {
        // Upload failed, don't send message
        return
      }
    }

    // Send message
    await sendMessage(trimmedInput || undefined, imageUrl)

    // Clear inputs
    setInput('')
    removeImage()

    // Focus textarea
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  if (isDisabled) {
    return (
      <div className="p-4 border-t bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          This conversation is {currentConversation?.status}. Start a new conversation for further assistance.
        </p>
      </div>
    )
  }

  return (
    <div className="p-3 border-t bg-background">
      {/* Image preview */}
      {previewUrl && (
        <div className="mb-2 relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-20 w-auto rounded-lg object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
            disabled={isLoading}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* Image upload button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex-shrink-0 h-10 w-10"
        >
          <ImagePlus className="w-5 h-5" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isLoading}
            rows={1}
            className={cn(
              'w-full resize-none rounded-2xl border bg-muted/50 px-4 py-2.5 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'min-h-[42px] max-h-[120px]'
            )}
          />
        </div>

        {/* Send button */}
        <Button
          type="button"
          size="icon"
          onClick={handleSubmit}
          disabled={isLoading || (!input.trim() && !imageFile)}
          className="flex-shrink-0 h-10 w-10 rounded-full"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Hint text */}
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
