"use client"

import { Button } from "@/components/ui/button"
import { memo } from "react"

const filters = ["все", "активные", "выполнено"] as const
type FilterType = typeof filters[number]

const Filter = ({setFilter}: {setFilter: (type: FilterType) => void}) => {
    return (
    <div className="flex gap-2 my-4">
    {filters.map((type) => (
      <Button key={type} onClick={() => setFilter(type)}>
        {type}
      </Button>
    ))}
  </div>
  )
}
export default memo(Filter)