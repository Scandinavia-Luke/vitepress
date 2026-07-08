import path from 'node:path'
import fs from 'node:fs'

/**
 * VitePress 侧边栏自动生成工具
 * 
 * 根据文档目录结构自动生成侧边栏配置，支持以下特性：
 * - 多级目录支持：自动递归遍历子目录
 * - 智能排序：目录在前、文件在后，均按数字序号排序
 * - 标题提取：从 Markdown 文件的一级标题（#）提取侧边栏文本
 * - 数字前缀：自动提取文件名/目录名开头的数字序号（如 1.、2.）
 * - 可折叠配置：支持控制目录是否可折叠及默认折叠状态
 * - 黑名单过滤：过滤不需要的文件和目录
 * 
 * @module auto-gen-sidebar
 */

/**
 * 文档根目录路径，相对于当前脚本位置向上回溯两级（.vitepress/utils -> doc）
 * 使用 __dirname 确保在 ESM 模块中也能正确获取当前文件目录
 */
const DIR_PATH = path.resolve(__dirname, '../../')

/**
 * 黑名单列表，过滤不需要生成侧边栏的文件和文件夹
 * - index.md: 首页文件，不需要在侧边栏显示
 * - .vitepress: VitePress 配置目录
 * - node_modules: 依赖目录
 * - .idea: IDE 配置目录
 * - assets: 静态资源目录
 * - public: 静态资源公共目录
 * 添加默认黑名单
 */
const DEFAULT_EXCLUDE_LIST = ['index.md', '.vitepress', 'node_modules', '.idea', 'assets', 'public']

/**
 * 判断给定路径是否为目录
 * @param {string} targetPath - 要判断的路径
 * @returns {boolean} 是否为目录
 */
const isDirectory = (targetPath) => fs.lstatSync(targetPath).isDirectory()

/**
 * 计算两个数组的差集（arr1 中不在 arr2 中的元素）
 * @param {string[]} arr1 - 源数组
 * @param {string[]} arr2 - 排除数组
 * @returns {string[]} 差集结果
 */
const intersections = (arr1, arr2) => Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))))

/**
 * 从 Markdown 文件中提取一级标题作为侧边栏文本
 * 如果文件中没有一级标题，则回退使用文件名（不含 .md 后缀）
 * @param {string} filePath - Markdown 文件的完整路径
 * @returns {string} 一级标题文本，如果未找到则返回文件名
 */
const extractTitle = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8')
    // 匹配以 # 开头的行（一级标题），m 修饰符使 ^ 匹配每行开头
    const match = content.match(/^#\s+(.+)/m)
    if (match) {
        return match[1].trim()
    }
    // 未找到一级标题时，回退使用文件名（不含扩展名）
    return path.basename(filePath, '.md')
}

/**
 * 提取文件名/目录名开头的数字序号前缀（如 "1."、"2."）
 * 用于在侧边栏文本前添加序号
 * @param {string} name - 文件或目录名
 * @returns {string} 数字前缀，如 "1."；如果没有则返回空字符串
 */
const getNumericPrefix = (name) => {
    // 匹配开头的数字和点号（如 "1."、"12."）
    const match = name.match(/^(\d+\.)/)
    return match ? match[1] : ''
}

/**
 * 提取文件名/目录名开头的数字序号（如 "1"、"12"），用于排序
 * @param {string} name - 文件或目录名
 * @returns {number} 数字序号，如果没有则返回 Infinity（排到最后）
 */
const getSortNumber = (name) => {
    const match = name.match(/^(\d+)/)
    return match ? parseInt(match[1], 10) : Infinity
}

/**
 * 按数字序号排序的比较函数
 * 先按数字排序，数字相同时按中文拼音排序
 * @param {string} a - 第一个文件名/目录名
 * @param {string} b - 第二个文件名/目录名
 * @returns {number} 排序结果（负数表示 a 在 b 前，正数表示 b 在 a 前）
 */
const sortByNumber = (a, b) => {
    const numA = getSortNumber(a)
    const numB = getSortNumber(b)
    if (numA !== numB) {
        return numA - numB
    }
    // 数字相同时按中文拼音排序
    return a.localeCompare(b, 'zh-CN')
}

/**
 * 递归遍历目录，生成侧边栏配置项数组
 * @param {string[]} params - 当前目录下的文件/文件夹列表
 * @param {string} currentDir - 当前目录的完整路径
 * @param {string} pathname - 当前目录的相对路径（用于生成链接）
 * @param {Object} options - 配置选项
 * @param {string[]} options.excludeList - 黑名单列表，用于过滤不需要的文件/目录
 * @param {boolean} options.collapsible - 目录是否可折叠
 * @param {boolean} options.collapsed - 默认是否折叠
 * @returns {Array} 侧边栏配置项数组
 */
function getList(params, currentDir, pathname, options) {
    const res = []
    const { excludeList, collapsible, collapsed } = options

    // 分离目录和文件，目录在前，文件在后
    const dirs = []
    const files = []

    for (const file of params) {
        const fullPath = path.join(currentDir, file)
        if (isDirectory(fullPath)) {
            dirs.push(file)
        } else {
            files.push(file)
        }
    }

    // 分别按数字序号排序
    dirs.sort(sortByNumber)
    files.sort(sortByNumber)

    // 先处理目录
    for (const dirName of dirs) {
        const fullPath = path.join(currentDir, dirName)
        const dirFiles = fs.readdirSync(fullPath)
        // 过滤掉黑名单中的项目（解决深层目录黑名单未过滤问题）
        const filteredFiles = intersections(dirFiles, excludeList)
        // 递归生成子目录的侧边栏配置
        const childItems = getList(filteredFiles, fullPath, `${pathname}/${dirName}`, options)

        // 如果子目录下有内容，才生成侧边栏项
        if (childItems.length > 0) {
            const numericPrefix = getNumericPrefix(dirName)
            res.push({
                // 侧边栏显示文本：数字前缀 + 目录名
                text: numericPrefix + dirName,
                // 是否可折叠（可配置）
                collapsible: collapsible && !DEFAULT_EXCLUDE_LIST.includes(dirName),
                // 默认是否折叠（可配置）
                collapsed,
                // 子项列表
                items: childItems,
            })
        }
    }

    // 再处理文件
    for (const fileName of files) {
        const fullPath = path.join(currentDir, fileName)
        const name = path.basename(fileName)
        const suffix = path.extname(fileName)
        // 跳过非 Markdown 文件
        if (suffix !== '.md') {
            continue
        }
        // 提取文件名中的数字序号前缀
        const numericPrefix = getNumericPrefix(name)
        // 提取文件中的一级标题作为侧边栏文本
        const title = extractTitle(fullPath)
        res.push({
            // 侧边栏显示文本：数字前缀 + 一级标题
            text: numericPrefix + title,
            // 链接地址：相对路径（去掉 .md 后缀）
            link: `${pathname}/${name.replace(/\.md$/, '')}`,
        })
    }

    return res
}

/**
 * 生成指定目录的侧边栏配置（主函数）
 * 
 * @param {string} pathname - 相对于文档根目录的路径（如 "/示例"、"/guide"）
 * @param {Object} [options={}] - 可选配置项
 * @param {boolean} [options.collapsible=true] - 目录是否可折叠
 * @param {boolean} [options.collapsed=false] - 默认是否折叠（false=展开状态）
 * @param {string[]} [options.excludeList=[]] - 自定义黑名单列表，会与默认黑名单合并
 * @returns {Array} 侧边栏配置数组，可直接用于 VitePress 的 sidebar 配置
 * 
 * @example
 * // 基础用法（默认可折叠，展开状态）
 * set_sidebar('/示例')
 * 
 * @example
 * // 自定义配置（可折叠，默认折叠）
 * set_sidebar('/示例', {
 *     collapsible: true,   // 目录是否可折叠
 *     collapsed: true,     // 默认是否折叠（false=展开状态）
 * })
 * 
 * @example
 * // 添加自定义黑名单
 * set_sidebar('/示例', {
 *     excludeList: ['temp', 'draft']
 * })
 * 
 * @example
 * // 在 config.mts 中使用
 * import { defineConfig } from 'vitepress'
 * import { set_sidebar } from './utils/auto-gen-sidebar.js'
 * 
 * export default defineConfig({
 *     themeConfig: {
 *         sidebar: {
 *             '/示例': set_sidebar('/示例', {
 *                 collapsed: true,
 *                 collapsible: true
 *             }),
 *             '/guide': set_sidebar('/guide')
 *         }
 *     }
 * })
 */
export const set_sidebar = (pathname, options = {}) => {
    // 合并用户配置与默认值
    const {
        collapsible = true,
        collapsed = false,
        excludeList = []
    } = options

    // 合并默认黑名单与用户自定义黑名单，去重
    const mergedExcludeList = [...new Set([...DEFAULT_EXCLUDE_LIST, ...excludeList])]

    // 获取目标目录的完整路径
    const dirPath = path.join(DIR_PATH, pathname)
    // 读取目录下的所有文件和文件夹
    const files = fs.readdirSync(dirPath)
    // 过滤掉黑名单中的项目
    const items = intersections(files, mergedExcludeList)
    // 递归生成侧边栏配置（将配置选项透传到递归层）
    return getList(items, dirPath, pathname, {
        excludeList: mergedExcludeList,
        collapsible: collapsible && !mergedExcludeList.includes(pathname),
        collapsed
    })
}
