// 异步请求
export function getItemData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ 'text': 12344 })
    }, 10)
  })
}
