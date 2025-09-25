import { createFileRoute } from '@tanstack/react-router'
import { Head } from '@unhead/react'

export const Route = createFileRoute('/discover')({
  component: Discover,
})

function Discover() {
  return (
    <>
      <Head>
        <title>角色发现</title>
      </Head>
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-default-600">角色发现</h1>
          <p className="text-default-500 mt-2">探索更多经典角色，开启奇妙对话之旅</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
            <div className="p-4 border border-divider rounded-lg hover:bg-content2 cursor-pointer transition-colors">
              <div className="text-2xl mb-2">🧙‍♂️</div>
              <div className="text-sm font-medium">哈利波特</div>
            </div>
            <div className="p-4 border border-divider rounded-lg hover:bg-content2 cursor-pointer transition-colors">
              <div className="text-2xl mb-2">🏛️</div>
              <div className="text-sm font-medium">苏格拉底</div>
            </div>
            <div className="p-4 border border-divider rounded-lg hover:bg-content2 cursor-pointer transition-colors">
              <div className="text-2xl mb-2">🧬</div>
              <div className="text-sm font-medium">爱因斯坦</div>
            </div>
            <div className="p-4 border border-divider rounded-lg hover:bg-content2 cursor-pointer transition-colors">
              <div className="text-2xl mb-2">🎭</div>
              <div className="text-sm font-medium">莎士比亚</div>
            </div>
            <div className="p-4 border border-divider rounded-lg hover:bg-content2 cursor-pointer transition-colors">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm font-medium">福尔摩斯</div>
            </div>
            <div className="p-4 border border-divider rounded-lg hover:bg-content2 cursor-pointer transition-colors">
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-sm font-medium">达芬奇</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}