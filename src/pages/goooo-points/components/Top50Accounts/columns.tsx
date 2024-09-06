import { type ColumnDef } from '@tanstack/vue-table'
import { type AccountListItem } from '@/request/api/task'
import Icon from 'oooo-components/ui/Icon.vue'

export interface List {
  rank: number
  address: string
  points: number
}

export const columns: Array<ColumnDef<AccountListItem>> = [
  {
    accessorKey: 'rank',
    header: 'RANK',
    size: 40,
    cell: ({ row }) => {
      const rank = row.getValue<string>('rank')
      let text: VNode | string = rank
      if (rank === '1') {
        text = <Icon class='inline text-[24px]' name='no-1' />
      } else if (rank === '2') {
        text = <Icon class='inline text-[24px]' name='no-2' />
      } else if (rank === '3') {
        text = <Icon class='inline text-[24px]' name='no-3' />
      }
      return <div class='text-center'>{ text }</div>
    }
  }, {
    accessorKey: 'walletAddress',
    header: () => 'ADDRESS',
    size: 300,
    cell: ({ row }) => {
      const address = row.getValue<string>('walletAddress')
      return <div>{ address }</div>
    }
  }, {
    accessorKey: 'divider',
    header: () => '',
    cell: () => {
      return <div class='flex items-center'>
        <p class='w-full border-b border-dashed border-[#787878]' />
      </div>
    }
  }, {
    accessorKey: 'point',
    header: () => 'POINTS',
    size: 120
  }
]
