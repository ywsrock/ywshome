export default function filterPublishedPosts({
  posts,
  onlyNewsletter,
  onlyPost,
  onlyHidden,
  onlyPage
}) {
  const showContents = []

  onlyNewsletter && showContents.push('Newsletter')
  onlyPost && showContents.push('Post')
  onlyHidden && showContents.push('Hidden')
  onlyPage && showContents.push('Page')
  if (!posts || !posts.length) return []

  //　cached the new Date()
  //　eliminates the need to call new Date() within the loop on each iteration.
  const currentDate = new Date();

  return posts.filter((post) => {
    const { type, status, date, title, slug } = post
    return (
      showContents.includes(type?.[0]) &&
      title &&
      slug &&
      status?.[0] === 'Published' &&
      date <= currentDate
    )
  })

  // return posts
  //   .filter((post) =>
  //     onlyNewsletter
  //       ? post?.type?.[0] === 'Newsletter'
  //       : post
  //   )
  //   .filter((post) =>
  //     onlyPost
  //       ? post?.type?.[0] === 'Post'
  //       : post
  //   ).filter((post) =>
  //     onlyPage
  //       ? post?.type?.[0] === 'Page'
  //       : post
  //   ).filter((post) =>
  //     onlyHidden
  //       ? post?.type?.[0] === 'Hidden'
  //       : post?.type?.[0] !== 'Hidden'
  //   )
  //   .filter((post) => {
  //     return (
  //       post.title &&
  //       post.slug &&
  //       post?.status?.[0] === 'Published' &&
  //       post.date <= new Date()
  //     )
  //   })
}
