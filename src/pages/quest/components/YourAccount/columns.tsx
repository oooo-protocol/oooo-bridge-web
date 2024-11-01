import { type PointLog } from '@/request/api/task'
import { type ColumnDef } from '@tanstack/vue-table'
import dayjs from 'dayjs'

export const columns: Array<ColumnDef<PointLog, any>> = [
  {
    accessorKey: 'createTime',
    header: () => {
      return <div class='text-left'>TIME</div>
    },
    cell: ({ row }) => {
      const createTime = row.getValue<string>('createTime')
      const format = dayjs(createTime).format('MM-DD HH:mm:ss')
      return <div class='text-left'>{ format }</div>
    },
    size: 160
  }, {
    accessorKey: 'type',
    header: () => 'TYPE',
    size: 300
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
    size: 80
  }
]
