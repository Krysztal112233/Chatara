import { createFileRoute } from '@tanstack/react-router'
import { Head } from '@unhead/react'

export const Route = createFileRoute('/discover')({
  component: Discover,
})

function Discover() {
  return (
    <>
      <Head>
        <title>发现</title>
      </Head>
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-default-600">发现页面</h1>
          <p className="text-default-500 mt-2">内容待开发</p>
        </div>
      </div>
    </>
  )
}