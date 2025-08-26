
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OrderNotificationProps {
  pendingCount: number;
  onViewOrders: () => void;
}

export default function OrderNotification({ pendingCount, onViewOrders }: OrderNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [lastCount, setLastCount] = useState(0);

  useEffect(() => {
    if (pendingCount > lastCount && pendingCount > 0) {
      setShowNotification(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    setLastCount(pendingCount);
  }, [pendingCount, lastCount]);

  if (!showNotification || pendingCount === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
      <Card className="bg-red-50 border-red-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Bell className="w-6 h-6 text-red-600 animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">
                New Order Alert!
              </h4>
              <p className="text-sm text-red-700">
                {pendingCount} order{pendingCount > 1 ? 's' : ''} waiting for confirmation
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => {
                  onViewOrders();
                  setShowNotification(false);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                View Orders
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNotification(false)}
                className="border-red-200"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
