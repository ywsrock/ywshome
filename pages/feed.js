import { getAllPosts } from '@/lib/notion'
import { generateRss } from '@/lib/rss'
// import { generateRss } from '@/lib/rssContent'
export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  // const posts = await getAllPosts({ onlyNewsletter: false })
  const posts = await getAllPosts({ onlyPost: true, onlyHidden: true, onlyPage: true, onlyNewsletter: false })
  const latestPosts = posts.slice(0, 10)
  const xmlFeed = await generateRss(latestPosts)
  res.write(xmlFeed)
  res.end()
  return {
    props: {}
  }
}
const feed = () => null
export default feed
