import { createFileRoute } from '@tanstack/react-router'
import { Head } from '@unhead/react'
import { Spinner } from '@heroui/react'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <>
      <Head>
        <title>登录中</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-background via-content1 to-content2">
        <div className="flex flex-col items-center justify-center h-screen text-center space-y-8 p-6">
          <div className="space-y-6">
            <Spinner 
              size="lg" 
              color="primary" 
              className="w-12 h-12"
            />
            
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground">
                正在为你准备
              </h1>
              <p className="text-lg text-default-600 max-w-md">
                马上就好，请稍等片刻
              </p>
            </div>
          </div>
          
          <div className="text-center text-sm text-default-500 max-w-xs">
            登录中，可能需要几秒钟时间
          </div>
        </div>
      </div>
    </>
  )
}