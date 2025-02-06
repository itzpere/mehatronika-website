import { memo, useMemo } from 'react'

const Footer = memo(() => {
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <footer className="mt-auto w-full bg-white" style={{ contain: 'content' }}>
      <div className="container mx-auto p-4">
        <hr className="my-6 border-gray-200 sm:mx-auto" />
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          style={{ transform: 'translateZ(0)' }}
        >
          <span className="px-auto mx-auto text-center text-sm text-gray-500 sm:mx-0 sm:px-0 ">
            © {currentYear} Mehatronika™. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
