import Link from "next/link"

const Sidebar = () => {
  return (
    <aside className="w-60 p-3">
      <h3 className="mt-4">Tap UI</h3>

      <ul className="mt-4 space-y-2 text-sm list-disc list-inside pl-4">
        <li>
          <Link href="/tap-ui">Home</Link>
        </li>
        <li>
          <Link href="/tap-ui">Installation</Link>
        </li>
        <li>
          <Link href="/tap-ui/components">Components</Link>
        </li>

        <li>
          <Link href="/tap-ui">API</Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
