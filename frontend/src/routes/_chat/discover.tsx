import { createFileRoute } from '@tanstack/react-router'
import { Head } from '@unhead/react'

export const Route = createFileRoute('/_chat/discover')({
  component: Discover,
})

function Discover() {
  return (
    <>
      <Head>
        <title>发现</title>
      </Head>
      <div className="h-full overflow-y-auto pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          {/* 标题部分 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-default-600 mb-3">角色发现</h1>
            <p className="text-default-500 text-base md:text-lg">探索更多经典角色，开启奇妙对话之旅</p>
          </div>
          
          {/* 角色网格 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto">
            <div className="aspect-square p-4 md:p-6 border border-divider rounded-xl hover:bg-content2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-3xl md:text-4xl mb-2 text-center">🧙‍♂️</div>
              <div className="text-sm md:text-base font-medium text-center">哈利波特</div>
            </div>
            <div className="aspect-square p-4 md:p-6 border border-divider rounded-xl hover:bg-content2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-3xl md:text-4xl mb-2 text-center">🏛️</div>
              <div className="text-sm md:text-base font-medium text-center">苏格拉底</div>
            </div>
            <div className="aspect-square p-4 md:p-6 border border-divider rounded-xl hover:bg-content2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-3xl md:text-4xl mb-2 text-center">🧬</div>
              <div className="text-sm md:text-base font-medium text-center">爱因斯坦</div>
            </div>
            <div className="aspect-square p-4 md:p-6 border border-divider rounded-xl hover:bg-content2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-3xl md:text-4xl mb-2 text-center">🎭</div>
              <div className="text-sm md:text-base font-medium text-center">莎士比亚</div>
            </div>
            <div className="aspect-square p-4 md:p-6 border border-divider rounded-xl hover:bg-content2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-3xl md:text-4xl mb-2 text-center">🔍</div>
              <div className="text-sm md:text-base font-medium text-center">福尔摩斯</div>
            </div>
            <div className="aspect-square p-4 md:p-6 border border-divider rounded-xl hover:bg-content2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-3xl md:text-4xl mb-2 text-center">🎨</div>
              <div className="text-sm md:text-base font-medium text-center">达芬奇</div>
            </div>
          </div>
          
          {/* 添加更多角色提示 */}
          <div className="text-center mt-12 space-y-2">
            <p className="text-default-400 text-sm">更多角色正在路上...</p>
            <p className="text-default-400 text-sm">未来将支持上传文档智能生成专属角色</p>
            <p className="text-default-400 text-sm">让每个故事都拥有独特的灵魂</p>
          </div>
        </div>
      </div>
    </>
  )
}