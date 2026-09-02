// https://react-svgr.com/playground/
import * as React from 'react'
import Image from 'next/image'
const img = require('/public/wsgopher.png')

const NotionAvatar = ({ className }) => (
  <Image
    src={img}
    alt='Avatar'
    width={128}
    height={128}
    className={className}
  ></Image>
)

export default NotionAvatar
