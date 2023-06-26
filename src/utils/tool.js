
// 复制内容到剪切板
const copyText = (content) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(content)
  } else {
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    textarea.style.position = 'fixed'
    textarea.style.clip = 'rect(0 0 0 0)'
    textarea.style.top = '10px'

    textarea.value = content
    textarea.select()
    document.execCommand('copy', true)
    document.body.removeChild(textarea)
  }
}

export {
  copyText
}
