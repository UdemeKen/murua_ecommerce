import SidebarWrapper from 'apps/seller-ui/src/shared/components/sidebar'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-full bg-black min-h-screen'>
        {/* Sidebar */}
        <aside className='w-[280px] min-w-[250px] max-w-[300px] border-r border-r-slate-800 text-white p-4'>
            <div className=''>
                <SidebarWrapper />
            </div>
        </aside>

        {/* Main Content Area */}
        <main className='flex-1'>
          <div className='overflow-auto'>
            { children }
          </div>
        </main>
    </div>
  )
}
