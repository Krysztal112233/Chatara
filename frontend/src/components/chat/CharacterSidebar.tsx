import {
  Button,
  Card,
  CardBody,
  Input,
  ScrollShadow,
  Divider,
  Tooltip,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react'
import { PiPlus, PiFileText, PiSparkle } from 'react-icons/pi'
import { useNavigate } from '@tanstack/react-router'
import { useCharacters } from '@/lib/api/characters'

interface CharacterSidebarProps {
  isCollapsed: boolean
  selectedCharacterId: string | null
  onCharacterSelect: (characterId: string) => void
}

export function CharacterSidebar({
  isCollapsed,
  selectedCharacterId,
  onCharacterSelect,
}: CharacterSidebarProps) {
  const { characters, isLoading, error } = useCharacters()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const navigate = useNavigate()

  const handlePresetCharacters = () => {
    navigate({ to: '/discover' }).catch(console.error)
    onOpenChange()
  }

  return (
    <>
      {/* 侧边栏内容 - 折叠时隐藏 */}
      <div
        className={`flex flex-col h-full transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* 顶部logo和新建按钮 */}
        <div className='p-4 space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <h1 className='text-lg font-semibold text-foreground'>Chatara</h1>
            </div>
            <Tooltip content='新建角色' placement='bottom'>
              <Button color='default' variant='flat' size='sm' isIconOnly onPress={onOpen}>
                <PiPlus size={16} />
              </Button>
            </Tooltip>
          </div>

          <Input
            placeholder='搜索角色...'
            size='sm'
            variant='bordered'
            classNames={{
              base: 'w-full',
              mainWrapper: 'h-full',
              input: 'text-small',
              inputWrapper:
                'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            }}
          />
        </div>

        <Divider />

        {/* 角色列表 */}
        <ScrollShadow className='flex-1'>
          <div className='p-2 space-y-1'>
            {isLoading ? (
              <div className='flex justify-center p-4'>
                <Spinner size='sm' />
              </div>
            ) : error ? (
              <div className='text-center p-4 text-default-500 text-sm'>
                加载角色失败
              </div>
            ) : (
              characters.map((character) => (
              <Card
                key={character.id}
                isPressable
                className={`w-full transition-colors cursor-pointer ${
                  selectedCharacterId === character.id
                    ? 'bg-primary/10 border-primary/20'
                    : 'bg-transparent hover:bg-default-100'
                }`}
                shadow='none'
                onPress={() => {
                  onCharacterSelect(character.id)
                }}
              >
                <CardBody className='p-3'>
                  <div className='flex items-start space-x-3'>
                    <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center text-xl'>
                      {character.avatar || '🎭'}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <h3
                          className={`text-sm font-medium truncate ${
                            selectedCharacterId === character.id
                              ? 'text-primary'
                              : 'text-foreground'
                          }`}
                        >
                          {character.name}
                        </h3>
                      </div>
                      <p className='text-xs text-default-500 truncate mt-1 leading-relaxed'>
                        {character.description || ''}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )))}
          </div>
        </ScrollShadow>
      </div>

      {/* 新建角色模态框 */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='lg'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                创建新角色
              </ModalHeader>
              <ModalBody className='space-y-4'>
                <div className='grid gap-4'>
                  {/* 使用预设角色 */}
                  <Button
                    size='lg'
                    variant='flat'
                    className='h-auto p-6 justify-start'
                    startContent={<PiSparkle size={24} />}
                    onPress={handlePresetCharacters}
                  >
                    <div className='text-left'>
                      <div className='font-medium'>使用预设角色</div>
                      <div className='text-sm text-default-500 mt-1'>
                        从精心设计的角色库中选择，包括历史人物、文学角色等
                      </div>
                    </div>
                  </Button>

                  {/* 上传文档生成角色 */}
                  <Button
                    size='lg'
                    variant='flat'
                    className='h-auto p-6 justify-start'
                    startContent={<PiFileText size={24} />}
                    isDisabled
                  >
                    <div className='text-left'>
                      <div className='font-medium'>上传文档生成角色</div>
                      <div className='text-sm text-default-500 mt-1'>
                        上传 PDF、TXT 等文档，AI 智能分析生成专属角色
                      </div>
                      <div className='text-xs text-default-400 mt-1'>
                        功能开发中，敬请期待
                      </div>
                    </div>
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  取消
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
