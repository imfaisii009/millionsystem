'use client'

import { useSupportStore } from '@/stores/support-store'
import { SupportChatContainer } from './support-chat-container'
import { Button } from '@/components/ui/button'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'

export function SupportWidget() {
  const { isOpen, openWidget, closeWidget, unreadCount } = useSupportStore()

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed z-50',
              // Mobile: full screen with padding
              'bottom-0 right-0 left-0 top-0',
              'sm:bottom-24 sm:right-6 sm:left-auto sm:top-auto',
              // Desktop: fixed size
              'sm:w-[400px] sm:h-[600px] sm:max-h-[calc(100vh-120px)]',
              // Styling
              'bg-background sm:rounded-2xl sm:shadow-2xl',
              'border sm:border-border',
              'overflow-hidden'
            )}
          >
            <SupportChatContainer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={isOpen ? closeWidget : openWidget}
          size="lg"
          className={cn(
            'h-14 w-14 rounded-full shadow-lg',
            'hover:scale-105 transition-transform',
            isOpen && 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageCircle className="w-6 h-6" />
              {/* Unread badge */}
              {unreadCount > 0 && (
                <span
                  className={cn(
                    'absolute -top-1 -right-1',
                    'min-w-[20px] h-5 px-1.5',
                    'bg-destructive text-destructive-foreground',
                    'text-xs font-bold rounded-full',
                    'flex items-center justify-center'
                  )}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </>
          )}
        </Button>
      </div>
    </>
  )
}
