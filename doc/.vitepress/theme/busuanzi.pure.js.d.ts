declare module 'busuanzi.pure.js/index.js' {
  interface Busuanzi {
    fetch: () => void
  }
  const busuanzi: Busuanzi
  export default busuanzi
}
