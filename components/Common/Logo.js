// https://react-svgr.com/playground/
import * as React from 'react'
import Image from 'next/image'

const Logo = (props) => (
  <Image
    src='/favicon.png'
    alt='Logo'
    width={20}
    height={20}
  />
)

export default Logo
