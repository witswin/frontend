import Link from "next/link"

const Sidebar = () => {
  return (
    <aside className="w-72 p-3 border-r border-r-divider">
      <h3 className="mt-4">Tap UI</h3>

      <ul className="mt-4 space-y-2 text-sm list-disc list-inside">
        <li>
          <Link href="/tap-ui">Home</Link>
          <Link href="/tap-ui">Home</Link>
          <Link href="/tap-ui">Home</Link>
          <Link href="/tap-ui">Home</Link>
          <Link href="/tap-ui">Home</Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
