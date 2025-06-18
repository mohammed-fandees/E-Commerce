export default function Container({ children }) {
  return (
    <div className='container mx-auto px-4 max-w-[1280px]'>
      {children}
    </div>
  )
}