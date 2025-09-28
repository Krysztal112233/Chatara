import type { HistoryIndex } from '../api/histories'

export function groupCharacterSessions(characterSessions: HistoryIndex[]) {
  return characterSessions.reduce((groups: Array<{ title: string, items: HistoryIndex[] }>, session) => {
    const date = new Date(session.updated_at)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    let groupTitle: string
    if (date >= today) {
      groupTitle = '今天'
    } else if (date >= yesterday) {
      groupTitle = '昨天'
    } else if (date >= weekAgo) {
      groupTitle = '本周'
    } else {
      groupTitle = '更早'
    }

    const existingGroup = groups.find(g => g.title === groupTitle)
    if (existingGroup) {
      existingGroup.items.push(session)
    } else {
      groups.push({ title: groupTitle, items: [session] })
    }

    return groups
  }, [])
}