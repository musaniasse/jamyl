import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Boxes } from 'lucide-react';
interface SplashScreenProps {
  onFinish: () => void;
}
export function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{
          opacity: 0,
          scale: 0.85
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut'
        }}>
        
        <motion.div
          className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
          initial={{
            rotate: -8
          }}
          animate={{
            rotate: [-8, 8, 0]
          }}
          transition={{
            duration: 1.2,
            ease: 'easeInOut'
          }}>
          
          <Boxes className="h-12 w-12" strokeWidth={1.5} />
        </motion.div>

        <div className="text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight"
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.3,
              duration: 0.5
            }}>
            
            StockPro
          </motion.h1>
          <motion.p
            className="mt-2 text-muted-foreground"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.6,
              duration: 0.5
            }}>
            
            Gestion de stock pour votre boutique
          </motion.p>
        </div>

        <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{
              width: '0%'
            }}
            animate={{
              width: '100%'
            }}
            transition={{
              duration: 3,
              ease: 'linear'
            }} />
          
        </div>
      </motion.div>
    </div>);

}