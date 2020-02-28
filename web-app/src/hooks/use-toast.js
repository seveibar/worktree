export default () => {
  return {
    success: (...args) => console.log(...args),
    info: (...args) => console.log(...args),
    error: (...args) => console.error(...args)
  }
}
