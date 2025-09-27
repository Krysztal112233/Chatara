import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Button, Card, CardBody, Chip, Divider } from '@heroui/react'
import {
  PiChatCircle,
  PiMicrophone,
  PiBrain,
  PiUsers,
  PiGlobe,
  PiSparkle,
  PiArrowRight,
  PiCompass,
} from 'react-icons/pi'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-content1 to-content2'>
      {/* Hero Section */}
      <div className='container mx-auto px-6 py-16'>
        <div className='text-center space-y-8'>
          <div className='space-y-4'>
            <Chip
              color='primary'
              variant='flat'
              size='lg'
              startContent={<PiSparkle className='text-lg' />}
            >
              对话，重新定义
            </Chip>
            <h1 className='text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent'>
              Chatara
            </h1>
            <p className='text-xl md:text-2xl text-default-600 max-w-3xl mx-auto'>
              与苏格拉底探讨哲学，与哈利波特分享冒险。
              <br />
              前所未有的对话体验，现在开始。
            </p>
          </div>

          <div className='flex gap-4 justify-center flex-wrap'>
            <Button
              as={Link}
              to='/chat'
              color='primary'
              size='lg'
              endContent={<PiArrowRight />}
              className='font-semibold'
            >
              开始体验
            </Button>
            <Button
              as={Link}
              to='/discover'
              variant='bordered'
              size='lg'
              startContent={<PiCompass />}
              className='font-semibold'
            >
              探索角色
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className='mt-24 space-y-12'>
          <div className='text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
              简单。深度。难忘。
            </h2>
            <p className='text-lg text-default-600'>
              每一次对话，都是一次心灵的相遇
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            <Card className='p-6'>
              <CardBody className='text-center space-y-4'>
                <div className='w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto'>
                  <PiChatCircle className='text-3xl text-orange-600 dark:text-orange-400' />
                </div>
                <h3 className='text-xl font-semibold'>深度对话</h3>
                <p className='text-default-600'>
                  每个角色都有灵魂。每句话都有温度。
                  与伟大的心灵对话，从未如此真实。
                </p>
              </CardBody>
            </Card>

            <Card className='p-6'>
              <CardBody className='text-center space-y-4'>
                <div className='w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto'>
                  <PiMicrophone className='text-3xl text-cyan-600 dark:text-cyan-400' />
                </div>
                <h3 className='text-xl font-semibold'>自然语音</h3>
                <p className='text-default-600'>
                  声音，是心灵的桥梁。 一句话开启对话，一个声音触动内心。
                </p>
              </CardBody>
            </Card>

            <Card className='p-6'>
              <CardBody className='text-center space-y-4'>
                <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto'>
                  <PiBrain className='text-3xl text-purple-600 dark:text-purple-400' />
                </div>
                <h3 className='text-xl font-semibold'>无限可能</h3>
                <p className='text-default-600'>
                  学习、陪伴、创作。 每一种需要，都有回应。
                </p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Target Users Section */}
        <div className='mt-24 space-y-12'>
          <div className='text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
              为每个人而生
            </h2>
            <p className='text-lg text-default-600'>
              学者与梦想家，都能在这里找到共鸣
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            <Card className='p-8'>
              <CardBody className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <PiUsers className='text-2xl text-emerald-600 dark:text-emerald-400' />
                  <h3 className='text-xl font-semibold'>学习者</h3>
                </div>
                <p className='text-default-600'>
                  与莎士比亚谈文学，与爱因斯坦聊科学。 知识从未如此生动。
                </p>
                <div className='flex flex-wrap gap-2'>
                  <Chip size='sm' variant='flat'>
                    历史学习
                  </Chip>
                  <Chip size='sm' variant='flat'>
                    学术讨论
                  </Chip>
                  <Chip size='sm' variant='flat'>
                    知识问答
                  </Chip>
                </div>
              </CardBody>
            </Card>

            <Card className='p-8'>
              <CardBody className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <PiGlobe className='text-2xl text-rose-600 dark:text-rose-400' />
                  <h3 className='text-xl font-semibold'>探索者</h3>
                </div>
                <p className='text-default-600'>
                  和哈利波特一起冒险，与夏洛克一起推理。 想象的边界，由你定义。
                </p>
                <div className='flex flex-wrap gap-2'>
                  <Chip size='sm' variant='flat'>
                    角色扮演
                  </Chip>
                  <Chip size='sm' variant='flat'>
                    情感陪伴
                  </Chip>
                  <Chip size='sm' variant='flat'>
                    创意互动
                  </Chip>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <Divider className='my-16' />

        {/* Call to Action */}
        <div className='text-center space-y-6'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
            就在此刻
          </h2>
          <p className='text-lg text-default-600 max-w-2xl mx-auto'>
            开始一场改变一切的对话
          </p>
          <div className='flex gap-4 justify-center'>
            <Button
              as={Link}
              to='/chat'
              color='primary'
              size='lg'
              endContent={<PiArrowRight />}
              className='font-semibold px-8'
            >
              开始对话
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className='mt-24 py-8 border-t border-divider'>
          <div className='text-center text-sm text-default-500'>
            © {new Date().getFullYear()} Chatara. Licensed under Apache 2.0.
            Made with ❤️ by Krysztal Huang & ShellWen Chen.
          </div>
        </footer>
      </div>
    </div>
  )
}
