'use client'

import { useSupportStore } from '@/stores/support-store'
import { getStatusInfo, getModeInfo } from '@/types/support'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  X,
  ChevronLeft,
  MoreVertical,
  CheckCircle,
  XCircle,
  Bot,
  HeadphonesIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SupportChatHeaderProps {
  onBack?: () => void
  showBackButton?: boolean
}

export function SupportChatHeader({ onBack, showBackButton }: SupportChatHeaderProps) {
  const {
    closeWidget,
    currentConversation,
    updateStatus,
    setCurrentConversation,
  } = useSupportStore()

  const handleBack = () => {
    setCurrentConversation(null)
    onBack?.()
  }

  const handleResolve = () => {
    updateStatus('resolved')
  }

  const handleClose = () => {
    updateStatus('closed')
  }

  const handleReopen = () => {
    updateStatus('open')
  }

  const statusInfo = currentConversation
    ? getStatusInfo(currentConversation.status)
    : null

  const modeInfo = currentConversation
    ? getModeInfo(currentConversation.mode)
    : null

  const isClosedOrResolved =
    currentConversation?.status === 'closed' ||
    currentConversation?.status === 'resolved'

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
      {/* Left side */}
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        <div className="flex flex-col">
          <h3 className="font-semibold text-sm">
            {currentConversation ? 'Support Chat' : 'Help & Support'}
          </h3>

          {currentConversation && (
            <div className="flex items-center gap-2 mt-0.5">
              {/* Mode indicator */}
              <div className={cn('flex items-center gap-1 text-xs', modeInfo?.color)}>
                {currentConversation.mode === 'ai_bot' ? (
                  <Bot className="w-3 h-3" />
                ) : (
                  <HeadphonesIcon className="w-3 h-3" />
                )}
                <span>{modeInfo?.label}</span>
              </div>

              <span className="text-muted-foreground">•</span>

              {/* Status badge */}
              <span
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  statusInfo?.bgColor,
                  statusInfo?.color
                )}
              >
                {statusInfo?.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {currentConversation && !isClosedOrResolved && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleResolve}>
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Mark as Resolved
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleClose}>
                <XCircle className="w-4 h-4 mr-2 text-gray-500" />
                Close Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {currentConversation && isClosedOrResolved && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReopen}
            className="h-7 text-xs"
          >
            Reopen
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={closeWidget}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
