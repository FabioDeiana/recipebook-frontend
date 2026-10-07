import { useEffect, useRef, useState } from 'react'

// Fades its content in the first time it scrolls into view
function Reveal({ as: Tag = 'div', className = '', children, ...props }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal${visible ? ' is-visible' : ''} ${className}`} {...props}>
      {children}
    </Tag>
  )
}

export default Reveal
