import { type ColumnDef } from '@tanstack/vue-table'
import { type AccountListItem } from '@/request/api/task'
import Medal1Image from '@/assets/images/quest/medal-1.png'
import Medal2Image from '@/assets/images/quest/medal-2.png'
import Medal3Image from '@/assets/images/quest/medal-3.png'
import ThumbImage from '@/assets/images/quest/thumb.png'

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
      return (
        <p class='text-center'>{rank}</p>
      )
    }
  }, {
    accessorKey: 'medal',
    header: () => '',
    cell: ({ row }) => {
      const rank = row.getValue<string>('rank')
      let image = ThumbImage
      if (rank === '1') {
        image = Medal1Image
      } else if (rank === '2') {
        image = Medal2Image
      } else if (rank === '3') {
        image = Medal3Image
      }
      return (
        <img class='block w-[36px] max-w-max' src={image} />
      )
    },
    size: 80
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
