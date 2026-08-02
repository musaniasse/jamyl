import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'destructive',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onCancel}
        >
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={
                      variant === 'destructive'
                        ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive'
                        : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'
                    }
                  >
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="pt-2">{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    {cancelLabel}
                  </Button>
                  <Button
                    type="button"
                    variant={variant === 'destructive' ? 'destructive' : 'default'}
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}