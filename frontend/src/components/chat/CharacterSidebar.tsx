import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  ScrollShadow,
  Divider,
  Tooltip,
} from '@heroui/react'
import { PiPlus } from 'react-icons/pi'
import { characters } from '@/store/chatStore'

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
              <Button color='default' variant='flat' size='sm' isIconOnly>
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
            {characters.map((character) => (
              <Card
                key={character.id}
                isPressable
                className={`w-full transition-colors cursor-pointer ${
                  selectedCharacterId === character.id
                    ? 'bg-primary/10 border-primary/20'
                    : 'bg-transparent hover:bg-default-100'
                }`}
                shadow='none'
                onPress={() => { onCharacterSelect(character.id); }}
              >
                <CardBody className='p-3'>
                  <div className='flex items-start space-x-3'>
                    <div className='relative flex-shrink-0'>
                      <Avatar
                        size='sm'
                        src={character.avatar}
                        className='flex-shrink-0'
                      />
                      <div className='absolute -top-1 -right-1 text-lg'>
                        {character.emoji}
                      </div>
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
                        {character.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </ScrollShadow>
      </div>
    </>
  )
}
