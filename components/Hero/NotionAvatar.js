// https://react-svgr.com/playground/
import * as React from 'react'
import Image from 'next/image'
const img = require('/public/mw.svg')

const NotionAvatar = (props) => (
  <Image
    src={img}
    alt='Avatar'
  ></Image>
)

export default NotionAvatar
