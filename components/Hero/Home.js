import BLOG from '@/blog.config'
import Link from 'next/link'
import Avatar from './NotionAvatar.js'
import Social from '../Common/Social.js'
import { lang } from '@/lib/lang'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  MailIcon,
  RssIcon,
  ClipboardCheckIcon
} from '@heroicons/react/outline'
import NotionRenderer from '@/components/Post/NotionRenderer'

const Hero = ({ blockMap }) => {
  const [showCopied, setShowCopied] = useState(false)
  const { locale } = useRouter()
  const t = lang[locale]
  const isShowContactButton = BLOG.showContactButton
  const isShowRssButton = BLOG.showRssButton

  const clickCopy = async () => {
    setShowCopied(true)
    navigator.clipboard.writeText(BLOG.link + '/feed')
    setTimeout(() => {
      setShowCopied(false)
    }, 1000)
  }

  return (
    <div className='flex flex-col-reverse gap-10 py-10 md:flex-row md:items-center md:justify-between md:gap-12 md:py-20'>
      <div className='flex flex-col items-start text-left md:w-3/5'>
        <NotionRenderer
          className='md:ml-0'
          blockMap={blockMap}
          frontMatter={{}}
          subPageTitle={null}
        />

        <div className='mt-6'>
          <Social />
        </div>

        <p className='mt-8 max-w-md text-lg font-light leading-relaxed text-gray-500 dark:text-gray-400'>
          {t.HERO.HOME.HERO_SUBTEXT}
        </p>

        <div className='mt-8 flex flex-wrap items-center gap-3'>
          {isShowContactButton && (
            <Link passHref href='/contact' scroll={false}>
              <button className='inline-flex items-center gap-2 rounded-full bg-accent-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-400'>
                <MailIcon className='h-4 w-4' />
                {t.HERO.HOME.CONTACT_BUTTON}
              </button>
            </Link>
          )}

          {isShowRssButton && (
            showCopied ? (
              <button
                disabled
                className='inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-5 py-2.5 text-sm font-medium text-accent-700 dark:border-accent-800 dark:bg-accent-900/30 dark:text-accent-300'
              >
                <ClipboardCheckIcon className='h-4 w-4' />
                {t.HERO.RSS_BUTTON_COPIED}
              </button>
            ) : (
              <button
                onClick={() => clickCopy()}
                className='inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-accent-400 hover:text-accent-600 dark:border-gray-600 dark:text-gray-200 dark:hover:border-accent-500 dark:hover:text-accent-400'
              >
                <RssIcon className='h-4 w-4' />
                {t.HERO.HOME.RSS_BUTTON}
              </button>
            )
          )}
        </div>
      </div>

      <div className='flex-shrink-0'>
        <Avatar className='h-24 w-24 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 md:h-32 md:w-32' />
      </div>
    </div>
  )
}

export default Hero
