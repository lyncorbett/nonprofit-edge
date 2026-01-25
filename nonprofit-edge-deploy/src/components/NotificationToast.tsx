import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, MessageCircle } from 'lucide-react';

interface ProfessorNotification {
  id: string;
  conversationId: string;
  title: string;
  preview: string;
}

interface NotificationToastProps {
  notification: ProfessorNotification | null;
  onView: (conversationId: string) => void;
  onDismiss: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notification, 
  onView, 
  onDismiss 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation
  };

  const handleView = () => {
    if (notification) {
      onView(notification.conversationId);
      handleDismiss();
    }
  };

  if (!notification) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: 'white',
        borderRadius: '14px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        maxWidth: '380px',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.3s ease',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '24px',
          height: '24px',
          border: 'none',
          background: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0
        }}
      >
        <X size={16} />
      </button>

      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: '#0D2C54',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0
      }}>
        🎓
      </div>

      <div style={{ flex: 1, paddingRight: '16px' }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#0D2C54',
          marginBottom: '4px'
        }}>
          The Professor responded
        </div>
        <p style={{
          fontSize: '13px',
          color: '#64748b',
          lineHeight: 1.4,
          marginBottom: '12px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          "{notification.preview}"
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleView}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              background: '#0097A9',
              color: 'white',
              border: 'none',
              fontFamily: 'inherit'
            }}
          >
            View Response
          </button>
          <button
            onClick={handleDismiss}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              background: 'white',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              fontFamily: 'inherit'
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook to manage professor notifications
export const useProfessorNotifications = () => {
  const [notification, setNotification] = useState<ProfessorNotification | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check for unread responses on mount
    checkUnread();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('professor-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'professor_conversations',
          filter: 'has_unread_response=eq.true'
        },
        (payload) => {
          const convo = payload.new as any;
          // Only show notification if user is not currently viewing this conversation
          const currentPath = window.location.pathname;
          const currentId = new URLSearchParams(window.location.search).get('id');
          
          if (currentPath !== '/ask-professor' || currentId !== convo.id) {
            setNotification({
              id: Date.now().toString(),
              conversationId: convo.id,
              title: convo.title || 'New response',
              preview: getLastAssistantMessage(convo.messages)
            });
          }
          checkUnread();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkUnread = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { count } = await supabase
        .from('professor_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('has_unread_response', true);
      
      setUnreadCount(count || 0);
    }
  };

  const getLastAssistantMessage = (messages: any[]) => {
    if (!messages || messages.length === 0) return 'New response available';
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    return lastAssistant?.content?.substring(0, 100) || 'New response available';
  };

  const handleView = (conversationId: string) => {
    window.location.href = `/ask-professor?id=${conversationId}`;
  };

  const handleDismiss = () => {
    setNotification(null);
  };

  return {
    notification,
    unreadCount,
    handleView,
    handleDismiss,
    NotificationComponent: () => (
      <NotificationToast
        notification={notification}
        onView={handleView}
        onDismiss={handleDismiss}
      />
    )
  };
};

export default NotificationToast;
