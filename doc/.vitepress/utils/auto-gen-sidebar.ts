import path from 'node:path'
import fs from 'node:fs'

/**
 * VitePress 侧边栏自动生成工具
 * 根据文档目录结构自动生成侧边栏配置，支持从 Markdown 文件的一级标题提取侧边栏文本
 */

/**
 * 文档根目录路径，相对于当前脚本位置向上回溯两级（.vitepress/utils -> doc）
 * 在 TypeScript ESM 模块中使用 import.meta.url 替代 __dirname
 * 使用 fileURLToPath 正确处理 Windows 路径
 */
const __filename = new URL(import.meta.url).pathname
const __dirname = path.dirname(__filename).replace(/^\/([A-Za-z]:)/, '$1')
const DIR_PATH = path.resolve(__dirname, '../../')

/**
 * 黑名单列表，过滤不需要生成侧边栏的文件和文件夹
 * - index.md: 首页文件，不需要在侧边栏显示
 * - .vitepress: VitePress 配置目录
 * - node_modules: 依赖目录
 * - .idea: IDE 配置目录
 * - assets: 静态资源目录
 * - public: 静态资源公共目录
 */
const WHITE_LIST: string[] = ['index.md', '.vitepress', 'node_modules', '.idea', 'assets', 'public']

/**
 * 判断给定路径是否为目录
 * @param {string} targetPath - 要判断的路径
 * @returns {boolean} 是否为目录
 */
const isDirectory = (targetPath: string): boolean => fs.lstatSync(targetPath).isDirectory()

/**
 * 计算两个数组的差集（arr1 中不在 arr2 中的元素）
 * @param {string[]} arr1 - 源数组
 * @param {string[]} arr2 - 排除数组
 * @returns {string[]} 差集结果
 */
const intersections = (arr1: string[], arr2: string[]): string[] =>
    Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))))

/**
 * 从 Markdown 文件中提取一级标题作为侧边栏文本
 * @param {string} filePath - Markdown 文件的完整路径
 * @returns {string} 一级标题文本，如果未找到则返回文件名（不含 .md 后缀）
 */
const extractTitle = (filePath: string): string => {
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^#\s+(.+)/m)
    if (match) {
        return match[1].trim()
    }
    return path.basename(filePath, '.md')
}

/**
 * 提取文件名/目录名开头的数字序号前缀（如 "1."、"2."）
 * @param {string} name - 文件或目录名
 * @returns {string} 数字前缀，如 "1."；如果没有则返回空字符串
 */
const getNumericPrefix = (name: string): string => {
    const match = name.match(/^(\d+\.)/)
    return match ? match[1] : ''
}

/**
 * 提取文件名/目录名开头的数字序号（如 "1"、"12"），用于排序
 * @param {string} name - 文件或目录名
 * @returns {number} 数字序号，如果没有则返回 Infinity（排到最后）
 */
const getSortNumber = (name: string): number => {
    const match = name.match(/^(\d+)/)
    return match ? parseInt(match[1], 10) : Infinity
}

/**
 * 按数字序号排序的比较函数
 * @param {string} a - 第一个文件名/目录名
 * @param {string} b - 第二个文件名/目录名
 * @returns {number} 排序结果
 */
const sortByNumber = (a: string, b: string): number => {
    const numA = getSortNumber(a)
    const numB = getSortNumber(b)
    if (numA !== numB) {
        return numA - numB
    }
    return a.localeCompare(b, 'zh-CN')
}

/**
 * 侧边栏配置项接口
 */
interface SidebarItem {
    text: string
    link?: string
    items?: SidebarItem[]
    collapsible?: boolean
    collapsed?: boolean
}

/**
 * 侧边栏配置选项接口
 */
interface SidebarOptions {
    collapsible?: boolean
    collapsed?: boolean
    whiteList?: string[]
}

/**
 * 递归遍历目录，生成侧边栏配置项数组
 * @param {string[]} params - 当前目录下的文件/文件夹列表
 * @param {string} currentDir - 当前目录的完整路径
 * @param {string} pathname - 当前目录的相对路径（用于生成链接）
 * @param {Object} options - 配置选项
 * @param {string[]} options.whiteList - 黑名单列表，用于过滤不需要的文件/目录
 * @param {boolean} options.collapsible - 目录是否可折叠
 * @param {boolean} options.collapsed - 默认是否折叠
 * @returns {Array} 侧边栏配置项数组
 */
function getList(params: string[], currentDir: string, pathname: string, options: Required<SidebarOptions>): SidebarItem[] {
    const res: SidebarItem[] = []
    const { whiteList, collapsible, collapsed } = options

    // 分离目录和文件，目录在前，文件在后
    const dirs: string[] = []
    const files: string[] = []

    for (let file in params) {
        const fullPath = path.join(currentDir, params[file])
        if (isDirectory(fullPath)) {
            dirs.push(params[file])
        } else {
            files.push(params[file])
        }
    }

    // 分别按数字序号排序
    dirs.sort(sortByNumber)
    files.sort(sortByNumber)

    // 先处理目录
    for (const dirName of dirs) {
        const fullPath = path.join(currentDir, dirName)
        const dirFiles = fs.readdirSync(fullPath)
        const filteredFiles = intersections(dirFiles, whiteList)
        const childItems = getList(filteredFiles, fullPath, `${pathname}/${dirName}`, options)

        if (childItems.length > 0) {
            const numericPrefix = getNumericPrefix(dirName)
            res.push({
                text: numericPrefix + dirName,
                collapsible,
                collapsed,
                items: childItems,
            })
        }
    }

    // 再处理文件
    for (const fileName of files) {
        const fullPath = path.join(currentDir, fileName)
        const name = path.basename(fileName)
        const suffix = path.extname(fileName)
        if (suffix !== '.md') {
            continue
        }
        const numericPrefix = getNumericPrefix(name)
        const title = extractTitle(fullPath)
        res.push({
            text: numericPrefix + title,
            link: `${pathname}/${name.replace(/\.md$/, '')}`,
        })
    }

    return res
}

/**
 * 生成指定目录的侧边栏配置
 * @param {string} pathname - 相对于文档根目录的路径（如 "/示例"、"/guide"）
 * @param {Object} options - 可选配置项
 * @param {boolean} options.collapsible - 目录是否可折叠，默认 true
 * @param {boolean} options.collapsed - 默认是否折叠，默认 false（展开状态）
 * @param {string[]} options.whiteList - 自定义黑名单列表，会与默认黑名单合并
 * @returns {Array} 侧边栏配置数组，可直接用于 VitePress 的 sidebar 配置
 */
export const set_sidebar = (pathname: string, options: SidebarOptions = {}): SidebarItem[] => {
    const {
        collapsible = true,
        collapsed = false,
        whiteList = []
    } = options

    const mergedWhiteList = [...new Set([...WHITE_LIST, ...whiteList])]

    const dirPath = path.join(DIR_PATH, pathname)
    const files = fs.readdirSync(dirPath)
    const items = intersections(files, mergedWhiteList)
    return getList(items, dirPath, pathname, {
        whiteList: mergedWhiteList,
        collapsible,
        collapsed
    })
}
