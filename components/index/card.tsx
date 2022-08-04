import { Card as FlowbiteCard } from 'flowbite-react'
import { IndexBlogs } from '../../libs/db/blogs'
import Link from 'next/link'

type CardProps = IndexBlogs[0]

const Card = ({ id, title, subTitle, creator }: CardProps) => {
  return (
    <FlowbiteCard>
      <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Link href={`/blogs/${id}`}>{title}</Link>
      </h5>
      <p className="mb-5 font-normal text-gray-700 dark:text-gray-400 leading-tight">
        {subTitle}
      </p>
      <Link href={`/creators/${creator.id}`}>
        <a className="mb-3 font-2xl font-normal text-blue-700 dark:text-gray-400 leading-tight">
          {creator.name}
        </a>
      </Link>
    </FlowbiteCard>
  )
}

export default Card
